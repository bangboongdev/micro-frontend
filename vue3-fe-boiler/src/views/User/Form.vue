<template>
  <a-form ref="ruleForm" :rules="formRules" :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
    :layout="'horizontal'">
    <a-row>
      <a-col :span="10">
        <a-form-item name="avatar_id" :label="fields.avatar_id.label">
          <a-upload v-model:file-list="fileList" name="avatar_id" list-type="picture-card" class="avatar-uploader"
            :show-upload-list="false" :customRequest="customRequest" :before-upload="beforeUpload"
            @change="handleChange">
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Tải ảnh</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :label="fields.is_active.label" name="is_active">
          <a-switch :checked="form.is_active == 1 ? true : false" @change="handleChangeActive" />
        </a-form-item>
      </a-col>

      <a-col :span="14">
        <a-row>
          <a-col class="info">Thông tin nhân viên:</a-col>
          <a-col :span="24">
            <a-form-item name="full_name" :label="fields.full_name.label">
              <a-input 
                v-model:value="form.full_name" 
                :placeholder="fields.full_name.placeholder" />
            </a-form-item>
            <a-form-item :label="fields.phone_number.label" name="phone_number">
              <a-input 
                v-model:value="form.phone_number" 
                :placeholder="fields.phone_number.placeholder" />
            </a-form-item>
            <a-form-item :label="fields.email.label" name="email">
              <a-input 
                v-model:value="form.email" 
                :placeholder="fields.email.placeholder" />
            </a-form-item>
          </a-col>
          <a-col class="info">Thông tin tài khoản:</a-col>
          <a-col :span="24">
            <a-form-item name="username" :label="fields.username.label">
              <a-input 
                v-model:value="form.username" 
                :placeholder="fields.username.placeholder" allow-clear />
            </a-form-item>
            <a-form-item name="password" :label="fields.password.label">
              <a-input-password 
                v-model:value="form.password" 
                :placeholder="fields.password.placeholder" 
                allow-clear
                autoComplete="new-password" 
                ref="password" 
              />
            </a-form-item>
            <a-form-item name="confirm_password" :label="fields.confirm_password.label">
              <a-input-password 
                v-model:value="form.confirm_password" 
                :placeholder="fields.confirm_password.placeholder"
                allow-clear 
              />
            </a-form-item>
            <a-form-item :label="fields.role_ids.label" name="role">
              <o-select 
                ref="role" 
                v-model:value="form.role" 
                @input="form.role = $event"
                @delete="onChangeRoleDelete($event)" 
                :placeholder="fields.role_ids.placeholder" 
                entity="role"
                :mode="'multiple'"
                :textField="'title'" 
                :isDisplay="'none'" 
                :showSearch="false"
                
             />
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import { getImage, getBase64, validateImageFile } from "@/formUtility";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import FileService from "@/services/FileService";
import { watch, ref, toRefs } from "vue";
import { message } from "ant-design-vue";
import i18n from "@/lang";
const { t } = i18n.global;
interface Props {
  formData: any;
  show: boolean;
  // visible: boolean;
  // mode: string;
  // entity: string;
  // handleCallback: boolean;

  width: string;
  fields: any;
  rules: any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  show: false,
  // visible: false,
  // mode: "",
  // entity: "",
  // handleCallback: false,

  width: "",
  fields: {},
  rules: {},
});
const ruleForm = ref()
const form = ref<any>(props.formData); 
let validatePassword = async (rule: any, value: string) => {
  if (form.value.mode == "add") {
    if (value === "") {
      return Promise.reject(
        t("validator.required", {
          field: t("user.attribute.password"),
        })
      );
    } else {
      if (form.value.confirm_password !== "") {
        ruleForm.value.validateField("confirm_password");
      }
      return Promise.resolve();
    }
  } else {
    if (
      typeof value != "undefined" &&
      value !== "" &&
      form.value.confirm_password !== ""
    ) {
      ruleForm.value.validateField("confirm_password");
    }
    return Promise.resolve();
  }
};
let validateConfirmPassword = async (rule: any, value: string) => {
  if (form.value.mode == "add") {
    if (value === "") {
      return Promise.reject(
        t("validator.required", {
          field: t("user.attribute.confirm_password"),
        })
      );
    } else if (value !== form.value.password) {
      return Promise.reject(
        t("validator.not_equal", {
          value: t("user.attribute.password"),
          value1: t("user.attribute.confirm_password"),
        })
      );
    } else {
      return Promise.resolve();
    }
  } else {
    if (
      typeof value != "undefined" &&
      value !== "" &&
      value !== form.value.password
    ) {
      return Promise.reject(
        t("validator.not_equal", {
          value: t("user.attribute.password"),
          value1: t("user.attribute.confirm_password"),
        })
      );
    } else {
      return Promise.resolve();
    }
  }
};
let formRules = { ...props.rules };
formRules.password = [
  {
    required: true,
    validator: validatePassword,
    trigger: "change",
  },
];
formRules.confirm_password = [
  { validator: validateConfirmPassword, trigger: "change" },
];
let validateRole = async (rule: any, value: string) => {
  if (typeof value == "undefined" || value == "") {
    return Promise.reject(
      t("validator.select_require", { field: t("user.attribute.name_of_role_ids") })
    );
  } else {
    return Promise.resolve();
  }
}
formRules.role = [
  {
    required: true,
    validator: validateRole,
    trigger: "change",
  },
];
const loading = ref<boolean>(false);
const fileList = ref<Array<any>>([]);
const imageUrl = ref<any>(getImage(props.formData.avatar_id));
const onChangeRoleDelete = ($event: { key: any; }) => {
  form.value.role = form.value.role.filter((p: { key: any; }) => p.key != $event.key);
};
const handleChange = (info: { file: { status: string; originFileObj: any; response: any; }; }) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    getBase64(info.file.originFileObj, (base64Url: any) => {
      imageUrl.value = base64Url;
      loading.value = false;
      form.value.avatar_id = info.file.response;
    });
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};
const beforeUpload = (file: any) => {
  return validateImageFile(file, message);
};
const customRequest = (options: { onSuccess: any; onError: any; file: any; }) => {
  const { onSuccess, onError, file } = options;
  FileService.upload(file)
    .then((response) => {
      onSuccess(response.data.data.file_id);
    })
    .catch((err) => {
      onError(err);
    });
};

const handleChangeActive = ($event: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};

defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}

.avatar-uploader>.ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.info {
  margin-bottom: 16px;
  border-bottom: 1px solid gray;
}
.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}
</style>