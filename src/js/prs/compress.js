// USED WITH PERMISSION OF AUTHER Daan Vanden Bosch

/**
 * This code is based on the Sylverant PRS compression code written by Lawrence Sebald.
 */

function compress(src) {
    const ctx = new Context_compress(src);
    const hash_table = new HashTable();

    if (ctx.src.size <= 3) {
        // Make a literal copy of the input.
        while (ctx.src.bytes_left) {
            ctx.set_bit(1);
            ctx.copy_literal();
        }
    } else {
        // Add the first two "strings" to the hash table.
        hash_table.put(hash_table.hash(ctx.src), 0);
        ctx.src.seek(1);
        hash_table.put(hash_table.hash(ctx.src), 1);
        ctx.src.seek(-1);

        // Copy the first two bytes as literals.
        ctx.set_bit(1);
        ctx.copy_literal();
        ctx.set_bit(1);
        ctx.copy_literal();

        while (ctx.src.bytes_left > 1) {
            let [offset, mlen] = ctx.find_longest_match(hash_table, false);

            if (mlen > 0) {
                ctx.src.seek(1);
                const [offset2, mlen2] = ctx.find_longest_match(hash_table, true);
                ctx.src.seek(-1);

                // Did the "lazy match" produce something more compressed?
                if (mlen2 > mlen) {
                    let copy_literal = true;
                    // Check if it is a good idea to switch from a short match to a long one.
                    if (mlen >= 2 && mlen <= 5 && offset2 < offset) {
                        if (offset >= -256 && offset2 < -256) {
                            if (mlen2 - mlen < 3) {
                                copy_literal = false;
                            }
                        }
                    }

                    if (copy_literal) {
                        ctx.set_bit(1);
                        ctx.copy_literal();
                        continue;
                    }
                }

                // What kind of match did we find?
                if (mlen >= 2 && mlen <= 5 && offset >= -256) {
                    // Short match.
                    ctx.set_bit(0);
                    ctx.set_bit(0);
                    ctx.set_bit((mlen - 2) & 0x02);
                    ctx.set_bit((mlen - 2) & 0x01);
                    ctx.write_literal(offset & 0xFF);
                    ctx.add_intermediates(hash_table, mlen);
                    continue;
                } else if (mlen >= 3 && mlen <= 9) {
                    // Long match, short length.
                    ctx.set_bit(0);
                    ctx.set_bit(1);
                    ctx.write_literal(((offset & 0x1F) << 3) | ((mlen - 2) & 0x07));
                    ctx.write_literal(offset >> 5);
                    ctx.add_intermediates(hash_table, mlen);
                    continue;
                } else if (mlen > 9) {
                    // Long match, long length.
                    if (mlen > 256) {
                        mlen = 256;
                    }

                    ctx.set_bit(0);
                    ctx.set_bit(1);
                    ctx.write_literal((offset & 0x1F) << 3);
                    ctx.write_literal(offset >> 5);
                    ctx.write_literal(mlen - 1);
                    ctx.add_intermediates(hash_table, mlen);
                    continue;
                }
            }

            // If we get here, we didn't find a suitable match, so just we just make a literal copy.
            ctx.set_bit(1);
            ctx.copy_literal();
        }

        // If there's a left over byte at the end, make a literal copy.
        if (ctx.src.bytes_left) {
            ctx.set_bit(1);
            ctx.copy_literal();
        }
    }

    ctx.write_eof();

    return ctx.dst.seek_start(0);
}

const MAX_WINDOW = 0x2000;
const WINDOW_MASK = MAX_WINDOW - 1;
const HASH_SIZE = 1 << 8;

class Context_compress {

    constructor(cursor) {
        this.src = cursor;
        this.dst = new ArrayBufferCursor(cursor.size, cursor.little_endian);
        this.flags = 0;
        this.flag_bits_left = 0;
        this.flag_offset = 0;
    }

