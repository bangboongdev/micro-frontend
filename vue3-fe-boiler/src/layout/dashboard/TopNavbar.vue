<template>
  <div class="menu_container">
    <a-menu
      mode="horizontal"
      @click="handleClick"
      :style="{
        lineHeight: '52px',
        color: '#00885a',
        borderBottom: '1px solid #f1f1f1',
      }"
    >
      <a-menu-item key="question" @click="showQuestion">
        <QuestionCircleOutlined /><span>{{ $t("topnavbar.help") }}</span>
      </a-menu-item>
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click.prevent>
          <a-menu-item key="user">
            <a-avatar>{{ getAvatar }}</a-avatar
            ><span>{{ username }}</span>
          </a-menu-item>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="showUserInfo" key="0"
              ><UserOutlined /><span>
                {{ $t("topnavbar.subMenu.my_acount") }}</span
              >
            </a-menu-item>
            <a-menu-item key="1">
              <FileSearchOutlined /><span>{{
                $t("topnavbar.subMenu.service_info")
              }}</span></a-menu-item
            >
            <a-menu-item @click="showChangePasswordForm" key="2">
              <KeyOutlined /><span>{{
                $t("topnavbar.subMenu.change_password")
              }}</span></a-menu-item
            >
            <a-menu-item @click="logout" key="3"
              ><ExportOutlined /><span>{{
                $t("topnavbar.subMenu.sign_out")
              }}</span></a-menu-item
            >
          </a-menu>
        </template>
      </a-dropdown>
      <a-menu-item key="notification" @click="showNotification">
        <a-badge :count="totalUnreadNotification">
          <BellOutlined />
        </a-badge>
      </a-menu-item>
    </a-menu>
    <a-drawer
      width="320"
      placement="right"
      :closable="false"
      :visible="notificationVisible"
      @close="onCloseNotification"
      :bodyStyle="style"
    >
      <div class="noti-heading">
        <h3 style="margin: 0">
          {{ $t("topnavbar.notification") }} (<span style="color: red">{{
            totalUnreadNotification
          }}</span
          >)
        </h3>
        <a @click="onReadAllNotification" style="font-size: 12px">{{
          $t("topnavbar.read_all")
        }}</a>
      </div>

      <a-divider style="margin: 0" />
      <a-list item-layout="vertical" :data-source="notificationList">
        <a-empty v-if="totalNotification == 0">
          <template #description>
            <span>{{ $t("topnavbar.not_notification") }}</span>
          </template>
        </a-empty>
        <template #renderItem="{ item, index }">
          <a-list-item
            key="item.title"
            @click="showNotificationDetail(item)"
            :style="{ position: 'relative', padding: '10px 10px 10px 0px' }"
          >
            <a-list-item-meta :style="style">
              <template #title>
                <a @click="showOrderDetail(item, index)">
                  <strong style="font-size: 12px">
                    {{ item.title }}
                  </strong>
                </a>
                <div
                  v-if="item.read_status == 0"
                  style="font-size: 10px; color: #1890ff"
                >
                  <strong>{{
                    item.ins_date.split(" ")[1] +
                    " " +
                    moment(String(item.ins_date)).format("DD-MM-YYYY")
                  }}</strong>
                </div>
                <div v-else style="font-size: 10px">
                  <strong>{{
                    item.ins_date.split(" ")[1] +
                    " " +
                    moment(String(item.ins_date)).format("DD-MM-YYYY")
                  }}</strong>
                </div>
              </template>
              <template #description
                ><div>
                  <span style="font-size: 12px">{{ item.content }}</span>
                </div>
              </template>
              <template #avatar>
                <a-avatar
                  :src="imageNotify"
                  style="
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background-color: #11509b;
                  "
                  alt=""
                />
              </template>
            </a-list-item-meta>
            {{ item.content }}

            <a-badge
              v-if="item.read_status == 0"
              status="processing"
              style="
                margin-left: 4px;
                position: absolute;
                right: -14px;
                top: 50%;
              "
            />
            <a-badge
              v-else
              status="default"
              style="
                margin-left: 4px;
                position: absolute;
                right: -14px;
                top: 50%;
              "
            />
          </a-list-item>
        </template>
      </a-list>
      <div
        v-if="showButton"
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '6px 12px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }"
      >
        <a-button style="width: 100%" @click="showMore" :loading="loading">
          Xem thêm
        </a-button>
      </div>
    </a-drawer>

    <!-- <a-drawer
      width="320"
      placement="right"
      :closable="false"
      v-model:visible="visible"
      @close="onClose"
    >
      <a-row>
        <a-col :span="8"></a-col>
        <a-col :span="12">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :customRequest="customRequest"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            @change="handleChange"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              alt="avatar"
              style="width: 100px; height: 100px; object-fit: cover"
            />
            <div v-else>
              <loading-outlined v-if="loadingImg"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Thêm ảnh đại diện</div>
            </div>
          </a-upload>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div class="description">
            <div class="edit-user">
              <h2 class="title">Thông tin người dùng</h2>
              <EditOutlined @click="handleEdit" v-if="disabled" />
              <CheckOutlined
                style="color: rgb(102, 187, 106)"
                @click="updateUser"
                v-else
              />
            </div>
            <div class="info">
              <div class="edit">
                <span>Tài khoản </span>
                <a-input
                  v-model:value="username"
                  :disabled="true"
                  :loading="loadingUser"
                  @keyup.enter="updateUser"
                ></a-input>
              </div>
            </div>
            <div class="info">
              <div class="edit">
                <span>Họ và tên </span>
                <a-input
                  v-model:value="full_name"
                  :disabled="disabled"
                  :loading="loadingUser"
                  @keyup.enter="updateUser"
                ></a-input>
              </div>
            </div>
            <div class="info">
              <div class="edit">
                <span>Email </span>
                <a-input
                  v-model:value="email"
                  :disabled="disabled"
                  :loading="loadingUser"
                  @keyup.enter="updateUser"
                ></a-input>
              </div>
            </div>
            <div class="info">
              <div class="edit">
                <span>SDT </span>
                <a-input
                  v-model:value="mobile_no"
                  :disabled="disabled"
                  :loading="loadingUser"
                  @keyup.enter="updateUser"
                ></a-input>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    <a-button
        :style="{
          position: 'absolute',
          bottom: '55px',
          width: '85%',
        }"
        type="primary"
        block
        @click="showChangePasswordForm"
      >
        Đổi mật khẩu
      </a-button>
      <a-button
        :style="{
          position: 'absolute',
          bottom: '10px',
          width: '85%',
          background: '#00885a',
          borderColor: '#00885a',
          color: '#fff',
        }"
        danger
        block
        @click="logout"
        :loading="isLogoutLoading"
      >
        Đăng xuất</a-button
      > 
    </a-drawer> -->
    <div class="modal">
      <a-modal
        :visible="isShowUserInfor"
        :ok-button-props="{
          style: {
            background: '#00885a',
            borderColor: '#00885a',
            marginRight: '8px',
          },
        }"
        :cancel-button-props="{
          style: { border: 'none' },
        }"
        :confirm-loading="confirmLoading"
        width="fit-content"
        :title="$t(`topnavbar.subMenu.my_acount`)"
        @close="handleOk"
        @cancel="handleOk"
        @ok="handleOk"
      >
        <a-row>
          <a-col :span="8"></a-col>
          <a-col :span="12">
            <a-upload
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :customRequest="customRequest"
              :before-upload="beforeUpload"
              @preview="handlePreview"
              @change="handleChange"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                alt="avatar"
                style="width: 100px; height: 100px; object-fit: cover"
              />
              <div v-else>
                <loading-outlined v-if="loadingImg"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">
                  {{ $t("topnavbar.add_avatar") }}
                </div>
              </div>
            </a-upload>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <div class="description">
              <div class="edit-user">
                <h2 class="title">{{ $t("topnavbar.user_info") }}</h2>
                <EditOutlined @click="handleEdit" v-if="disabled" />
                <CheckOutlined
                  style="color: rgb(102, 187, 106)"
                  @click="updateUser"
                  v-else
                />
              </div>
              <div class="info">
                <div class="edit">
                  <span>{{ $t("topnavbar.acount") }}</span>
                  <a-input
                    v-model:value="username"
                    :disabled="true"
                    :loading="loadingUser"
                    @keyup.enter="updateUser"
                  ></a-input>
                </div>
              </div>
              <div class="info">
                <div class="edit">
                  <span>{{ $t("topnavbar.username") }}</span>
                  <a-input
                    v-model:value="full_name"
                    :disabled="disabled"
                    :loading="loadingUser"
                    @keyup.enter="updateUser"
                  ></a-input>
                </div>
              </div>
              <div class="info">
                <div class="edit">
                  <span>{{ $t("topnavbar.email") }}</span>
                  <a-input
                    v-model:value="email"
                    :disabled="disabled"
                    :loading="loadingUser"
                    @keyup.enter="updateUser"
                  ></a-input>
                </div>
              </div>
              <div class="info">
                <div class="edit">
                  <span>{{ $t("topnavbar.number_phone") }}</span>
                  <a-input
                    v-model:value="mobile_no"
                    :disabled="disabled"
                    :loading="loadingUser"
                    @keyup.enter="updateUser"
                  ></a-input>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-modal>
    </div>
    <a-drawer
      width="320"
      placement="right"
      :closable="false"
      v-model:visible="visibleQuestion"
      @close="onCloseQuestion"
      :bodyStyle="styleQuestion"
    >
      <div class="noti-heading">
        <h3 style="margin: 0">{{ $t("topnavbar.help") }}</h3>
        <a
          href="https://cetawms.gitbook.io/product-docs/"
          target="_blank"
          style="font-size: 12px"
          >{{ $t("topnavbar.other_tab") }}
          <ExportOutlined style="color: #1890ff"
        /></a>
      </div>
      <iframe :src="srcQuestion" class="iframe-question" title="help"></iframe>
    </a-drawer>
    <a-modal
      :visible="isShowChangePassword"
      :title="$t(`topnavbar.subMenu.change_password`)"
      okText="ĐỔI MẬT KHẨU"
      cancelText="TRỞ LẠI"
      :ok-button-props="{
        style: {
          background: '#00885a',
          borderColor: '#00885a',
          marginRight: '8px',
        },
      }"
      :cancel-button-props="{
        style: { border: 'none' },
      }"
      :confirm-loading="confirmLoading"
      @ok="changePassword"
      @cancel="handleCancel"
    >
      <a-form ref="ruleForm" :model="formState" :rules="rules" v-bind="layout">
        <a-form-item has-feedback label="Mật khẩu hiện tại" name="pass">
          <a-input-password v-model:value="formState.pass" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="Mật khẩu mới" name="checkPass">
          <a-input-password
            v-model:value="formState.checkPass"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="Xác nhận mật khẩu" name="confirmPass">
          <a-input-password
            v-model:value="formState.confirmPass"
            autocomplete="off"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import axios from "axios";
