function loadFileAsText(file){
    var fileToLoad = document.getElementById("fileToLoad").files[0];
        var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        // Jump to function that does all the work from here
        qstObj = QST_Unpack(fileLoadedEvent.target.result)
        BIN_Process(qstObj["bin"]);
    }
    fileReader.readAsArrayBuffer(fileToLoad);
}

// takes an ArrayBuffer of the qst file
// returns an object as defined:
// {
//  bin: ArrayBuffer (decoded)
//  dat: ArrayBuffer (decoded)
// }
function QST_Unpack(qst){
    console.log("unpacking qst file")
    index = 0
    obj = {
        "dat": [],
        "bin": []
    }

    function read_u(s){ 
        read_slice = qst.slice(index, index+(s/8))
        dv = new DataView(read_slice) 
        index+=(s/8)

        ret = dv.getUint8(0,true)
        if (s == 16) ret = dv.getUint16(0,true)
        if (s == 32) ret = dv.getUint32(0,true)
        if (s == 1024) ret = new Uint8Array(read_slice)

        return ret
    }



    while(index < qst.byteLength){
        // 0x041c = data = 1052
        // 0x0088 = header = 88
        check = read_u(16)
        if (check === 0x0058) {
            console.log("reading header")
            // Header section
            index += 2 // skip 0x0044 bytes
            index += 2 // skip quest number (it's in .bin)
            index += 38 // skip unknown values
            index += 16 // skip filename
            index += 4 // skip filesize
            index += 24 // skip jfilename
        } else {
            console.log("reading message")
            // data section
            index += 2 // skip 0x0013 bytes
            chunkNumber = read_u(8)
            index += 3 // skip 0x000000
            file = ""
            for (var x = 0; x < 15; x++){
                c = read_u(8)
                if (String.fromCharCode(c) === ".") {
                    c = read_u(8)
                    if (String.fromCharCode(c) === "b") file = "bin"
                    if (String.fromCharCode(c) === "d") file = "dat"
                    if (file === "") {
                        alert("Bad Data Header in file with chunkNumber "+chunkNumber)
                        return null
                    }
                }
            }

            data = new Uint8Array(qst.slice(index, index+(1024)))
            index+=1024 // multiply it by 8 since we're doing bytes and the read_u takes bits
         //   data = new Uint8Array(qst.slice(index, index+(128)))
         //  index+=128
            size = read_u(32)
            if (size > 1024) {
                alert("ERROR, Size exceeded window")
                console.log("size = "+size.toString(16))
                return null
            }
            for( var v = 0; v < size; v++){
                if (file === "bin") obj["bin"][obj["bin"].length] = data[v]
                if (file === "dat") obj["dat"][obj["dat"].length] = data[v]
               // console.log(data)
            }
            index+=4 // skip footer
        }
    }

    console.log("done unpacking qst file")


    


    // unpack
 //   obj["dat"] = PRS_Decompress(new Uint8Array(obj["dat"]).buffer)
    //obj["bin"] = PRS_Decompress(new Uint8Array(obj["bin"]).buffer)
    console.log(new Uint8Array(obj["bin"]))
    obj["bin"] = decompress(new ArrayBufferCursor(new Uint8Array(obj["bin"]).buffer),true)
    console.log("made it out of decompress")
    return obj
}

/*

0x1 A           copy A
0x00nn A        copy nn+2 bits from A
0x01 0x00 0x00  EOF
0x01 FFF A 
if FFF != 7 copy FFF+2 bytes from (B << 5)|(A >> 3) 
if FFF == 7 copy C+1 from (B << 5)|(A >> 3) 

*/

// takes a prs compressed ArrayBuffer
// returns a decompressed ArrayBuffer
function PRS_Decompress(b){
    console.log("decompressing a file")
    array = b
    array_index = 0
    end = []
    loop = 0

    flagByte = 0x00
    flagByte_index = 0x00
    flagByte_code = 0x00

    function read_u8(i = 0, advance = true){ 
        read_slice = array.slice(array_index, array_index+1)
        dv = new DataView(read_slice)  
        if (advance) array_index+=1
        return dv.getUint8(0,true)
    }

    function read_u16(){ 
        read_slice = array.slice(array_index, array_index+2)
        dv = new DataView(read_slice)
        array_index+=2
        return dv.getUint16(0,true)
    }

    function offset_copy(offset, length){
        // copy length bytes from offset bytes
        for (var x = 0; x < length; x++) end[end.length] = read_u8(offset+x+index,false)
    }

    function readFlagBit(){
        if (flagByte_index === 0x00 || flagByte_index > 0xA000) {
            flagByte = read_u8()
            flagByte_index = 0x01
        }
        flagByte_code ^= (flagByte & flagByte_index)
        flagByte_index = flagByte_index << 2
        if (flagByte_code) return 1
        return 0;
    }


    while(true){
       // console.log("index :"+array_index)

        if (readFlagBit()) {
            // raw copy code here
            console.log("Raw Copy")
            end[end.length] = read_u8()
        } else {
            if (readFlagBit()){
                // long copies
                offset = read_u16();
                code = offset & 0x07

                // EOF - exit and return
                if (!offset) {
                    console.log("done decompressing")

                    saveAs(new Blob([new Uint8Array(end).buffer]),"filePRS.bin")
                    return new Uint8Array(end).buffer;
                }

                offset >>>= 3
                offset -= 8192; // make it signed

                // long big copy
                if (code === 0x00) {
                    console.log("long Big Copy")
                    code = read_u8() + 1
                } else {
                    console.log("long small copy")
                    code += 2
                }

                // big copy
                offset_copy(offset,code)

            } else {
                console.log("Short Copy")
                // short copy
                si = readFlagBit()*2 + readFlagBit() + 2
                off = read_u8() - 256
                offset_copy(off,si)
            }
        }
    }
}

