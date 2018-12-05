function LuminanceQF(QF){
    let Luminance = [
        [16,11,10,16,24,40,51,61],
        [12,12,14,19,26,58,60,55],
        [14,13,16,24,40,57,69,56],
        [14,17,22,29,51,87,80,62],
        [18,22,37,56,68,109,103,77],
        [24,36,55,64,81,104,113,92],
        [49,64,78,87,103,121,120,101],
        [72,92,95,98,112,100,103,99]
    ]
    if(QF < 50){
        QF = 5000/QF
    }else{
        QF = 200-2*QF
    }
    for(let i = 0 ; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j++)
            Luminance[i][j] = Luminance[i][j] * QF / 100
    return Luminance
}

function DCCategory(number){
    if(number == 0){
        return 0
    }else if(number == -1 || number == 1){
        return 1
    }else if(number >= -3 && number <=3){
        return 2
    }else if(number >= -7 && number <=7){
        return 3
    }else if(number >= -15 && number <=15){
        return 4
    }else if(number >= -31 && number <=31){
        return 5
    }else if(number >= -63 && number <=63){
        return 6
    }else if(number >= -127 && number <=127){
        return 7
    }else if(number >= -255 && number <=255){
        return 8
    }else if(number >= -511 && number <=511){
        return 9
    }else if(number >= -1023 && number <=1023){
        return 10
    }else if(number >= -2047 && number <=2047){
        return 11
    }
}

const DCCategoryCodeWord = ['00','010','011','100','101','110','1110','11110','111110','1111110','11111110','111111110']
let decodeDCCategoryCodeWord = []
DCCategoryCodeWord.forEach((e,i)=>{
    decodeDCCategoryCodeWord[e] = i
})

function DCvalueCodeWord(number){
    if(number >= 0){
        return number.toString(2)
    }else{
        number = -number
        let ones = number.toString(2).length
        let result = (number ^ parseInt(''.padStart(ones,'1'), 2)).toString(2)
        while(result.length != ones)
            result = '0' + result
        return result
    }
}
function decodeDCvalueCodeWord(string){
    if(string == '0')
        return 0
    let bitCount = string.length
    digit = parseInt(string, 2)
    if(digit < Math.pow(2,bitCount-1)){
        digit = (-(Math.pow(2,bitCount)))+ 1 + digit
    }
    return digit
}

const ACCoefficientsInJPEG = [
    ['1010','00','01','100','1011' ,'11010' ,'1111000', '11111000' ,'1111110110' ,'1111111110000010', '1111111110000011'], // run 0
    ['','1100' ,'11011', '1111001' ,'111110110', '11111110110' ,'1111111110000100', '1111111110000101' ,'1111111110000110' ,'1111111110000111' ,'1111111110001000'], // run 1
    ['','11100' ,'11111001' ,'1111110111', '111111110100', '1111111110001001', '1111111110001010', '1111111110001011', '1111111110001100', '1111111110001101', '1111111110001110'],
    ['','111010' ,'111110111', '111111110101', '1111111110001111' ,'1111111110010000', '1111111110010001', '1111111110010010', '1111111110010011' ,'1111111110010100' ,'1111111110010101'],
    ['','111011','1111111000','1111111110010110' ,'1111111110010111' ,'1111111110011000' ,'1111111110011001', '1111111110011010' ,'1111111110011011', '1111111110011100', '1111111110011101'],
    ['','1111010', '11111110111', '1111111110011110', '1111111110011111' ,'1111111110100000', '1111111110100001', '1111111110100010' ,'1111111110100011', '1111111110100100', '1111111110100101'],
    ['','1111011','111111110110', '1111111110100110', '1111111110100111', '1111111110101000' ,'1111111110101001' ,'1111111110101010' ,'1111111110101011', '1111111110101100', '1111111110101101'],
    ['', '11111010', '111111110111' ,'1111111110101110' ,'1111111110101111', '1111111110110000' ,'1111111110110001' ,'1111111110110010' ,'1111111110110011' ,'1111111110110100' ,'1111111110110101'],
    ['','111111000', '111111111000000', '1111111110110110', '1111111110110111', '1111111110111000' ,'1111111110111001' ,'1111111110111010', '1111111110111011' ,'1111111110111100', '1111111110111101'],
    ['','111111001' ,'1111111110111110' ,'1111111110111111' ,'1111111111000000' ,'1111111111000001', '1111111111000010' ,'1111111111000011', '1111111111000100', '1111111111000101' ,'1111111111000110'],
    ['','111111010' ,'1111111111000111', '1111111111001000' ,'1111111111001001' ,'1111111111001010' ,'1111111111001011', '1111111111001100' ,'1111111111001101', '1111111111001110' ,'1111111111001111'],
    ['','1111111001', '1111111111010000' ,'1111111111010001' ,'1111111111010010' ,'1111111111010011' ,'1111111111010100', '1111111111010101', '1111111111010110' ,'1111111111010111' ,'1111111111011000'],
    ['','1111111010','1111111111011001','1111111111011010','1111111111011011','1111111111011100','1111111111011101','1111111111011110','1111111111011111','1111111111100000','1111111111100001'],
    ['','11111111000','1111111111100010','1111111111100011','1111111111100100','1111111111100101','1111111111100110','11111111111001111','1111111111101000','1111111111101001','1111111111101010'],
    ['','1111111111101011','1111111111101100','1111111111101101','1111111111101110','1111111111101111','1111111111110000','1111111111110001','1111111111110010','1111111111110011','1111111111110100'],
    ['11111111001','1111111111110101','1111111111110110','1111111111110111','1111111111111000','1111111111111001','1111111111111010','1111111111111011','1111111111111100','1111111111111101','1111111111111110']
]