import mixins from "@/mixins";
import moment from "moment/moment";
import {
  BellOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  ExportOutlined,
  FacebookOutlined,
  PlusOutlined,
  LoadingOutlined,
  EditOutlined,
  CheckOutlined,
  FileSearchOutlined,
  KeyOutlined,
} from "@ant-design/icons-vue";
import { notification, message, Table } from "ant-design-vue";
import NotificationService from "@/services/NotificationService";
import AuthenticateService from "@/services/AuthenticateService";
import FileService from "@/services/FileService";
import UserService from "@/services/UserService";
const entity = "order-customer";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  mixins: [mixins],
  components: {
    BellOutlined,
    UserOutlined,
    QuestionCircleOutlined,
    ExportOutlined,
    FacebookOutlined,
    PlusOutlined,
    LoadingOutlined,
    EditOutlined,
    CheckOutlined,
    FileSearchOutlined,
    KeyOutlined,
  },
  computed: {
    getAvatar() {
      return this.username ? this.username.charAt(0).toUpperCase() : "";
    },
  },
  emits: ["receiveMessage"],
  data() {
    let validatePass = async (rule, value) => {
      if (value === "") {
        return Promise.reject("Bạn phải nhập mật khẩu");
      } else return Promise.resolve();
    };

    let validateNew = async (rule, value) => {
      if (value === "") {
        return Promise.reject("Bạn phải nhập mật khẩu mới");
      } else if (value === this.formState.pass) {
        return Promise.reject("Mật khẩu mới phải khác mật khẩu cũ");
      } else if (value.length < 6 || value.length > 8) {
        return Promise.reject("Mật khẩu phải từ 6-8 ký tự");
      } else {
        return Promise.resolve();
      }
    };
    let validateConfirm = async (rule, value) => {
      if (value === "") {
        return Promise.reject("Bạn phải xác nhận lại mật khẩu mới");
      } else if (value !== this.formState.checkPass) {
        return Promise.reject("Mật khẩu xác nhận chưa chính xác");
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
      pass: [
        {
          required: true,
          validator: validatePass,
          trigger: "change",
        },
      ],
      checkPass: [
        {
          required: true,
          validator: validateNew,
          trigger: "change",
        },
      ],
      confirmPass: [
        {
          required: true,
          validator: validateConfirm,
          trigger: "change",
        },
      ],
    };
    const username = this.$auth.user() ? this.$auth.user().username : "";
    const email = this.$auth.user() ? this.$auth.user().email : "";
    const mobile_no = this.$auth.user() ? this.$auth.user().mobile_no : "";
    const full_name = this.$auth.user() ? this.$auth.user().full_name : "";

    return {
      entity,
      moment,
      rules,
      show: false,
      detail: {},
      loading: false,
      loadingImg: false,
      params: {
        pageIndex: 1,
      },
      imageNotify: require("@/assets/img/WMS_FINAL_LOGO-07.png").default,
      totalUnreadNotification: 0,
      totalNotification: 0,
      totalMes: 0,
      notificationList: [],
      notificationVisible: false,
      visible: false,
      visibleQuestion: false,
      showButton: true,
      style: {
        padding: "39px 16px 52px 16px",
      },
      styleQuestion: {
        padding: "40px 10px 10px ",
        height: "100vh",
      },
      isShowChangePassword: false,
      isShowUserInfor: false,
      formState: {
        pass: "",
        checkPass: "",
        confirmPass: "",
      },
      layout: {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
      },
      confirmLoading: false,
      srcQuestion: "",
      fileList: [],
      imageUrl: "",
      fcmToken: "",
      disabled: true,
      loadingUser: false,
      isLogoutLoading: false,
      username,
      full_name,
      email,
      mobile_no,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.imageUrl = this.$auth.user().avatarUrl || "";
      }
    },
  },
  methods: {
    handleOk() {
      this.isShowUserInfor = false;
    },
    hideModal() {
      this.show = false;
    },
    showOrderDetail(item, index) {
      axios
        .get(`${this.entity}/${item.action_id}`)
        .then((response) => {
          if (response.data.errorCode != 0) {
            if (Array.isArray(response.data.errorMessage)) {
              this.$message.error(
                response.data.errorMessage.map((p) => p.errorMessage).join("\n")
              );
            } else {
              this.$message.error(response.data.errorMessage);
            }
            return;
          }
          this.detail = response.data.data;
          this.show = true;
          this.notificationList[index].read_status = 1;
          this.updateNotificationLog(item.id);
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    saveStatus($event) {
      if (this.$refs.list) {
        this.$refs.list.reload();
      }
    },
    showNotification() {
      this.notificationVisible = true;
    },
    onCloseNotification() {
      this.notificationVisible = false;
    },
    onCloseQuestion() {
      this.visibleQuestion = false;
    },
    showNotificationDetail(item) {
      // this.notificationVisible = false;
      if (item.action_screen == 1) {
        this.$router.push({ path: "order-customer" });
      }
    },
    showUserInfo() {
      this.isShowUserInfor = true;
    },
    showQuestion() {
      this.visibleQuestion = true;
      this.srcQuestion = "https://cetawms.gitbook.io/product-docs/";
    },
    onClose() {
      this.visible = false;
    },
    async logout() {
      this.isLogoutLoading = true;
      // indexedDB.databases().then((dbs) => {
      //   var promises = dbs.map((db) => {
      //     return new Promise((resolve, reject) => {
      //       var req = indexedDB.deleteDatabase('myDataBase');
      //       req.onsuccess = resolve;
      //       req.onerror = reject;
      //       req.onblocked = reject;
      //     });
      //   });
      //   Promise.all(promises).then(console.log).catch(console.error);
      // });
      const dbs = await window.indexedDB.databases();
      dbs.forEach((db) => {
        window.indexedDB.deleteDatabase(db.name);
      });
      this.$auth
        .logout({
          makeRequest: true,
          params: {
            fcmToken: this.fcmToken,
          },
        })
        .then(
          (res) => {
            localStorage.clear();
            this.$router.push("/login");
          },
          (res) => {
            this.isLogoutLoading = false;
            console.error(res);
          }
        );
    },
    showMore() {
      this.params.pageIndex++;
      this.loadNotification();
      this.loading = true;
    },
    loadNotification() {
      var notiList = [];
      NotificationService.all(this.params.pageIndex)
        .then((response) => {
          if (response.data.data.totalPage == this.params.pageIndex) {
            this.showButton = false;
          }
          if (response.data.errorCode != 0) return;
          this.totalUnreadNotification = response.data.data.countUnread;
          notiList = response.data.data.items;
          this.notificationList = this.notificationList.concat(notiList);
          this.totalNotification = response.data.data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateNotificationLog(id) {
      NotificationService.saveItem(id)
        .then((response) => {})
        .catch((error) => {
          console.error(error);
        });
    },
    onReadAllNotification() {
      NotificationService.postRead()
        .then((response) => {
          this.notificationList.forEach((item) => {
            item.read_status = 1;
          });
          this.totalUnreadNotification = 0;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    registerFcmToken() {
      var vm = this;
      const messaging = this.$messaging;
      try {
        messaging
          .requestPermission()
          .then(function () {
            return messaging.getToken();
          })
          .then(function (token) {
            vm.updateFcmToken(vm, token);
          })
          .catch(function (err) {
            console.log("*****Unable to get permission to notify.", err);
          });

        messaging.onMessage(function (payload) {
          vm.totalNotification++;

          notification.open({
            message: payload.data.title || "TTD thông báo",
            description: payload.data.message,
            onClick: () => {
              console.log("Notification Clicked!");
            },
          });
        });
      } catch (error) {
        console.error(error);
      }
    },
    updateFcmToken(vm, fcmToken) {
      NotificationService.updateFcm(fcmToken)
        .then((response) => {
          console.log("FCM token" + fcmToken);
          vm.fcmToken = fcmToken;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    showChangePasswordForm() {
      this.isShowChangePassword = true;
    },
    changePassword(e) {
      e.preventDefault();
      this.$refs.ruleForm.validate().then(() => {
        const params = {
          oldPassword: this.formState.pass,
          newPassword: this.formState.checkPass,
          newPasswordConfirm: this.formState.confirmPass,
        };
        this.confirmLoading = true;
        AuthenticateService.changePassword(params)
          .then((response) => {
            if (response.data.errorCode == 0) {
              message
                .loading("Đang đổi mật khẩu..", 1.5)
                .then(
                  () => message.success("Đổi mật khẩu thành công", 1.5),
                  () => {}
                )
                .then(
                  () => (this.isShowChangePassword = false),
                  () => (this.confirmLoading = false)
                )
                .then(() => this.$auth.logout());
            }
          })
          .catch((error) => {
            this.confirmLoading = false;
            message.error("Có lỗi xảy ra, vui lòng thử lại");
          });
      });
    },
    handleCancel() {
      this.$refs.ruleForm.resetFields();
      this.isShowChangePassword = false;
    },

    // Upload ảnh
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("Bạn chỉ được upload ảnh định dạng jpeg hoặc png");
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error("Dung lượng ảnh không được quá 5MB");
      }
      return isJpgOrPng && isLt5M;
    },

    handleChange(info) {
      if (info.file.status === "uploading") {
        this.loading = true;
        return;
      }
      if (info.file.status === "done") {
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;

          let user = this.$auth.user();
          user.avatarUrl = this.imageUrl;
          this.$auth.user(user);
          this.loading = false;
        });
      }
    },

    customRequest(options) {
      const { onSuccess, onError, file } = options;
      this.loadingImg = true;
      FileService.upload(file)
        .then((response) => {
          onSuccess(response.data.data.fileId);
          let avatar_id = response.data.data.fileId;
          this.fetchAvatar(avatar_id);
        })
        .catch((err) => {
          onError(err);
        });
    },
    fetchAvatar(avatar_id) {
      let data = {
        avatar_id: avatar_id,
      };
      UserService.updatedAvatar(data)
        .then((response) => {
          if (response.data.errorCode == 0) {
            this.loadingImg = false;
          }
        })
        .catch((err) => {
          onError(err);
        });
    },

    // Edit thông tin người dùng

    handleEdit() {
      this.disabled = false;
    },
    updateUser() {
      let data = {
        full_name: this.full_name,
        email: this.email,
        mobile_no: this.mobile_no,
        username: this.username,
      };
      UserService.updatedUser(data)
        .then((respones) => {
          if (respones.data.errorCode == 0) {
            this.disabled = true;
          } else {
            this.$message.error(respones.data.errorMessage.email);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
  },
  mounted() {
    // this.loadNotification();
    // console.log("Firebase cloud messaging object", this.$messaging);
    this.registerFcmToken();
  },
};
</script>
<style lang="scss" scoped>
.menu_container {
  .ant-menu-light {
    padding: 0px 24px;
    :deep(.ant-menu-item) {
      display: flex;
      align-items: center;
      color: green;
      padding: 4px 16px;
      border: none;
      top: 0px;
      margin-top: 0px;
      .anticon {
        font-size: 24px;
        margin: 0;
        padding: 0px 4px;
      }
    }
    :deep(.ant-menu-item:hover) {
      background: rgba(0, 255, 0, 0.3);
    }
    :deep(.ant-menu-item-selected) {
      background: rgba(0, 255, 0, 0.3);
    }
  }
}
.ant-dropdown-menu {
  padding: 0;
}
.ant-dropdown-menu-vertical {
  :deep(.ant-dropdown-menu-item) {
    padding: 8px 16px;
    color: green;
    .anticon {
      border: 1px solid green;
      padding: 8px;
      border-radius: 50%;
    }
  }
  :deep(.ant-dropdown-menu-item:hover) {
    background: rgba(0, 255, 0, 0.3);
  }
}
.ant-avatar {
  color: white;
  background: green;
  margin-right: 4px;
}
</style>
<style scoped lang="scss">
.noti-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 8px 12px;
  text-align: right;
  left: 0px;
  background: #e8e8e8;
  z-index: 10;
}
.ant-list-vertical .ant-list-item-meta {
  margin: 0 !important;
  margin-bottom: 16px !important;
  padding: 0px !important;
}

.ant-list-vertical .ant-list-item-meta-title {
  margin-bottom: 0 !important;
}
.iframe-question {
  width: 100%;
  height: 100%;
  border: unset;
}
.description {
  .edit-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .edit {
      display: flex;
      align-items: center;
      margin: 2px 0;
      span {
        display: block;
        width: 80px;
      }
      input {
        width: 200px;
      }
      .ant-input[disabled] {
        color: #000;
      }
    }
  }
}
</style>
