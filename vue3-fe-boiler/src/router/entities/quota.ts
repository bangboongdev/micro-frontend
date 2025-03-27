import i18n from "@/lang";
const { t } = i18n.global;

const component = () => import("@/views/Quota/Quota.vue");
const title = t("quota.name");
const route = {
  path: "quota",
  name: title,
  component,
  meta: {
    auth: true,
    title,
  },
};
export default route;
