fs = require('fs')
dct = require('./FastDct')
t = require('./table')
let config = JSON.parse(fs.readFileSync('./config.json'))
const QF = config.QF
let data = fs.readFileSync('afterCompress.bear')
let len = data.length , longSting = ''
for(let i = 0 ; i < len ; i++){    
    let bin = data[i].toString(2);
    while(bin.length != 8){
        bin = '0'+bin
    }
    longSting += bin
}
//拿掉最後的 10000
len = longSting.length
if(longSting.charAt(len-1) == '1'){
    longSting = longSting.substring(0,--len)
}else{    
    do{
        longSting = longSting.substring(0,--len)
    }
    while(longSting.charAt(len-1) != '1')
}

len = longSting.length
let bitI = 0
let readTemp = ''
let squares = []
let dpcm = 0
while(squares.length != 4096){
    readTemp = ''
    let zigzag = []
    //dc
    while(t.decodeDCCategoryCodeWord[readTemp] == undefined){        
        readTemp += longSting.charAt(bitI++)
    }
    let ssss = t.decodeDCCategoryCodeWord[readTemp]
    readTemp = ''
    let x
    if(ssss ==0){
        readTemp += longSting.charAt(bitI++)
        x = dpcm
    }else{
        for(let ggg = 0 ; ggg < ssss; ggg++)
            readTemp += longSting.charAt(bitI++)        
        x = t.decodeDCvalueCodeWord(readTemp)+dpcm
    }
    dpcm = x
    zigzag.push(x) // first dc
    while(zigzag.length != 64){//AC
        readTemp = ''
        while(t.decodeACCoefficientsInJPEG[readTemp]  == undefined ){
            readTemp += longSting.charAt(bitI++)
        }
        if(readTemp == '1010'){ // EOB
            while(zigzag.length != 64){
                zigzag.push(0)
            }
            break
        }
        let [run,size] = t.decodeACCoefficientsInJPEG[readTemp]
        if(run == 15 && size == 0){//ZRL
            for(let gg = 0 ; gg < 16; gg++)
                zigzag.push(0)
        }else{
            for(let gg = 0 ; gg < run; gg++)
                zigzag.push(0)
            readTemp = ''
            for(let gg = 0 ; gg < size; gg++)
                readTemp += longSting.charAt(bitI++)
            zigzag.push(t.decodeDCvalueCodeWord(readTemp))
        }
    }
    if(readTemp != '1010'){//這邊要處理 剛好 64個 的數字
        for(let i = 0 ; i < 4 ; i++)
            longSting.charAt(bitI++) //1
    }
    squares.push(t.zigzag2square(zigzag))
}
len = squares.length
const Luminance = t.LuminanceQF(QF)
for(let i = 0 ; i < len ; i++){
    let gg = squares[i]
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
            gg[i][j] = gg[i][j]*Luminance[i][j]
    gg = dct.idct2d(gg)
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
            gg[i][j] = Math.round(gg[i][j])
    squares[i] = gg
}
let bigPicture = new Array(512)
for(let i = 0 ; i < 512 ; i++){
    bigPicture[i] = new Array(512)
}
for(let i = 0 , j = 0, k = 0; i < len ; i++){//  8*8 4096
    let square = squares[i]
    for(let m = 0; m < 8 ; m++){
        for(let n = 0; n < 8 ; n++){
            bigPicture[j][k+n] = square[m][n]
        }
        j++
    }
    k+=8
    if(k == 512){
        k = 0
    }else{
        j -= 8
    }
}
var buffer = new Uint8Array(512*512);
for(let i = 0,k = 0 ; i < 512 ; i++)
    for(let j = 0; j < 512 ; j++,k++)
        buffer[k] = bigPicture[i][j]
fs.writeFileSync('origin.raw', buffer)