<template>
  <a-row :gutter="{ xs: 24, md: 24, lg: 8 }" style="margin: 0">
    <a-col :style="containerStyle"></a-col>
    <a-col :class="'wrap-login'" style="padding: 0">
      <div class="overlay" v-if="loader">
        <div class="loader"></div>
      </div>
      <a-col
        :xs="{ span: 24 }"
        :md="{ span: 12 }"
        :lg="{ span: 15 }"
        :class="'img-login'"
      ></a-col>
      <div autocomplete="off" class="form validate-form">
        <div class="banner">
          <!-- <img :src="logo_img" alt="logo" class="brand brand-responsive" /> -->
          <span>TTD Platform</span>
        </div>
        <div v-if="is_support_idb">
          <div class="login-form" v-if="!isShowForgotPassword">
            <div class="wrap-input">{{ $t('login.attribute.username') }}</div>
            <div class="wrap-input">
              <a-input
                v-model:value="username"
                :placeholder="$t('login.placeholder.username')"
                allow-clear
                size="large"
              />
            </div>
            <div class="wrap-input">{{ $t('login.attribute.password') }}</div>
            <div class="wrap-input">
              <a-input-password
                v-model:value="password"
                :placeholder="$t('login.placeholder.password')"
                size="large"
                @keyup.enter="login"
              />
            </div>
            <div class="error-message" v-if="error">
              {{$t('login.errorMessage')}}
            </div>
            <div :style="{ textAlign: 'right' }">
              <a-button
                @click="forgotPassword"
                size="large"
                :style="{
                  backgroundColor: '#00000',
                  border: 'none',
                  color: '#00885a',
                  paddingRight: 0,
                }"
                >{{$t('login.forgetPassword')}}</a-button
              >
            </div>
            <div class="container-form-btn">
              <a-button
                type="primary"
                block
                @click="login"
                size="large"
                :style="{ backgroundColor: '#00885a', borderColor: '#00885a' }"
                >{{$t('login.title')}}</a-button
              >
            </div>
          </div>
          <div class="reset-form" v-if="isShowForgotPassword">
            <div class="wrap-input">{{$t('login.attribute.email')}}</div>
            <div class="wrap-input">
              <a-input
                v-model:value="email"
                :placeholder="$t('login.placeholder.email')"
                allow-clear
                size="large"
              />
            </div>
            <div class="container-form-btn">
              <a-button
                type="primary"
                block
                @click="reset"
                size="large"
                :style="{
                  backgroundColor: '#00885ab3',
                  borderColor: '#00885a',
                }"
                :loading="loading"
                >{{$t('login.reset')}}</a-button
              >
            </div>
            <div class="container-form-btn back">
              <a-button block @click="back" size="large">{{$t('login.back')}} </a-button>
            </div>
          </div>
        </div>
        <div v-else>
          <a-row>
            <a-result
              status="error"
              :title="$t('login.waning')"
              :sub-title="$t('login.no_support')"
            />
          </a-row>
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
<script setup lang="ts">
import { FacebookOutlined, YoutubeOutlined } from "@ant-design/icons-vue";
import { useLogin } from "@/composable/useLogin";
const {
  loading,
  loader,
  error,
  isShowForgotPassword,
  containerStyle,
  logo_img,
  is_support_idb,
  login,
  reset,
  forgotPassword,
  back,
  email,
  username,
  password,
} = useLogin();
</script>
<style lang="scss">
@media (max-width: 992px) {
  .brand.brand-responsive {
    height: 74px !important ;
  }
}
.brand.brand-responsive {
  height: 110px;
  width: 100%;
}
</style>
<style scoped>
.banner {
  font-size: 48px;
  text-align: center;
  font-weight: 700;
  color: #00885a;
  padding: 16px 0;
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
  justify-content: space-between;
  padding: 0;
  height: 80vh;
  width: 80%;
  border-radius: 10px;
  box-shadow: 16px 16px 30px #00000040;
  margin: 0px;
  margin: 5% 10%;
  position: absolute;
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

.overlay {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(86, 79, 64, 0.25);
  position: absolute;
}

.loader {
  position: absolute;
  left: 35%;
  top: 35%;
  z-index: 9999;
  transform: translate(-50%, -50%);
  border: 16px solid #f3f3f3;
  border-top: 16px solid #00885a;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.img-login {
  padding-left: 4px;
  padding-right: 4px;
  background-image: url("@/assets/img/warehouse_login.jpg");
  background-size: cover;
  background-position: center center;
}
.validate-form {
  padding-left: 4px;
  padding-right: 4px;
  background: #fff;
  overflow: hidden;
  padding: 24px 0;
  padding: 32px;
  width: 36%;
  font-size: 16px;
}
body {
  font-size: 16px;
}
</style>