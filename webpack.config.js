const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const production = process.env.NODE_ENV === 'production' || false;

module.exports = {
    entry: ['./src/eardrum.ts'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'eardrum.js',
        libraryExport: 'default',
        umdNamedDefine: true,
        library: {
            name: 'eardrum',
            type: 'umd',
            export: 'default'
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    mode: production ? 'production' : 'development',
    optimization: {
        minimize: production,
        minimizer: [
            new TerserPlugin({})
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'examples', 'browser')
        },
        compress: true,
        port: 9000
    }
};