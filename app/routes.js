const fs = require("fs");

module.exports = app => {

    //converts input number to binary string with leading 0's
    function convertToBinary(dec){
        var leadingZeros = ""; 
        var result = (dec >>> 0).toString(2);
        for(var i = result.length; i < 8; i++){
            leadingZeros += "0"; 
        }
        return leadingZeros += result; 
    }

    //add two binary numbers together
    function addBinary(a,  b) 
    {  
        var result = "";  
        var s = 0;          

        var i = a.length - 1;
        var j = b.length - 1; 
        while (i >= 0 || j >= 0 || s == 1) 
        { 
              
            s += ((i >= 0)? a.charAt(i) - '0': 0); 
            s += ((j >= 0)? b.charAt(j) - '0': 0); 
            result = (s % 2 ) + result; 
    
            s = Math.floor(s / 2); 
            i--; j--; 
        } 
          
    return result; 
    } 

    //flips all bits of a binary string
    function flipBits(binaryString){
        var returnString = ""
        for(var i = 0; i < binaryString.length; i++){
            if(binaryString[i] == 1){
                returnString += "0"; 
            }else{
                returnString += "1"; 
            }
        }
        return returnString; 
    }

    //converts binary string to decimal 
    function convertToDecimal(bin) { 
        return parseInt((bin + '')
        .replace(/[^01]/gi, ''), 2);
    }

    app.get("/data", (req, res) => {
        fs.createReadStream("data/Setup7_sensor3.bin", { encoding: null }).pipe(res);
    });

    app.get("/", (req, res) => {
        res.render("index.ejs",{
            randomInt: Math.floor(Math.random()*100), 
        }); 
    });

};