// takes an ArrayBuffer of decoded .bin file
// and sets all the HTML elements to the values contained
function BIN_Process(bin){
    console.log(new Uint8Array(bin))
    index = 0

    function read_u8(){ 
        ret = new DataView(array.slice(index, index+1)).getUint8(0,true) 
        array_index+=1
        return ret
    }

    function read_u16(){ 
        ret = new DataView(array.slice(index, index+2)).getUint16(0,true) 
        array_index+=2
        return ret
    }

    function read_u32(){ 
        ret = new DataView(array.slice(index, index+4)).getUint32(0,true) 
        array_index+=4
        return ret
    }

    function read_string(size){
        ret = ""
        for( var a = 0; a < size; a++){
            c = read_u16()
            if (c !== 0x0000) {
                ret += String.fromCharCode(c)
            }
        }
        return ret
    }

    if ((new DataView(array.slice(12,16)).getUint32(0,true) === 0xFFFFFFFF)){
        // BB Header
        obj_code_offset = read_u32()
        fnc_code_offset = read_u32()
        bin_size = read_u32()
        xFFFFFFFF = read_u32()
        quest_number = read_u32()
        language = read_u32()
        quest_name = read_string(32)
        short_description = read_string(128)
        long_description = read_string(288)
        index += 4 // padding
        index += 932*4 // object table <----------------- Not implemented yet
    } else {
        // Old Header
        obj_code_offset = read_u32()
        fnc_code_offset = read_u32()
        bin_size = read_u32()
        language = read_u16()
        quest_number = read_u16()
        quest_name = read_string(32)
        short_description = read_string(128)
        long_description = read_string(288)
        index += 4 // padding
    }

    console.log("-------")
    console.log((new DataView(array.slice(12,16)).getUint32(0,true)).toString(16))
    console.log(obj_code_offset)
    console.log(fnc_code_offset)
    console.log(bin_size)
    console.log(language)
    console.log(quest_number)
    console.log(quest_name)
    console.log(short_description)
    console.log(long_description)

    return;

    flag_list = {}
    for(var funcNum=0; index < fnc_code_offset; funcNum++){
        i = read_u32()
        flag_list[i] = funcNum
    }

    // loop over filebuffer:
    //  generate {
    //    flags=null
    //    name=opcodes[].Name
    //    Eparam=opcodes[].Parameters
    //    Aparam=[data]
    //  }[]
    opList = []
    while(index < bin.length){
        op = read_u8()
        if (op === 0xF8 || op === 0xF9) op = op << 8 + read_u8()
        opObj = {
            "Flags":null,
            "Name":opcodes[op.toString(16)].Name, 
            "Eparam" : opcodes[op.toString(16)].Parameters.split(''),
            "Aparam" : null
        }
        ////// Eparam Codes  *check for accuracy  ~not implemented
        // p        Push onto stack
        // a        Pop stack
        // B        8-bit unsigned integer
        // W        16-bit unsigned integer
        // L        32-bit unsigned integer
        // I        32-bit signed integer
        // f or F   32-bit floating point number
        // r or R   8-bit register reference?
        // b        *Something with global_flags
        // w        *Something with gset
        // j        *switch locations (size=u8,locations[]=u16)
        // t        *jmp_on switches
        // s or S   *string (null terminating)
        // Z        ~Function Location (u16?)
        for (var x in Eparam){
            if (x === 'a') break;

        }
    }


    // loop over flags list
    //  fill in flags values in generated list


    // loop over generated list
    //  if Eparam starts with 'p' push Aparam onto a stack & delete opcode obj
    //  if Eparam starts with 'a' move Eparam stuff off stack into Aparam


    // loop over altered list
    //  generate string
    //      opcodes start with \t
    //      function flags come before opcode and end with a \n
    //      param are comm


}




        