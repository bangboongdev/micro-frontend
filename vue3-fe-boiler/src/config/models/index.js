import camelCase from "lodash/camelCase";

const modulesFiles = require.context("./entities", true, /\.js$/);
const entities = modulesFiles.keys().reduce((items, modulePath) => {
  const moduleName = camelCase(modulePath.replace(/^\.\/(.*)\.\w+$/, "$1"));
  const value = modulesFiles(modulePath);
  items[moduleName] = value.default;
  return items;
}, {});
const messages = {
  ...entities,
};
export default messages;
