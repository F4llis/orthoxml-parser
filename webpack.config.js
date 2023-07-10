const path = require('path');


module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        library: 'OrthoxmlParser',
        filename: 'orthoxml-parser.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        fallback: {
            "string_decoder": require.resolve("string_decoder/"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/")
        }
    },
};