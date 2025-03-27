import Layout from "@/layout/dashboard/Layout.vue";
const NotFound = () => import("@/views/System/NotFoundPage.vue");
const AccessDenied = () => import("@/views/System/AccessDenied.vue");
const Login = () => import("@/views/Login.vue");
const Home = () => import("@/views/Home.vue");
const DistrictDistanceQuata = () => import("@/views/DistrictDistanceQuota/DistrictDistanceQuota.vue")
import Dashboard from "@/views/Dashboard/Dashboard.vue";
const PrintLayout = () => import("@/views/PrintLayout/List.vue");
const PrintBarCode = () => import("@/views/BarCode/PrintBarCode.vue");

const ResetPassword = () => import("@/views/System/ResetPassword.vue");

const appName = " | WMS";
const modulesFiles = require.context("./entities", true, /\.ts$/);
const entities = modulesFiles.keys().reduce((items:any, modulePath) => {
  const value = modulesFiles(modulePath);
  items.push(value.default);
  return items;
}, []);
const routes = [
  {
    path: "/login",
    name: "Đăng nhập",
    component: Login,
    meta: {
      auth: false,
      title: "Đăng nhập" + appName,
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
    meta: {
      requiresAuth: false,
    },
  },
  { path: "/access-denied", component: AccessDenied },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: ResetPassword,
    meta: {
      auth: false,
    },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    meta: {
      auth: true,
    },
    children: [
      {
        path: "home",
        name: "Trang chủ",
        component: Home,
        meta: {
          auth: true,
        },
      },
      {
        path: "dashboard",
        name: "Tổng quan",
        component: Dashboard,
        meta: {
          auth: true,
          title: "Tổng quan " + appName,
        },
      },
      {
        path: "print-barcode",
        name: "In mã vạch",
        component: PrintBarCode,
        meta: {
          auth: true,
          title: "In mã vạch " + appName,
        },
      },
      {
        path: "district-distance-quota",
        name: "Khoảng cách nội tỉnh",
        component: DistrictDistanceQuata,
        meta: {
          auth: true,
          title: "Khoảng cách nội tỉnh" + appName,
        },
      },


      ...entities,
    ],
  },
];

export default routes;
