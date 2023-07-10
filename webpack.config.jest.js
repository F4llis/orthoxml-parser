const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        publicPath: '',
        library: 'OrthoxmlParser',
        filename: 'orthoxml-parser.js',
        path: path.resolve(__dirname, 'dist-jest'),
        libraryTarget: 'commonjs2'
    },
    resolve: {
        fallback: {
            "string_decoder": require.resolve("string_decoder/"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/")
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {

                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]

            }
        ],

    },
};