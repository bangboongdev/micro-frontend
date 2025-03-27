<template>
  <a-row :style="containerStyle">
    <a-col :span="16"></a-col>
    <a-col :span="8" :class="'wrap-login'">
      <div class="overlay" v-if="loader">
        <div class="loader"></div>
      </div>
      <div autocomplete="off" class="form validate-form">
        <div>
          <img :src="logo_img" alt="logo" class="brand" />
        </div>
        <div class="label">
          <span>CHỦ HÀNG</span>
        </div>
        <div class="loginf-form">
          <div class="wrap-input">Tài khoản</div>
          <div class="wrap-input">
            <a-input
              v-model:value="email"
              placeholder="Vui lòng nhập tài khoản đăng nhập"
              allow-clear
              size="large"
            />
          </div>
          <div class="wrap-input">Mật khẩu</div>
          <div class="wrap-input">
            <a-input-password
              v-model:value="password"
              placeholder="Vui lòng nhập mật khẩu"
              size="large"
            />
          </div>
          <div class="wrap-input">Nhập lại mật khẩu</div>
          <div class="wrap-input">
            <a-input-password
              v-model:value="password_confirmation"
              placeholder="Vui lòng nhập mật khẩu"
              size="large"
            />
          </div>
          <div class="container-form-btn">
            <a-button
              type="primary"
              block
              @click="resetPassword"
              size="large"
              :style="{ backgroundColor: '#00885a', borderColor: '#00885a' }"
              >RESET</a-button
            >
          </div>
        </div>
        <a-divider />
        <div class="footer">
          <FacebookOutlined
            @click="window.location.href = 'https://facebook.com/ttd'"
          />
          <span style="margin: 0 8px; line-height: 16px">|</span>

          <YoutubeOutlined
            @click="window.location.href = 'https://youtube.com/ttd'"
          />
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
import AuthenticateService from "@/services/AuthenticateService";
import { notification } from "ant-design-vue";
import { FacebookOutlined, YoutubeOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    FacebookOutlined,
    YoutubeOutlined,
  },
  data() {
    return {
      token: null,
      email: null,
      password: null,
      password_confirmation: null,
      has_error: false,
      logo_img: require("@/assets/img/WMS_FINAL_LOGO-07.png").default,
      containerStyle: {
        backgroundImage:
          "url(" + require("@/assets/img/background.jpg").default + ")",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        backgroundSize: "cover",
      },
    };
  },
  methods: {
    resetPassword() {
      AuthenticateService.reset({
        token: this.$route.params.token,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      }).then(
        (result) => {
          this.loading = true;
          notification.success({
            message: "Nền tảng kết nối bảo hiểm TTD thông báo",
            description:
              "Reset mật khẩu thành công. Vui lòng quay lại trang chủ để đăng nhập",
          });
          this.$router.push({ path: "login" });
        },
        (error) => {
          console.error(error);
          this.loading = false;
          notification.error({
            message: "Nền tảng vận tải WMS thông báo",
            description:
              "Có lỗi xảy ra khi reset mậu khẩu. Vui lòng thử lại sau.",
          });
        }
      );
    },
  },
};
</script>
<style scoped>
.brand {
  height: 100px;
}
.label {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: #00885a;
}
.footer {
  text-align: center;
  font-size: 24px;
  color: #00885a;
}

.container-login {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.wrap-login {
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 24px 0;
  height: 100vh;
}

.container-form-btn {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
}
.container-form-btn.back {
  margin-top: 12px;
}

.login-btn:hover {
  background: #333333;
}
.wrap-input {
  margin-top: 16px;
}
.error-message {
  color: red;
  font-weight: bold;
  font-size: 0.8em;
  margin: 10px;
}
</style>