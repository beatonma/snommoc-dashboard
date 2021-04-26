const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        app: "./src/index.jsx",
        dashboard: {
            import: "./src/scss/dashboard.scss",
            filename: "../css/[name].css",
        },
    },
    output: {
        path: path.resolve(__dirname, "../static/dashboard/js/"),
        filename: "dashboard.js",
    },
    devServer: {
        open: true,
        host: "localhost",
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
                type: "asset",
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
};
