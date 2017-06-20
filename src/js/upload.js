function loadFileAsText(file){
    var fileToLoad = document.getElementById(file).files[0];
        var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        let fileClass = new FileStream(fileLoadedEvent.target.result)
        // Jump to function that does all the work from here
        readHeader(fileClass)
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
    index = 0
    ret = {}
    ret["dat"] = new Uint8Array();
    ret["bin"] = new Uint8Array();

    function read_u(s){ 
        dv = new DataView(array.slice(index, index+s)) 
        index+=1

        ret = dv.getUint8(0,true)
        if (s == 16) ret = dv.getUint16(0,true)
        if (s == 32) ret = dv.getUint32(0,true)

        return ret
    }

    while(index < qst.length){
        // 0x041c = data
        // 0x0088 = header
        check = read_u(16)
        if (check === 0x0088 && !ret["number"]) {
            // Header section
            index += 2 // skip 0x0044 bytes
            index += 2 // skip quest number (it's in .bin)
            index += 38 // skip unknown values
            index += 16 // skip filename
            fsize += 4 // skip filesize
            index += 24 // skip jfilename
        } else {
            // data section
            index += 2 // skip 0x0013 bytes
            chunkNumber = read_u(8)
            index += 3 // skip 0x000000
            file = ""
            for (var x = 0; x < 16; x++){
                c = read_u(8)
                if (char(c) === ".") {
                    c = read_u(8)
                    if (char(c) === "b") file = "bin"
                    if (char(c) === "d") file = "dat"
                    if (file === "") {
                        alert("Bad Data Header in file with chunkNumber "+chunkNumber)
                        return null
                    }
                }
            }
            data = read_u(1024)
            size = read_u(32)
            for( var v = 0; v < size; v++){
                if (file === "bin") ret["bin"][ret["bin"].length] = data[v]
                if (file === "dat") ret["dat"][ret["dat"].length] = data[v]
            }
            index+=4 // skip footer
        }
    }

    // unpack
    ret["dat"] = PRS_Decompress(ret["dat"])
    ret["bin"] = PRS_Decompress(ret["bin"])
    return ret
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
    array = b
    array_index = 0
    end = new Uint8Array()
    loop = 0

    flagByte = 0x00
    flagByte_index = 0x00
    flagByte_code = 0x00

    function read_u8(i = 0, advance = true){ 
        ret = new DataView(array.slice(i+array_index, i+array_index+1)).getUint8(0,true) 
        if (advance) array_index+=1
        return ret
    }

    function readFlagBit(){
        if (flagByte_index === 0x00) {
            flagByte = read_u8()
            flagByte_index = 0x01
        }
        flagByte_code ^= (flagByte & flagByte_index)
        flagByte_index <<< 1
        if (ret) return 1
        return 0;
    }

    function clearFlagByte(){
        flagByte = 0x00
    }

    while(++loop){

        if (flag) flagByte_code = 0x00
        flag = false


        if (readFlagBit()) {
            // raw copy code here
            end[end.length] = read_u8()
            flag = true;
        } else {
            if (readFlagBit()){
                // long copies
                byteA = read_u8();
                byteB = read_u8();
                offset = (byteB << 5)|(byteA >> 3)
                code = byteA & 0x07

                // EOF - exit and return
                if ((byteA === 0x00) && (byteB === 0x00)) return end.buffer;

                // long big copy
                if (code === 0x07) code = read_u8()

                // big copy
                for (var x = 0; x < code; x++) end[end.length] = read_u8(offset,false)

                flag = true;
            } else {
                // short copy
                clearFlagByte();
                readFlagBit()
                readFlagBit()
                while (FlagByte_code){
                    end[end.length] = read_u8()
                    FlagByte_code -= 1
                }
                flag = true
            }
        }
    }
}

// takes an ArrayBuffer of decoded .bin file
// and sets all the HTML elements to the values contained
function BIN_Process(bin){
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
            if (c !== 0x00) {
                ret += char(c)
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

    flag_list = {}
    for(var funcNum=0; index < fnc_code_offset; funcNum++)
        i = read_u32()
        flag_list.add(i:funcNum)
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
        if (op === 0xF8 || op === 0xF9) op = op <<< 8 + read_u8()
        opObj = {
            Flags=null,
            Name=opcodes[op.toString(16)].Name, 
            Eparam = opcodes[op.toString(16)].Parameters.split('')
            Aparam = null
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
            if (x === 'p') 
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




        