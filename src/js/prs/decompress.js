// USED WITH PERMISSION OF AUTHER Daan Vanden Bosch

/**
 * This code is based on the Sylverant PRS decompression code written by Lawrence Sebald.
 */

function decompress(cursor) {
    const ctx = new Context_decompress(cursor);

    while (true) {
        if (ctx.read_flag_bit() === 1) {
            // Single byte copy.
            ctx.copy_u8();
        } else {
            // Multi byte copy.
            let length;
            let offset;

            if (ctx.read_flag_bit() === 0) {
                // Short copy.
                length = ctx.read_flag_bit() << 1;
                length |= ctx.read_flag_bit();
                length += 2;

                offset = ctx.read_u8() - 256;
                console.log("short copy")
            } else {
                // Long copy or end of file.
                offset = ctx.read_u16();

                // Two zero bytes implies that this is the end of the file.
                if (offset === 0) {
                    console.log("eof")
                    break;
                }

                // Do we need to read a length byte, or is it encoded in what we already have?
                length = offset & 0b111;
                offset >>>= 3;

                if (length === 0) {
                    console.log("long long copy")
                    length = ctx.read_u8();
                    length += 1;
                } else {
                    console.log("short long copy")
                    length += 2;
                }

                offset -= 8192;
            }

            ctx.offset_copy(offset, length);
        }
    }

    return ctx.dst.seek_start(0);
}

class Context_decompress {

    constructor(cursor) {
        this.src = cursor;
        this.dst = new ArrayBufferCursor(4 * cursor.size, cursor.little_endian);
        this.flags = 0;
        this.flag_bits_left = 0;
    }

    read_flag_bit() {
        // Fetch a new flag byte when the previous byte has been processed.
        if (this.flag_bits_left === 0) {
            this.flags = this.read_u8();
            this.flag_bits_left = 8;
        }

        let bit = this.flags & 1;
        this.flags >>>= 1;
        this.flag_bits_left -= 1;
        return bit;
    }

    copy_u8() {
        this.dst.write_u8(this.read_u8());
    }

    read_u8() {
        return this.src.u8();
    }

    read_u16() {
        return this.src.u16();
    }

    offset_copy(offset, length) {
        if (offset < -8192 || offset > 0) {
            console.error(`offset was ${offset}, should be between -8192 and 0.`);
        }

        if (length < 1 || length > 256) {
            console.error(`length was ${length}, should be between 1 and 256.`);
        }

        // The length can be larger than -offset, in that case we copy -offset bytes size/-offset times.
        const buf_size = Math.min(-offset, length);

        this.dst.seek(offset);
        const buf = this.dst.take(buf_size);
        this.dst.seek(-offset - buf_size);

        for (let i = 0; i < Math.floor(length / buf_size); ++i) {
            this.dst.write_cursor(buf);
        }

        this.dst.write_cursor(buf.take(length % buf_size));
    }
}
