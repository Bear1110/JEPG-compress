fs = require('fs');
dct = require('./FastDct')
t = require('./table')
//let data = fs.readFileSync('img/Lena.raw')
let data = []
for(let i = 0 ; i < 64 ; i++){
    data.push(i)
}
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
console.log(gg)
