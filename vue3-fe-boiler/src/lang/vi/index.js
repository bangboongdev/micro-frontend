import validator from "@/lang/vi/validator";
import permission from "@/lang/vi/permission";
import common from "@/lang/vi/common";
import login from "@/lang/vi/login";

import camelCase from "lodash/camelCase";

let modulesFiles = require.context("./entities", true, /\.js$/);
const entities = modulesFiles.keys().reduce((items, modulePath) => {
  const moduleName = camelCase(modulePath.replace(/^\.\/(.*)\.\w+$/, "$1"));
  const value = modulesFiles(modulePath);
  items[moduleName] = value.default;
  return items;
}, {});

modulesFiles = require.context("./reports", true, /\.js$/);
const reports = modulesFiles.keys().reduce((items, modulePath) => {
  const moduleName = camelCase(modulePath.replace(/^\.\/(.*)\.\w+$/, "$1"));
  const value = modulesFiles(modulePath);
  items[moduleName] = value.default;
  return items;
}, {});

const messages = {
  common,
  login,
  validator,
  permission,
  ...entities,
  ...reports,
};
export default messages;
