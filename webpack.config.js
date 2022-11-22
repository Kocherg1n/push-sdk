const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const plugins = {
    HtmlWebpackPlugin: new HtmlWebpackPlugin({
        inject: 'body',
        template: 'src/index.html'
    }),
    MiniCssExtractPlugin: new MiniCssExtractPlugin(),
    CopyPlugin: new CopyPlugin({
        patterns: [
            {from: "src/sw.js", to: path.resolve(__dirname, 'dist'),}
            // {from: "src/firebase-messaging-sw.js", to: path.resolve(__dirname, 'dist'),}
        ],
    })
}

module.exports = {
    entry: {
        'app': './src/index.ts',
        // 'firebase-messaging-sw': './src/sw.ts'
    },
    module: {
        rules: [
             // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
             { test: /\.tsx?$/, loader: "ts-loader" },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
      },
    plugins: [
        plugins.HtmlWebpackPlugin,
        plugins.MiniCssExtractPlugin,
        plugins.CopyPlugin
],
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
}
