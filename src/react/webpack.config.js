const webpack = require('webpack');
const ModuleReplaceWebpackPlugin = require('module-replace-webpack-plugin');
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(jpg|JPG|jpeg|png|gif|mp3|svg|ttf|woff2|woff|eot)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // limit: 8000, // Convert images < 8kb to base64 strings
                            name: 'images/[hash]-[name].[ext]'
                        }
                    }
                ]
            },
            // fixes https://github.com/graphql/graphql-js/issues/1272
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            }
        ]
    },
    output: {
        publicPath: '/',
        globalObject: 'this',
        path: path.resolve(__dirname, '../static/'),
        library: 'RemoteModule',
        libraryTarget: 'this'
    },
    // Server Configuration options
    devServer: {
        host: '0.0.0.0',
        port: 3003,
        disableHostCheck: true,
        historyApiFallback: true,
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-id, Content-Length, X-Requested-With',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new ModuleReplaceWebpackPlugin({
            modules: [
                {
                    test: /^react-relay$/,
                    replace: './src/Lib/react-relay/index.js'
                },
                {
                    test: /^React$/,
                    replace: './src/Lib/ReactShim.js'
                },
                {
                    test: /^react$/,
                    replace: './src/Lib/ReactShim.js'
                }
            ],
            exclude: [
                /ReactShim.js$/,
                /node_modules\/react\/index.js$/
            ]
        }),
        new UnusedWebpackPlugin({
            directories: [path.join(__dirname, 'src')],
            exclude: ['*.test.js', 'setupTests.js', '**/__generated__/**', '**/__test__/**', '**/Lib/**'],
            root: __dirname
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.mjs']
    },
};
