const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const production = process.env.NODE_ENV === 'production' || false;

module.exports = {
    entry: ['./index.ts'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: production ? 'eardrum.min.js' : 'eardrum.js',
        library: 'Eardrum',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true
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
    mode: 'production',
    optimization: {
        minimize: production,
        minimizer: [
            new TerserPlugin({})
        ]
    }
};