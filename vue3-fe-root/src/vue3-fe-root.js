import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import layout from "./layout.html";

const data = {
  props: {
    baseUrl: process.env.VUE_APP_BASE_API,
  }
}

const loadFns = {
  '@micro/vue3-fe-layout': () =>
    import(/* webpackIgnore: true */ 'http://localhost:8001/micro-fe/layout/src/main.ts'),
  '@micro/angular-micro-fe': () =>
    import(/* webpackIgnore: true */ 'http://localhost:8002/main.js'),
  '@micro/react-micro-fe': () =>
    import(/* webpackIgnore: true */ 'http://localhost:8003/micro-react-micro-fe.js')
};
const routes = constructRoutes(layout, data);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name).catch(() => {
      const loadFn = loadFns[name];
      return loadFn();
    });
  },
});
const layoutEngine = constructLayoutEngine({
  routes,
  applications,
});

applications?.forEach(item => {
  registerApplication(item);
});
layoutEngine.activate();
start();
