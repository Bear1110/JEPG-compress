fs = require('fs');
dct = require('./FastDct')
t = require('./table')
const QF = 5
let data = fs.readFileSync('img/Lena.raw')
let long = ''
let len = data.length
let array = []
for(let i = 0 ; i < len ; i++){
    let temp =  Math.floor(i/512)
    if(!array[temp])
        array[temp] = []
    array[temp][i%512] = data[i]
}

len = data.length / 64
let squares = []
for(let i = 0 , j = 0, k = 0; i < len ; i++){//  8*8 4096
    let square = [[],[],[],[],[],[],[],[]]
    for(let m = 0; m < 8 ; m++){
        for(let n = 0; n < 8 ; n++){
            square[m][n] = array[j][k+n]
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
let dpcm = 0
const Luminance = t.LuminanceQF(QF)
for(let g = 0 ; g < len ; g++){
    
    let gg = dct.dct2d(squares[g])    
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
            gg[i][j] = gg[i][j]/Luminance[i][j]
    
    let row = t.ZigzagTraversal(gg)
    row = row.map(e=>Math.round(e))
    let FirstDc =  row[0] - dpcm
    dpcm = row[0]
    long += t.DCCategoryCodeWord[t.DCCategory(FirstDc)]+t.DCvalueCodeWord(FirstDc)
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
/**
 * 最後塞 100000 之類的東西
 * 所以decode的時候應該要先把 結尾 的100000 給刪掉
 * 如果剛好八的倍數就塞 10000000 這樣
 */
console.log(long.length/8)

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