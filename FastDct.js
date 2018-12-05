//https://gist.github.com/richard-to/9524373#file-dct-js-L20
function dct2d(block){
    const midpoint = 128;
    var shifted_data = [];
    for (var x = 0; x < block.length; ++x) {
        shifted_data.push([]);
        for (var y = 0; y < block[x].length; ++y) {
            shifted_data[x].push(block[x][y] - midpoint);
        }
    }
    var dct = [];
    for (var u = 0; u < shifted_data.length; ++u) {
        dct.push([]);
        var au = (u == 0) ? (1/Math.sqrt(2)) : 1; 
        for (var v = 0; v < shifted_data[u].length; ++v) {
            var value = 0;
            var av = (v == 0) ? (1/Math.sqrt(2)) : 1;

            for (var x = 0; x < shifted_data.length; ++x) {
                for (var y = 0; y < shifted_data[x].length; ++y) {
                    value += shifted_data[x][y] * 
                        Math.cos( ((2 * x + 1) * u * Math.PI)/16 ) *
                        Math.cos( ((2 * y + 1) * v * Math.PI)/16 )
                }
            }
            value = 1/4 * av * au * value;
            dct[u].push(value)
        }
    }
    return dct
}
//https://gist.github.com/bellbind/eb3419516e00fdfa13f472d82fd1b495
function idct2d(mat, w = 8, h = 8) {
    let newMat = []
    for(let i = 0 ,ggg = 0; i < 8 ; i++)
        for(let j = 0 ; j < 8 ; j ++,ggg++)
            newMat[ggg] = mat[i][j]
    mat = newMat
    const cos = Math.cos, PI = Math.PI, isqrt2 = 1 / Math.sqrt(2);
    const px = PI / w, py = PI / h;
    let temp = range(w * h, xyw => {
        const x = xyw % w, y = (xyw - x) / w;
        return mat.reduce((t, fuv, uvw) => {
            const u = uvw % w, v = (uvw - u) / w;
            const c = (u === 0 ? isqrt2 : 1) * (v === 0 ? isqrt2 : 1);
            return t +
                c * fuv * cos(px * (x + 0.5) * u) * cos(py * (y + 0.5) * v);
        }, 0) / 4;
    });
    let result = [[],[],[],[],[],[],[],[]]
    for( i = 0 , gg = 0; i < 8 ; i ++)
        for(let j = 0 ; j < 8 ; j++,gg++)
            result[i][j] =  temp[gg]+128
    return result
}
// array helpers
function range(n, map = v => v) {
    return Array.from(Array(n), (_, i) => map(i));
}
exports.dct2d = dct2d
exports.idct2d = idct2d