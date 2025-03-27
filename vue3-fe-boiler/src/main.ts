import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App.vue";
import router from "./router/index";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "@/assets/global.css";
import PaperDashboard from "./plugins/paperDashboard";
import firebaseMessaging from "./firebase";
import { createApp } from "vue";
// @ts-ignore
import { createAuth } from "@websanova/vue-auth";
import { useAuth } from "@websanova/vue-auth";
// @ts-ignore
import driverAuthBearer from "@websanova/vue-auth/dist/drivers/auth/bearer.esm.js";
// @ts-ignore
import driverHttpAxios from "@websanova/vue-auth/dist/drivers/http/axios.1.x.esm.js";
// @ts-ignore
import driverRouterVueRouter from "@websanova/vue-auth/dist/drivers/router/vue-router.2.x.esm.js";
import VueApexCharts from "vue3-apexcharts";
// import "./registerServiceWorker";
import store from "@/store";
import i18n from "@/lang";
import { VueQueryPlugin } from "vue-query";


const app = createApp(App);
app.use(VueQueryPlugin);
app.use(i18n);
app.use(store);
// app.config.productionTip = false;
app.config.globalProperties.$messaging = firebaseMessaging;
var auth = createAuth({
  plugins: {
    http: axios,
    router: router,
  },
  drivers: {
    http: driverHttpAxios,
    auth: driverAuthBearer,
    router: driverRouterVueRouter,
  },
  options: {
    rolesKey: "type",
    notFoundRedirect: { name: "NotFound" },
    loginData: { url: "login" },
    logoutData: { url: "logout" },
    fetchData: { url: "info" },
  },
});
var authStore = useAuth();
app.config.globalProperties.$auth = authStore;

app.use(PaperDashboard).use(Antd).use(VueAxios, axios);

app.provide("axios", app.config.globalProperties.axios);
axios.defaults.baseURL = "/api";
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (err) {
    if (err.response.status === 401 || err.response.status === 403) {
      authStore.logout({
        redirect: "login",
      });
    } else if (err.response.status === 500) {
      authStore.redirect();
    }
    return Promise.reject(err);
  }
);

app.use(router).use(VueApexCharts).use(auth).mount("#app");
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi-vn");
