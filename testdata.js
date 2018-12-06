t = require('./table')
dct = require('./FastDct')
let ttt = [
    [139,144,149,153,155,155,155,155],
    [144,151,153,156,159,156,156,156],
    [150,155,160,163,158,156,156,156],
    [159,161,162,160,160,159,159,159],
    [159,160,161,162,162,155,155,155],
    [161,161,161,161,160,157,157,157],
    [162,162,161,163,162,157,157,157],
    [162,162,161,161,163,158,158,158]
]
let gg = dct.dct2d(ttt)

let long = ''
let row = [ 73,
    22,
    -4,
    6,
    1,
    6,
    3,
    -11,
    -1,
    3,
    1,
    1,
    -6,
    4,
    4,
    -1,
    4,
    -1,
    -1,
    3,
    0,
    0,
    -1,
    -1,
    6,
    2,
    -1,
    -0,
    -0,
    -1,
    2,
    2,
    2,
    0,
    -0,
    -0,
    0,
    0,
    -1,
    -1,
    -1,
    -0,
    -1,
    -1,
    0,
    -1,
    -1,
    -0,
    -0,
    -0,
    -0,
    0,
    0,
    0,
    -1,
    0,
    -0,
    -0,
    -0,
    0,
    0,
    -1,
    -0,
    0 ]
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

//////////////////////////////////////////////////////////////////////////////////

let  longSting = long
let bitI = 0
readTemp = ''
let zigzag = []
//dc
while(t.decodeDCCategoryCodeWord[readTemp] == undefined){        
    readTemp += longSting.charAt(bitI++)
}
let ssss = t.decodeDCCategoryCodeWord[readTemp]
readTemp = ''
if(ssss ==0){
    readTemp += longSting.charAt(bitI++)
}else{        
    for(let ggg = 0 ; ggg < ssss; ggg++){
        readTemp += longSting.charAt(bitI++)
    }
}    
zigzag.push(t.decodeDCvalueCodeWord(readTemp)) // first dc
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
for(let i = 0 ; i < 64 ; i++){
    if(zigzag[i] != row[i])
        console.log(i)
}