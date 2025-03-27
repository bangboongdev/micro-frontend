import {h, createApp} from "vue";
import App from './App.vue'
import singleSpaVue from "single-spa-vue";
import '@/style.scss'
import router from "./router/router";

const vueLifecycles = singleSpaVue({
    createApp,
    appOptions: {
        render() {
            return h(App, {
                baseUrl: this.baseUrl,
            });
        },
    },
    handleInstance: (app, propsConfig) => {
        console.log('propsConfig', propsConfig.baseUrl)
        app.config.globalProperties.baseUrl = propsConfig.baseUrl;
        app.config.warnHandler = function (msg, vm, trace) {
            return null;
        };
        app.use(router)
        .mount('#app')
    },
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
