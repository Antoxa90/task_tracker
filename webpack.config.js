let webpack = require('webpack');

module.exports = {
    entry: "./client/main.jsx",
    output: {
        path: __dirname + '/public/build/',
        publicPath: 'build/',
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: true
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                exclude: [/node_modules/]
            },
            {
                test: /\.(js|jsx)$/,
                loaders: 'babel-loader',
                options: {
                    presets:["react", "es2015"]
                },
                exclude: [/node_modules/]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            }
        ]
    }
};