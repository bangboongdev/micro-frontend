import store from "@/store";
import camelCase from "lodash/camelCase";

const features = [
  "view",
  "add",
  "edit",
  "delete",
  "import",
  "export",
  "approve",
];
export default {
  mounted(el: any, binding: any, vnode: any) {
    let { arg, value } = binding;
    if (arg && value) {
      if (!features.includes(arg)) {
        throw new Error(`Feature are not support!"`);
      }
      value = value.replaceAll("-", "_");
      const user = binding.instance.$auth?.user();
      if (user) {
        const hasPermission = user.permissions.includes(arg + " " + value);
        if (hasPermission) {
          return true;
        }
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(
        `Permissions are required! Example: v-permission="['editor','manage permission']"`
      );
    }
  },
};
