fs = require('fs');
dct = require('./FastDct')
t = require('./table')
let data = fs.readFileSync('img/Baboon.raw')

let long = ''
/*
let data = []
for(let i = 0 ; i < 64 ; i++){
    data.push(i)
}*/
let len = data.length
let array = []
for(let i = 0 ; i < len ; i++){
    let temp =  Math.floor(i/8)
    if(!array[temp])
        array[temp] = []
    array[temp][i%8] = data[i]
}

len = array.length
let squares = []
for(let i = 0 ; i < len ; i++){//  8*8
    let temp =  Math.floor(i/8)
    if(!squares[temp])
        squares[temp] = []
    squares[temp][i%8] = array[i]
}

len = squares.length
console.log(len)
for(let g = 0 ; g < len ; g++){
    let gg = dct(squares[g])
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
        gg[i][j] = Math.round(gg[i][j]/t.Luminance[i][j])

    let row = t.ZigzagTraversal(gg)
    long += t.DCCategoryCodeWord[t.DCCategory(row[0])]+t.DCvalueCodeWord(row[0])
    let zerocount = 0
    for(let i = 1 ; i < 64 ; i++){
        if(row[i] == 0){
            zerocount++
            continue
        }else{
            let ACcodeword = t.DCvalueCodeWord(row[i])
            if(zerocount > 15){//ZRL
                long += t.ACCoefficientsInJPEG[15][0] + ACcodeword
            }else{
                long += t.ACCoefficientsInJPEG[zerocount][ACcodeword.length] + ACcodeword
            }            
            zerocount = 0
        }
    }
    if(zerocount != 0)
        long += t.ACCoefficientsInJPEG[0][0]    
}

/**
 * 最後塞 100000 之類的東西
 * 所以decode的時候應該要先把 結尾 的100000 給刪掉
 * 如果剛好八的倍數就塞 10000000 這樣
 */
long += '1'
let GG = long.length % 8
if(GG != 0)
    for(let KK = 8 - GG ; KK > 0; KK--)
        long += '0'
var buffer = new Uint8Array(long.length / 8);
let temp = '', bufferIndex = 0
for(let i = 0; i < long.length ; i++){
    let thisBit = long.charAt(i)
    temp += thisBit
    if(temp.length == 8){
        buffer[bufferIndex++] = parseInt(temp, 2)
        temp = ''
    }
}
fs.writeFileSync('afterCompress.bear', buffer)