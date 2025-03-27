import AuthenticateService from "@/services/AuthenticateService";
import {
  computed,
  ComputedRef,
  getCurrentInstance,
  onMounted,
  ref,
  watch,
} from "vue";
import { notification } from "ant-design-vue";
import i18n from "@/lang";
const { t } = i18n.global;
export function useLogin() {
  const loader = ref(false);
  const username = ref(null);
  const password = ref(null);
  const error = ref(false);
  const isShowForgotPassword = ref(false);
  const email = ref(null);
  const loading = ref(false);
  const is_support_idb = ref(true);
  const logo_img = ref(require("@/assets/img/warehouse_banner.png").default);
  const containerStyle = ref({
    backgroundColor: "#00885a",
    minWidth: "100%",
    minHeight: "100vh",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  });
  const { proxy }: any = getCurrentInstance();

  const login = (): void => {
    loader.value = true;
    proxy.$auth
      .login({
        params: {
          username: username.value,
          password: password.value,
        },
        rememberMe: true,
        fetchUser: true,
      })
      .then(
        async (res: any) => {
          await proxy.$router.push("dashboard");
        },
        (res: any) => {
          loader.value = false;
          error.value = true;
          console.log(res);
        }
      );
  };
  const forgotPassword = () => {
    isShowForgotPassword.value = true;
  };
  const reset = () => {
    loading.value = true;
    if (email.value != null)
      AuthenticateService.resetPassword(email.value).then(
        (result) => {
          loading.value = false;
          notification.success({
            message: t("login.warning"),
            description: t("login.change_pw_success"),
          });
        },
        (error) => {
          console.error(error);
          loading.value = false;
          notification.error({
            message: t("login.warning"),
            description: t("login.error_change"),
          });
        }
      );
  };
  const back = () => {
    isShowForgotPassword.value = false;
    // proxy.$router.push("/login");
  };
  onMounted(() => {
    console.log(window.indexedDB);

    // if (!window.indexedDB) {
    //   is_support_idb.value = false;
    // }
  });
  return {
    loading,
    loader,
    error,
    email,
    username,
    password,
    isShowForgotPassword,
    containerStyle,
    logo_img,
    is_support_idb,
    login,
    reset,
    forgotPassword,
    back,
  };
}
