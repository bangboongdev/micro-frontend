import axios from "axios";
import VueAxios from "vue-axios";
import App from "./App";
import router from "./router/index";
import {
  Menu,
  Layout,
  Button,
  BackTop,
  Carousel,
  Col,
  Row,
  Modal,
  Input,
  Spin,
  List,
  Timeline,
  Alert
} from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import { createApp } from "vue";

const app = createApp(App);
app.use(VueAxios, axios);
app.use(Menu);
app.use(Layout);
app.use(Button);
app.use(BackTop);
app.use(Carousel);
app.use(Col);
app.use(Row);
app.use(Modal);
app.use(Input);
app.use(Spin);
app.use(List);
app.use(Timeline);
app.use(Alert);
app.use(router).mount("#app");
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi-vn");