let decodeACCoefficientsInJPEG = []
ACCoefficientsInJPEG.forEach((e,i)=>{
    e.forEach((ee,ii)=>{
        decodeACCoefficientsInJPEG[''+ee] = [i,ii] // [run,size]
    })
})
decodeACCoefficientsInJPEG[''] = undefined

//https://coding-interview-solutions.hackingnote.com/problems/matrix-zigzag-traversal.html
function ZigzagTraversal(matrix) {
    let m = matrix.length//8
    let n = matrix[0].length//8
    let result = new Array(n*m)
    let t = 0
    for (let i = 0; i < n + m - 1; i++) {
        if (i % 2 == 1) {
            // down left
            let x = i < n ? 0 : i - n + 1;
            let y = i < n ? i : n - 1;
            while (x < m && y >= 0) {
                result[t++] = matrix[x++][y--];
            }
        } else {
            // up right
            let x = i < m ? i : m - 1;
            let y = i < m ? 0 : i - m + 1;
            while (x >= 0 && y < n) {
                result[t++] = matrix[x--][y++];
            }
        }
    }
    return result;
}
//https://gist.github.com/bellbind/eb3419516e00fdfa13f472d82fd1b495
function zigzag2square(zigzag, w = 8) {
    console.assert(zigzag.length === w * w);
    const square = Array(zigzag.length);
    const max = 2 * (w - 1);
    let i = 0;
    for (let sum = 0; sum <= max; sum++) {
        const start = sum < w ? 0 : sum - w + 1, end = sum < w ? sum : w - 1;
        if (sum % 2 === 0) {
            for (let x = start; x <= end; x++) {
                const y = sum - x;
                square[y * w + x] = zigzag[i++];
            }
        } else {
            for (let x = end; x >= start; x--) {
                const y = sum - x;
                square[y * w + x] = zigzag[i++];
            }
        }
    }//
    let result = [[],[],[],[],[],[],[],[]]
    for( i = 0 , gg = 0; i < 8 ; i ++)
        for(let j = 0 ; j < 8 ; j++,gg++)
            result[i][j] =  square[gg]
    return result;
}

exports.LuminanceQF = LuminanceQF
exports.ZigzagTraversal = ZigzagTraversal
exports.DCCategory = DCCategory
exports.DCCategoryCodeWord = DCCategoryCodeWord
exports.decodeDCCategoryCodeWord = decodeDCCategoryCodeWord
exports.DCvalueCodeWord = DCvalueCodeWord
exports.decodeDCvalueCodeWord = decodeDCvalueCodeWord
exports.ACCoefficientsInJPEG = ACCoefficientsInJPEG
exports.decodeACCoefficientsInJPEG = decodeACCoefficientsInJPEG
exports.zigzag2square = zigzag2square