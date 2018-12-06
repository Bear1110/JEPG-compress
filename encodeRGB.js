fs = require('fs');
dct = require('./FastDct')
t = require('./table')
const QF = 90
let data = fs.readFileSync('img/BaboonRGB.raw')
let long = ''
let len = data.length
let array = new Array(262144)
for(let i = 0 ,g = 0; g < len / 3 ; g++){
    let R = data[i++]
    let G = data[i++]
    let B = data[i++]
    array[g] = [] //from wiki
    array[g][0] = 0 + 0.299*R + 0.587*G + 0.114*B //y
    array[g][1] = 128 - 0.168736*R - 0.331264*G + 0.5*B //cb
    array[g][2] = 128 + 0.5*R - 0.418688*G - 0.081312*B //cr
}

///////////////////////////////////////////////////////////////////////先做 y
len = 262144
let bigbicture = new Array(512)
for(let i = 0 ; i < len ; i++){ 
    let temp =  Math.floor(i/512)
    if(!bigbicture[temp])
        bigbicture[temp] = []
    bigbicture[temp][i%512] = array[i][0]
}
len = 4096
let squares = []
for(let i = 0 , j = 0, k = 0; i < len ; i++){//  8*8 4096
    let square = [[],[],[],[],[],[],[],[]]
    for(let m = 0; m < 8 ; m++){
        for(let n = 0; n < 8 ; n++){
            square[m][n] = bigbicture[j][k+n]
        }
        j++
    }
    squares.push(square)
    k+=8
    if(k == 512){
        k = 0
    }else{
        j -= 8
    }
}

len = squares.length
const Luminance = t.LuminanceQF(QF)
for(let g = 0 ; g < len ; g++){
    let gg = dct.dct2d(squares[g])    
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
            gg[i][j] = gg[i][j]/Luminance[i][j]
    let row = t.ZigzagTraversal(gg)
    row = row.map(e=>Math.round(e))
    long += t.DCCategoryCodeWord[t.DCCategory(row[0])]+t.DCvalueCodeWord(row[0])
    let zerocount = 0
    let allnumber = row.filter(e=>e!=0)
    for(let i = 1 ,k = 1; i < 64 ; i++){
        if(row[i] == 0){
            zerocount++
            if(zerocount == 16){
                long += t.ACCoefficientsInJPEG[15][0]
                zerocount = 0
            }
        }else{
            let ACcodeword = t.DCvalueCodeWord(row[i])
            long += t.ACCoefficientsInJPEG[zerocount][ACcodeword.length] + ACcodeword
            zerocount = 0
            k++
            if(allnumber.length==k){
                break
            }
        }
    }
    long += t.ACCoefficientsInJPEG[0][0] //EOB
}
///////////////////////////////////////////////////////////////////////做 cb 4:1:1
len = 262144
bigbicture = new Array(512)
for(let i = 0 ; i < len ; i++){ 
    let temp =  Math.floor(i/512)
    if(!bigbicture[temp])
        bigbicture[temp] = []
    bigbicture[temp][i%512] = array[i][1] //cb
}
len = 1024
squares = []
for(let i = 0 , j = 0, k = 0; i < len ; i++){//  8*8 ; 256*256/8/8 = 1024 
    let square = [[],[],[],[],[],[],[],[]]
    for(let m = 0; m < 8 ; m++){
        for(let n = 0; n < 8 ; n++){
            square[m][n] = bigbicture[j][k+n*2]
        }
        j+=2
    }
    squares.push(square)
    k+=16
    if(k == 512){
        k = 0
    }else{
        j -= 16
    }
}
len = squares.length
for(let g = 0 ; g < len ; g++){
    let gg = dct.dct2d(squares[g])    
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
            gg[i][j] = gg[i][j]/Luminance[i][j]
    let row = t.ZigzagTraversal(gg)
    row = row.map(e=>Math.round(e))
    long += t.DCCategoryCodeWord[t.DCCategory(row[0])]+t.DCvalueCodeWord(row[0])
    let zerocount = 0
    let allnumber = row.filter(e=>e!=0)
    for(let i = 1 ,k = 1; i < 64 ; i++){
        if(row[i] == 0){
            zerocount++
            if(zerocount == 16){
                long += t.ACCoefficientsInJPEG[15][0]
                zerocount = 0
            }
        }else{
            let ACcodeword = t.DCvalueCodeWord(row[i])
            long += t.ACCoefficientsInJPEG[zerocount][ACcodeword.length] + ACcodeword
            zerocount = 0
            k++
            if(allnumber.length==k){
                break
            }
        }
    }
    long += t.ACCoefficientsInJPEG[0][0] //EOB
}
///////////////////////////////////////////////////////////////////////做 cr 4:1:1
len = 262144
bigbicture = new Array(512)
for(let i = 0 ; i < len ; i++){ 
    let temp =  Math.floor(i/512)
    if(!bigbicture[temp])
        bigbicture[temp] = []
    bigbicture[temp][i%512] = array[i][2] //cb
}
len = 1024
squares = []
for(let i = 0 , j = 0, k = 0; i < len ; i++){//  8*8 ; 256*256/8/8 = 1024 
    let square = [[],[],[],[],[],[],[],[]]
    for(let m = 0; m < 8 ; m++){
        for(let n = 0; n < 8 ; n++){
            square[m][n] = bigbicture[j][k+n*2]
        }
        j+=2
    }
    squares.push(square)
    k+=16
    if(k == 512){
        k = 0
    }else{
        j -= 16
    }
}
len = squares.length
for(let g = 0 ; g < len ; g++){
    let gg = dct.dct2d(squares[g])    
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
            gg[i][j] = gg[i][j]/Luminance[i][j]
    let row = t.ZigzagTraversal(gg)
    row = row.map(e=>Math.round(e))
    long += t.DCCategoryCodeWord[t.DCCategory(row[0])]+t.DCvalueCodeWord(row[0])
    let zerocount = 0
    let allnumber = row.filter(e=>e!=0)
    for(let i = 1 ,k = 1; i < 64 ; i++){
        if(row[i] == 0){
            zerocount++
            if(zerocount == 16){
                long += t.ACCoefficientsInJPEG[15][0]
                zerocount = 0
            }
        }else{
            let ACcodeword = t.DCvalueCodeWord(row[i])
            long += t.ACCoefficientsInJPEG[zerocount][ACcodeword.length] + ACcodeword
            zerocount = 0
            k++
            if(allnumber.length==k){
                break
            }
        }
    }
    long += t.ACCoefficientsInJPEG[0][0] //EOB
}
console.log(long.length/8)
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