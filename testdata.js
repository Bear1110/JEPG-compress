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
let gg = dct(ttt)
for(let i = 0 ; i < 8 ; i++)
    for(let j = 0 ; j < 8 ; j++)
    gg[i][j] = Math.round(gg[i][j]/t.Luminance[i][j])
//console.log(gg)
//console.log(t.ZigzagTraversal(gg))
//console.log(t.DCCategory(1))
//console.log(t.DCvalueCodeWord(-31))
//console.log()
//console.log(t.ACCoefficientsInJPEG[1][9])

let row = t.ZigzagTraversal(gg)
long += t.DCCategoryCodeWord[t.DCCategory(row[0])]+t.DCvalueCodeWord(row[0]) + ' '
let zerocount = 0
for(let i = 1 ; i < 64 ; i++){
    if(row[i] == 0){
        zerocount++
        continue
    }else{
        let ACcodeword = t.DCvalueCodeWord(row[i])
        console.log(row[i],zerocount ,ACcodeword,ACcodeword.length)
        long += t.ACCoefficientsInJPEG[zerocount][ACcodeword.length] + ACcodeword + ' '
        zerocount = 0
    }
}
if(zerocount != 0){
    long += t.ACCoefficientsInJPEG[0][0]
}

console.log(long)
console.log(t.ACCoefficientsInJPEG[1][2])