// soething is up with reading the quest number and the language.

class FileObj{

    constructor(buff){
        function *fileStream(buffer) {
          let index = 0;
          let value = null;
          while (true) {
            value = buffer.slice(index,index+1)
            index+=1
            yield value;
          }
        }
        this.fs = fileStream(buff);
    }

    // get byte in little endian
    get readUint8(){ 
        return new DataView(this.fs.next().value).getUint8(0,true) 
    }

    // get word in little endian
    get readUint16(){ 
        function concatBuffers(a, b)  {
            return function(a, b) {
                var c = new (a.constructor)(a.length + b.length);
                c.set(a, 0);
                c.set(b, a.length);
                return c;
            }(
                new Uint8Array(a.buffer || a), 
                new Uint8Array(b.buffer || b)
            ).buffer;
        }
        return new DataView(concatBuffers(this.fs.next().value,this.fs.next().value)).getUint16(0,true) }

    // get dword in little endian
    get readUint32(){
        function concatBuffers(a, b)  {
            return function(a, b) {
                var c = new (a.constructor)(a.length + b.length);
                c.set(a, 0);
                c.set(b, a.length);
                return c;
            }(
                new Uint8Array(a.buffer || a), 
                new Uint8Array(b.buffer || b)
            ).buffer;
        }
        return new DataView(concatBuffers(
            concatBuffers(this.fs.next().value,this.fs.next().value),
            concatBuffers(this.fs.next().value,this.fs.next().value))
            ).getUint32(0,true)
    }
}

function loadFileAsText(){
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        let fileClass = new FileObj(fileLoadedEvent.target.result)
        // Jump to function that does all the work from here
        readHeader(fileClass)
    }
    fileReader.readAsArrayBuffer(fileToLoad);
}

// Header types
//
// struct psobb_bin_t {
//     uint32_t object_code_offset;
//     uint32_t function_offset_table_offset;
//     uint32_t bin_size;
//     uint32_t xffffffff;
//     uint32_t quest_number;
//     uint32_t language;
//     uint16_t quest_name[32];
//     uint16_t short_description[128];
//     uint16_t long_description[288];
//     uint32_t padding;
//     uint32_t items_list[932];
// };
//
// struct psov3_bin_t {
//     uint32_t object_code_offset;
//     uint32_t function_offset_table_offset;
//     uint32_t bin_size;
//     uint16_t language;
//     uint16_t quest_number;
//     uint16_t quest_name[32];
//     uint16_t short_description[128];
//     uint16_t long_description[288];
//     uint32_t padding;

function readHeader(file){
    var quest = {}

    quest.object_code_offset = file.readUint32
    quest.function_offset_table_offset = file.readUint32
    quest.bin_size = file.readUint32
    quest.language = file.readUint16
    if (quest.language === 0xFFFF){ 
        console.log('bb quest')
        // we're dealing with a BB quest
        if (file.readUint16 !== 0xFFFF){
            console.log("Bad File Header, did not match v3 or bb");
            return null;
        }
        quest.quest_number = file.readUint32
        //quest.language = file.readUint32
    } else {
        // this is a v3 quest
        console.log('v3 quest')
        quest.quest_number = file.readUint16
    }
    quest.quest_name = ""
    for (var i = 0; i<16; i++){
        ch = String.fromCharCode(file.readUint16)
        console.log(i+"\t"+ch)
        if (ch !== 0x00) {
            quest.quest_name += ch
        }
    }
    quest.short_description = ""
    for (var i = 0; i<128; i++){
        ch = String.fromCharCode(file.readUint16)
        if (ch !== 0x00) quest.short_description += ch
    }
    quest.long_description = ""
    for (var i = 0; i<288; i++){
        ch = String.fromCharCode(file.readUint16)
        if (ch !== 0x00) quest.long_description += ch
    }



    console.log(quest)




}