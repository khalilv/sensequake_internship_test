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


    var rawData = {header : "", data : [], numAxes : -1}; 

    app.get("/data", (req, res) => {
        
        //get the header text into rawData.header
        fs.readFile('./data/Setup7_sensor3.bin', function(err,data){
            if(err){
               throw err; 
            }else{
                var rawDataString = data.toString();
                var start = rawDataString.indexOf("\n",rawDataString.indexOf("Sensor ID:")); 
                var end = rawDataString.indexOf("\n",start + 1); 
                rawData.numAxes = rawDataString.substring(start + 1,end).split(" ").length; //number of datapoints per sample 
                rawData.header =  rawDataString.substring(0,rawDataString.indexOf("\r\n\r\n")); //header extracted from file 
            }
        }); 

        //process the data points
        var stream = fs.createReadStream("data/Setup7_sensor3.bin", { encoding: null }); 
        stream.on('data', function(chunk){
            //move start index forward to data 
            for(var i = 0; i < chunk.length - 4; i++){
                if(chunk[i] == 13 && chunk[i+1] == 10 && chunk[i+2] == 13 && chunk[i+3] == 10){
                    dataStartIndex = i+4; 
                    break; 
                }
            }
            //process the data and convert to decimal
            for(var i = dataStartIndex; i < chunk.length; i = i+=3){
                var isNegative = false; 
                var num1 = convertToBinary(chunk[i]); 
                var num2 = convertToBinary(chunk[i+1]); 
                var num3 = convertToBinary(chunk[i+2]); 
                var strValue = num3 + num2 + num1 + "00000000"; 
                var decimalValue = 0; 
                if(strValue[0] == "1"){
                    decimalValue = -convertToDecimal(addBinary(flipBits(strValue),"1")); 
                }else{
                    decimalValue = convertToDecimal(strValue); 
                }
                rawData.data.push(" " + decimalValue); //push all the data here
            }
        });
        
        //process the data into samples based on the sample size 
        var processedArray = [];
        var sample = [];  
        for(var i = 0; i < rawData.data.length; i++){
            if(sample.push(rawData.data[i]) == rawData.numAxes){
                processedArray.push(sample); 
                sample = []; //new sample once you have reached the sample size 
            }
        }
        var responseObject = {header : rawData.header, processedData : processedArray}; 
        rawData.data = []; //reset the raw data to avoid constant appending
        return res.send(responseObject);
    });

    app.get("/", (req, res) => {
        res.render("index.ejs",{
            randomInt: Math.floor(Math.random()*100), 
        }); 
    });

};