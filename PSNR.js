//https://cg2010studio.com/2013/01/06/%E5%B3%B0%E5%80%BC%E4%BF%A1%E8%99%9F%E9%9B%9C%E8%A8%8A%E6%AF%94-peak-signal-to-noise-ratio/
fs = require('fs')

let orign = fs.readFileSync('./img/BaboonRGB.raw')
let after = fs.readFileSync('origin.raw')
let len = orign.length
let MSE = 0
for(let i =  0; i < len ; i++){
    MSE += (orign[i] - after[i]) * (orign[i] - after[i])
}
MSE /= len
//PSNR
let PSNR = 10 * Math.log10(255*255/MSE)
console.log(PSNR)