const { mergeWithCustomize, unique } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");
if (process.env.APP_ENV) {
  dotenv.config({ path: "./.env." + process.env.APP_ENV });
} else {
  dotenv.config({ path: "./.env" });
}

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "vue3";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "fe-root",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  const merge = mergeWithCustomize({
    customizeArray: unique(
      "plugins",
      ["HtmlWebpackPlugin"],
      (plugin) => plugin.constructor && plugin.constructor.name
    ),
  });

  return merge(
    {
      plugins: [
        new HtmlWebpackPlugin({
          inject: false,
          template: "src/index.ejs",
          templateParameters: {
            isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
            orgName,
          },
        }),
      ],
    },
    defaultConfig,
    {
      // modify the webpack config however you'd like to by adding to this object
      plugins: [
        new webpack.DefinePlugin({
          "process.env": JSON.stringify(process.env),
        }),
        new CopyPlugin({
          patterns: [
            { from: "./src/assets", to: "./fe-assets" },
            {
              from: "./node_modules/import-map-overrides/dist",
              to: "./fe-assets/lib/import-map-overrides",
            },
            {
              from: "./node_modules/@fortawesome/fontawesome-free",
              to: "./fe-assets/lib/fontawesome",
            },
            {
              from: "./node_modules/jquery/dist",
              to: "./fe-assets/lib/jquery",
            },
            {
              from: "./node_modules/bootstrap/dist",
              to: "./fe-assets/lib/bootstrap",
            },
            {
              from: "./node_modules/systemjs/dist",
              to: "./fe-assets/lib/systemjs",
            },
            { from: "./node_modules/vue/dist", to: "./fe-assets/lib/vue" },
            {
              from: "./node_modules/vue-router/dist",
              to: "./fe-assets/lib/vue-router",
            },
            {
              from: "./node_modules/single-spa/lib",
              to: "./fe-assets/lib/single-spa",
            },
            { from: "./src/importmap.json", to: "./importmap.json" },
            { from: "./src/importmap-local.json", to: "./importmap-local.json" }
          ],
        }),
      ],
      output: {
        libraryTarget: "system",
        clean: true,
      },
      devServer: {
        hot: true,
        client: false,
      },
      externals: [
        "vue",
        "axios",
        "single-spa",
        "single-spa-vue",
        /^@vue3\/.+/
      ],
    }
  );
};
