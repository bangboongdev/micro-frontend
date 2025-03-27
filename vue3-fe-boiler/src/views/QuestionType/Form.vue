<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
    labelAlign="left"
  >
    <a-form-item :label="fields.avatar_id.label" name="avatar_id">
      <a-upload
        v-model:file-list="fileList"
        name="avatar_id"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :customRequest="customRequest"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="avatar" />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">Tải ảnh</div>
        </div>
      </a-upload>
    </a-form-item>

    <a-form-item :label="fields.code.label" name="code">
      <a-input
        v-model:value="form.code"
        :placeholder="fields.code.placeholder"
        :maxlength="50"
      />
    </a-form-item>

    <a-form-item :label="fields.name.label" name="name">
      <a-input
        v-model:value="form.name"
        :placeholder="fields.name.placeholder"
        :maxlength="100"
      />
    </a-form-item>

    <a-form-item :label="fields.is_active.label" name="is_active">
      <a-switch
        :checked="form.is_active == 1 ? true : false"
        @change="handleChangeActive"
      />
    </a-form-item>

    <a-form-item :label="fields.description.label" name="description">
      <a-textarea
        v-model:value="form.description"
        :placeholder="fields.description.placeholder"
        :maxlength="255"
      />
    </a-form-item>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";

import { getImage, getBase64, validateImageFile } from "@/formUtility";
import { message } from "ant-design-vue";
import FileService from "@/services/FileService";
const loading = ref<boolean>(false);
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  width: "",
  rules: {},
  fields: {},
});
const imageUrl = ref<any>(getImage(props.formData.avatar_id));
const fileList = ref<any>([]);
const customRequest = (options) => {
  const { onSuccess, onError, file } = options;
  FileService.upload(file)
    .then((response) => {
      onSuccess(response.data.data.file_id);
    })
    .catch((err) => {
      onError(err);
    });
};
const beforeUpload = (file) => {
  return validateImageFile(file, message);
};
const handleChange = (info) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    getBase64(info.file.originFileObj, (base64Url) => {
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

interface Props {
  formData: any;
  width: string;
  rules: any;
  fields: any;
}
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 8 });
const wrapperCol = ref<{ span: number }>({ span: 16 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);

const handleChangeActive = ($event?: any) => {
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
</style>