<template>
  <a-form
    ref="ruleForm"
    :rules="formRules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
    labelAlign="left"
  >
    <a-row>
      <a-col :span="12">
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
        <a-form-item :label="fields.is_active.label" name="is_active">
          <a-switch
            :checked="form.is_active == 2 ? true : false"
            @change="handleChangeActive"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-row>
          <a-col class="info">{{$t('utility.title.general_information')}}</a-col>
          <a-col :span="24">
            <a-form-item :label="fields.code.label" name="code">
              <a-input
                v-model:value="form.code"
                :placeholder="fields.code.placeholder"
              />
            </a-form-item>

            <a-form-item :label="fields.name.label" name="name">
              <a-input
                v-model:value="form.name"
                :placeholder="fields.name.placeholder"
              />
            </a-form-item>

            <a-form-item :label="fields.type_id.label" name="type">
              <o-select
                ref="type"
                :value="form.type"
                @input="onChangeUtilityType"
                placeholder="Vui lòng chọn loại tiện ích"
                entity="utility-type"
                :title="'Loại tiện ích'"
                :icon="'environment'"
                :isDisplay="'none'"
                :isDisplayAdd="'none'"
                textField="name"
                valueField="id"
              />
            </a-form-item>

            <a-form-item :label="fields.description.label" name="description">
              <a-textarea
                v-model:value="form.description"
                :placeholder="fields.description.placeholder"
                :maxlength="255"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col class="info">{{$t('utility.title.contact_info')}}</a-col>
          <a-col :span="24">
            <a-form-item :label="fields.mobile_no.label" name="mobile_no">
              <a-input
                v-model:value="form.mobile_no"
                :placeholder="fields.mobile_no.placeholder"
              />
            </a-form-item>

            <a-form-item :label="fields.email.label" name="email">
              <a-input
                v-model:value="form.email"
                :placeholder="fields.email.placeholder"
              />
            </a-form-item>

            <a-form-item :label="fields.province_id.label" name="province">
              <o-select
                ref="province"
                :value="form.province"
                @input="onChangeProvince"
                placeholder="Vui lòng chọn tỉnh/thành phố"
                entity="province"
                :title="'Tỉnh/Thành phố'"
                :icon="'environment'"
                :isDisplay="'none'"
                :isDisplayAdd="'none'"
                textField="title"
                valueField="province_id"
              />
            </a-form-item>

            <a-form-item :label="fields.district_id.label" name="district">
              <o-select
                ref="district"
                :value="form.district"
                @input="form.district = $event"
                placeholder="Vui lòng chọn quận/huyện"
                entity="district"
                :disabled="districtDisabled"
                :title="'Quận/Huyện'"
                :icon="'environment'"
                :isDisplay="'none'"
                textField="title"
                valueField="district_id"
                :filters="[
                  {
                    field: 'province_id',
                    operator: 'equal',
                    value: form?.province?.value,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";

import { getImage, getBase64, validateImageFile } from "@/formUtility";
import { message } from "ant-design-vue";
import FileService from "@/services/FileService";
import i18n from "@/lang";
const { t } = i18n.global;
const startTime = ref();
const endTime = ref();
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
const labelCol = ref<{ span: number }>({ span: 9 });
const wrapperCol = ref<{ span: number }>({ span: 15 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);
let formRules = ref<any>({ ...props.rules });
let validateProvince = (rule?:any, value?:any) =>{
     if (typeof value === "undefined" || value?.key == undefined) {
        return Promise.reject(
         t("validator.select_require",{field:t("utility.attribute.name_of_province_id")})
        );
      } else {
        return Promise.resolve();
      }
}
let validateDistrict = (rule?:any, value?:any) =>{
     if (typeof value === "undefined" || value?.key == undefined) {
        return Promise.reject(
         t("validator.select_require",{field:t("utility.attribute.name_of_district_id")})
        );
      } else {
        return Promise.resolve();
      }
}
let validateTypeId = (rule?:any, value?:any) =>{
     if (typeof value === "undefined" || value?.key == undefined) {
        return Promise.reject(
         t("validator.select_require",{field:t("utility.attribute.type_id")})
        );
      } else {
        return Promise.resolve();
      }
}
formRules.value.province = [
  {
    required: true,
    validator: validateProvince,
    trigger: "change",
  },
];
formRules.value.district = [
  {
    required: true,
    validator: validateDistrict,
    trigger: "change",
  },
];
formRules.value.type = [
  {
    required: true,
    validator: validateTypeId,
    trigger: "change",
  },
];
const province = ref();
const district = ref();
const onChangeProvince = ($event) => {
  form.value.province = $event.value;
  let item = district.value;
  districtDisabled.value = typeof $event == "undefined";
  form.value.district = void 0;

  onChangeLocation($event, item, "province_id");
};
const onChangeDistrict = ($event) => {
  form.value.district = $event.value;
};
const onChangeLocation = ($event, item, field) => {
  let value = $event.value ? $event.value.key : void 0;
  item.onLoad({ field, value });
};

const type = ref();
const onChangeUtilityType = ($event) => {
  
  console.log($event.value);
  form.value.type = $event.value;
};

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 1;
  } else {
    form.value.is_active = 2;
  }
};
defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
.avatar-uploader > .ant-upload {
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
.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}
.info {
  margin-bottom: 16px;
  border-bottom: 1px solid gray;
}
</style>