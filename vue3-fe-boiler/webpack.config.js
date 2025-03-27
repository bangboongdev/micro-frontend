const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // mode: process.env.NODE_ENV,
  mode: 'development',
  entry: ["./src/main.ts"],

  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/main.js",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"],
    
  },

  module: {
    rules: [
      // {
      //   test: /\.less$/,
      //   use: [
      //     // {
      //     //   loader: "style-loader",
      //     // },

      //     // {
      //     //   loader: "css-loader", // translates CSS into CommonJS
      //     // },
      //     // {
      //     //   test: /\.js$/,
      //     //   loader: "babel-loader",
      //     //   exclude: /node_modules/,
      //     // },
      //     // {
      //     //   test: /\.ts$/,
      //     //   loader: "ts-loader",
      //     //   exclude: /node_modules/,
      //     // },
      //     // {
      //     //   test: /\.vue$/,
      //     //   loader: "vue-loader",
      //     //   options: {
      //     //     loaders: {
      //     //       scss: "vue-style-loader!css-loader!sass-loader",
      //     //       sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax",
      //     //     },
      //     //   },
      //     // },
      //     // {
      //     //   loader: "less-loader", // compiles Less to CSS
      //     //   options: {
      //     //     lessOptions: {
      //     //       modifyVars: {
      //     //         "primary-color": "#00885a",
      //     //         "link-color": "#00885a",
      //     //         "border-radius-base": "8px",
      //     //       },
      //     //       javascriptEnabled: true,
      //     //     },
      //     //   },
      //     // },
      //   ],
      // },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { appendTsSuffixTo: [/\.vue$/] },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader',
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
          },
        },
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     { loader: MiniCssExtractPlugin.loader },
      //     'css-loader',
      //     'sass-loader',
      //   ],
      // },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]?[hash]',
          esModule: false,
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]?[hash]',
          esModule: false,
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          appendTsxSuffixTo: [/\.vue$/],
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
