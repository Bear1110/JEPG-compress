fs = require('fs');
dct = require('./FastDct')
t = require('./table')
let data = fs.readFileSync('afterCompress.bear')
let len = data.length , longSting = ''
for(let i = 0 ; i < len ; i++){    
    let bin = data[i].toString(2);
    while(bin.length != 8){
        bin = '0'+bin
    }
    longSting += bin
}
console.log(longSting)
//拿掉最後的 10000
len = longSting.length
do{
    longSting = longSting.substring(0,--len)
}
while(longSting.charAt(len-1) != '1')