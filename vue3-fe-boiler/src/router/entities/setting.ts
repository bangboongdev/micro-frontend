
import i18n from "@/lang";
const { t } = i18n.global;

const component = () => import("@/views/Setting/Setting.vue");
const title = t('setting.name');
const route = {
  path: "setting",
  name: title,
  component,
  meta: {
    auth: true,
    title,
  },
};
export default route;
