import GlobalComponents from "./globalComponents";
import "es6-promise/auto";
import GlobalDirectives from "./globalDirectives";

//css assets
import "@/assets/sass/paper-dashboard.scss";

export default {
    install(Vue:any) {
        Vue.use(GlobalComponents);
        Vue.use(GlobalDirectives);
    }
}
