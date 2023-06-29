const path = require('path');


module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        library: 'OrthoxmlParser',
        filename: 'orthoxml-parser.js',
        path: path.resolve(__dirname, 'dist'),
    },
};