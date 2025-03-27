import camelCase from "lodash/camelCase";
import { createStore } from "vuex";

const modulesFiles = require.context("./modules", true, /\.ts$/);
const modules = modulesFiles.keys().reduce((items: any, modulePath) => {
  const moduleName = camelCase(modulePath.replace(/^\.\/(.*)\.\w+$/, "$1"));
  const value = modulesFiles(modulePath);
  items[moduleName] = value.default;
  return items;
}, {});
// console.log(modules);

export interface State {
  company: Company;
}
const store = createStore<State>({
  modules,
});
export default store;
