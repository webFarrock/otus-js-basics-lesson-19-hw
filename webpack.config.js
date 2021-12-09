const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPugPlugin = require("html-webpack-pug-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const { resolve } = require("path");
const glob = require("glob");

const { NODE_ENV } = process.env;
const pugTemplatesPath = "src/pug/templates";
const pugTemplates = glob.sync(`${pugTemplatesPath}/*.pug`);

module.exports = {
  entry: resolve(__dirname, "src/index.js"),
  output: {
    filename: "bundle.js",
    path: resolve(`${__dirname}/dist`),
    publicPath: "/",
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  devtool: NODE_ENV === "production" ? "hidden-source-map" : "eval-source-map",
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ["raw-loader", "pug-html-loader"],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(jpg)$/i,
        type: "asset/resource",
        generator: {
          filename: "./image/[contenthash][ext]",
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  mode: NODE_ENV === "production" ? "production" : "development",
  plugins: [
    ...pugTemplates.map(
      (el) =>
        new HtmlWebpackPlugin({
          template: el,
          filename: `${el.replace(pugTemplatesPath, "").replace(".pug", "")}.html`,
        })
    ),
    new HtmlWebpackPugPlugin(),
    new MiniCssExtractPlugin(),
    new BrowserSyncPlugin(
      {
        // browse to http://localhost:3000/ during development
        host: "localhost",
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: "http://localhost:9000/",
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false,
      }
    ),
  ],
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devServer: {
    compress: true,
    port: 9000,
    client: {
      logging: "info",
    },
    watchFiles: ["src/pug/**/*.pug"],
  },
};