    set_bit(bit) {
        if (!this.flag_bits_left--) {
            // Write out the flags to their position in the file, and store the next flags byte position.
            const pos = this.dst.position;
            this.dst
                .seek_start(this.flag_offset)
                .write_u8(this.flags)
                .seek_start(pos)
                .write_u8(0); // Placeholder for the next flags byte.
            this.flag_offset = pos;
            this.flag_bits_left = 7;
        }

        this.flags >>>= 1;

        if (bit) {
            this.flags |= 0x80;
        }
    }

    copy_literal() {
        this.dst.write_u8(this.src.u8());
    }

    write_literal(value) {
        this.dst.write_u8(value);
    }

    write_final_flags() {
        this.flags >>>= this.flag_bits_left;
        const pos = this.dst.position;
        this.dst
            .seek_start(this.flag_offset)
            .write_u8(this.flags)
            .seek_start(pos);
    }

    write_eof() {
        this.set_bit(0);
        this.set_bit(1);

        this.write_final_flags();

        this.write_literal(0);
        this.write_literal(0);
    }

    match_length(s2) {
        const array = this.src.uint8_array_view();
        let len = 0;
        let s1 = this.src.position;

        while (s1 < array.byteLength && array[s1] === array[s2]) {
            ++len;
            ++s1;
            ++s2;
        }

        return len;
    }

    find_longest_match(hash_table, lazy){
        if (!this.src.bytes_left) {
            return [0, 0];
        }

        // Figure out where we're looking.
        const hash = hash_table.hash(this.src);

        // If there is nothing in the table at that point, bail out now.
        let entry = hash_table.get(hash);

        if (entry === null) {
            if (!lazy) {
                hash_table.put(hash, this.src.position);
            }

            return [0, 0];
        }

        // If we'd go outside the window, truncate the hash chain now. 
        if (this.src.position - entry > MAX_WINDOW) {
            hash_table.hash_to_offset[hash] = null;

            if (!lazy) {
                hash_table.put(hash, this.src.position);
            }

            return [0, 0];
        }

        // Ok, we have something in the hash table that matches the hash value.
        // Follow the chain to see if we have an actual string match, and find the longest match.
        let longest_length = 0;
        let longest_match = null;

        while (entry !== null) {
            const mlen = this.match_length(entry);

            if (mlen > longest_length || mlen >= 256) {
                longest_length = mlen;
                longest_match = entry;
            }

            // Follow the chain, making sure not to exceed a difference of MAX_WINDOW.
            let entry2 = hash_table.prev(entry);

            if (entry2 !== null) {
                // If we'd go outside the window, truncate the hash chain now.
                if (this.src.position - entry2 > MAX_WINDOW) {
                    hash_table.set_prev(entry, null);
                    entry2 = null;
                }
            }

            entry = entry2;
        }

        // Add our current string to the hash.
        if (!lazy) {
            hash_table.put(hash, this.src.position);
        }

        // Did we find a match?
        const offset = longest_length > 0 ? longest_match - this.src.position : 0;
        return [offset, longest_length];
    }

    add_intermediates(hash_table, len) {
        this.src.seek(1);

        for (let i = 1; i < len; ++i) {
            const hash = hash_table.hash(this.src);
            hash_table.put(hash, this.src.position);
            this.src.seek(1);
        }
    }
}

class HashTable {

    constructor(){
        hash_to_offset = new Array(HASH_SIZE).fill(null);
        masked_offset_to_prev = new Array(MAX_WINDOW).fill(null);
    }
    
    hash(cursor) {
        let hash = cursor.u8();

        if (cursor.bytes_left) {
            hash ^= cursor.u8();
            cursor.seek(-1);
        }

        cursor.seek(-1);
        return hash;
    }

    get(hash) {
        return this.hash_to_offset[hash];
    }

    put(hash, offset) {
        this.set_prev(offset, this.hash_to_offset[hash]);
        this.hash_to_offset[hash] = offset;
    }

    prev(offset) {
        return this.masked_offset_to_prev[offset & WINDOW_MASK];
    }

    set_prev(offset, prev_offset) {
        this.masked_offset_to_prev[offset & WINDOW_MASK] = prev_offset;
    }
}