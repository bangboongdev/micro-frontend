import i18n from "@/lang";
import * as _ from "lodash";

const { t } = i18n.global;
interface Meta{
    auth?:boolean,
    title:string
}
interface Children{
    path:string,
    name:String,
    component:any,
    meta:Meta
}
class RouteEntity {
    model = "";
    children:Children[] = [];

    constructor(model:string) {
        if (model !== undefined) {
            this.model = model;
        }
    }

    setChildren(children:Children[]) {
        this.children = children;
    }

    build() {
         const instance = _.replace(_.startCase(_.camelCase(this.model)),new RegExp(" ","g"),"");
        // const instance = _.replace(_.startCase(_.camelCase(this.model)), " ", "");
        const index = () => import("@/views/" + instance + "/Index.vue");
        const list = () => import("@/views/" + instance + "/List.vue");
        const detail = () => import("@/views/" + instance + "/Detail.vue");
        const title = t(_.camelCase(this.model) + ".name");
        return {
            path: `/${this.model}`,
            name: title,
            meta: {
                auth: true,
                title,
            },
            component: index,
            children: [
                {
                    path: "",
                    name: title,
                    component: list,
                    meta: {
                        title
                    },
                },
                {
                    path: ":id",
                    name: "Chi tiết " + title,
                    component: detail,
                    meta: {
                        title
                    },
                },
                ...this.children]
        };
    }
}
export default RouteEntity;
