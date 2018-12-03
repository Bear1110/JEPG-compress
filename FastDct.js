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
            dct[u].push(Math.round(value));
        }
    }
    return dct
}
module.exports = dct2d