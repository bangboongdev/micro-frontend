// import Clipboard from "@/directive/clipboard";
import Permission from "@/directive/permission";
import Role from "@/directive/role";
import Highlight from "@/directive/highlight";

const GlobalDirectives = {
    install(Vue:any) {
        Vue.directive("highlight", Highlight);
        Vue.directive("permission", Permission);
        Vue.directive("role", Role);

    }
};

export default GlobalDirectives;
