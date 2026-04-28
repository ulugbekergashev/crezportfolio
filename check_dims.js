const fs = require('fs');

function getMp4Dimensions(filename) {
    const buffer = Buffer.alloc(1024 * 1024); // read first 1MB
    const fd = fs.openSync(filename, 'r');
    fs.readSync(fd, buffer, 0, buffer.length, 0);
    fs.closeSync(fd);

    let offset = 0;
    while (offset < buffer.length - 8) {
        const size = buffer.readUInt32BE(offset);
        const type = buffer.toString('ascii', offset + 4, offset + 8);
        
        if (size === 0) break;

        if (type === 'tkhd') {
            // width is at offset 76 from start of tkhd atom
            // height is at offset 80
            if (offset + 84 <= buffer.length) {
                const width = buffer.readUInt32BE(offset + 76) / 65536;
                const height = buffer.readUInt32BE(offset + 80) / 65536;
                return { width, height };
            }
        }

        if (['moov', 'trak', 'mdia', 'minf', 'stbl'].includes(type)) {
            offset += 8; // step into container
        } else {
            offset += size; // skip atom
        }
    }
    return null;
}

const files = [
    '4-mefortg.mp4',
    '605-Branding.mp4',
    'AQNBGsao1FSHXxlFW7_cs26nRF_ig4DV5jeRUEabyqe5Ep0qpEhhYOAqllXjiAD.mp4',
    'AQO6sWjMKyvkrzRrw8z_VJVBxvMMbml4OYmeMZr3Gmuhn8uSrM86d87nedZmd_h.mp4',
    'AQO8jSCn4cGbejgB6EXSnY3SNBQaExPjyQbyaKmwd9jTsOcHXkk0wJL6yZFmmu8.mp4'
];

files.forEach(f => {
    try {
        const dims = getMp4Dimensions(f);
        console.log(`${f}: ${dims ? dims.width + 'x' + dims.height : 'Unknown'}`);
    } catch(e) {
        console.log(`${f}: Error - ${e.message}`);
    }
});
