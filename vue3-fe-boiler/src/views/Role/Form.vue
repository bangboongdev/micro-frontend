<template>
  <a-form
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-row :gutter="16">
      <a-col span="12">
        <a-form-item
          :label="fields.title.label"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          name="title"
        >
          <a-input
            v-model:value="form.title"
            :placeholder="fields.title.placeholder"
          />
        </a-form-item>
      </a-col>
      <a-col span="12">
        <a-form-item
          :label="fields.name.label"
          :label-col="{ span: 24 }"
          :wrapper-col="{ span: 24 }"
          name="name"
        >
          <a-input
            v-model:value="form.name"
            :placeholder="fields.name.placeholder"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-form-item
        style="width: 100%"
        :wrapper-col="{ span: 24 }"
        name="listPermission"
      >
        <div class="list-permission">
          <div class="list-permission-sticky">
            <a-row style="justify-content: space-between">
              <h2>{{ $t("role.extend.permission_info") }}</h2>
              <div class="option">
                <a-button @click="handleCheckAll">
                  <template #icon
                    ><CheckCircleOutlined style="color: #12509b"
                  /></template>
                  {{ $t("common.select_all") }}</a-button
                >
                <a-button style="margin-left: 8px" @click="handleUncheckAll">
                  <template #icon
                    ><CloseCircleOutlined style="color: #12509b"
                  /></template>
                  {{ $t("common.unselect_all") }}</a-button
                >
              </div>
            </a-row>
            <a-row class="title-permission">
              <a-col span="5" class="text-center">
                <a-button
                  type="link"
                  @click="showCollapse"
                  v-if="activeKey.length != 3"
                >
                  <template #icon><PlusOutlined /></template>
                </a-button>
                <a-button type="link" @click="hiddenCollapse" v-else>
                  <template #icon><MinusOutlined /></template>
                </a-button>
              </a-col>
              <a-col span="5">{{ $t("role.title.permission") }}</a-col>
              <a-col
                span="2"
                class="text-center"
                v-for="(item, index) in permissionNames"
                :key="index"
                >{{ item }}</a-col
              >
            </a-row>
          </div>
          <a-skeleton active :loading="loading">
            <a-collapse v-model:activeKey="activeKey" :bordered="false">
              <template #expandIcon="{ isActive }">
                <PlusOutlined v-if="!isActive" />
                <MinusOutlined v-else />
              </template>
              <a-collapse-panel
                v-for="(permission, name) in permission"
                :key="name"
                :header="$t('role.groups.' + name)"
              >
                <a-row
                  v-for="(item, name) in permission"
                  :key="name"
                  style="padding: 8px 0"
                >
                  <a-col span="5"></a-col>
                  <a-col span="5">{{ $t("role.roles." + name) }}</a-col>
                  <a-col
                    class="text-center"
                    span="2"
                    v-for="(check, index) in item"
                    :key="index"
                  >
                    <a-checkbox
                      :checked="check.is_permission != 0 ? true : false"
                      @change="changeCheckBox(check, index, item, $event)"
                      :disabled="check.isDisabled"
                    ></a-checkbox>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-skeleton>
        </div>
      </a-form-item>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import RoleService from "@/services/RoleService";
import { watch, ref, toRefs } from "vue";
import { message } from "ant-design-vue";
import i18n from "@/lang";
const { t } = i18n.global;
import {
  PlusOutlined,
  MinusOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons-vue";
import constant from "@/constant";
interface Props {
  formData: any;
  show: boolean;
  visible: boolean;
  mode: string;
  entity: string;
  handleCallback: boolean;

  width: string;
  fields: any;
  rules: any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  show: false,
  visible: false,
  mode: "",
  entity: "",
  handleCallback: false,

  width: "",
  fields: {},
  rules: {},
});
const permissionNames = ["Xem", "Thêm", "Sửa", "Xóa", "Nhập", "Xuất", "Duyệt"];
const activeKey = ref<Array<string>>([
  "dashboard",
  "product",
  "exam",
  "category",
  "management",
]);
const permission = ref<any>({});
const data = ref<Array<any>>([]);
const option = ref<Array<any>>([]);
const form = ref<any>(props.formData);
const confirmLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const isCallBack = ref<boolean>(true);
const ruleForm = ref();
const emit = defineEmits<{
  (e: "reloadGrid"): void;
   (e: "reload"): void;
  (e: "hiddenModal"): void;
}>();

const showCollapse = () => {
  activeKey.value = ["dashboard", "product", "exam", "category", "management"];
};
const hiddenCollapse = () => {
  activeKey.value = [];
};
const fetchPermission = () => {
  
  loading.value = true;
  RoleService.getPermission()
    .then((response) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage.map((p) => p.errorMessage).join("\n")
          );
        } else {
          message.error(response.data.errorMessage);
        }
        return false;
      } else {
        permission.value = response.data.data;
        
        loading.value = false;
      }
    })
    .catch((error) => {
      message.error(error.message);
      loading.value = false;
    });
};
// renderName(value) {
//   const name = this.groups.find((p) => p.value == value);
//   return name ? name.text : value;
// },
const changeCheckBox = (check, index, item, $event) => {
  if (!$event.target.checked) {
    check.is_permission = 0;
    if (index == 0) {
      item
        .filter((p) => p.id != check.id)
        .map((p) => {
          p.isDisabled = true;
          p.is_permission = 0;
        });
    }
  } else {
    check.is_permission = check.id;
    if (index == 0) {
      item
        .filter((p) => p.id != check.id)
        .map((p) => {
          p.isDisabled = false;
          p.is_permission = 0;
        });
    }
  }
};
const handleCheckAll = () => {
  let listPermission = convertPermissionList();
  listPermission.map((item: any) => {
    item.is_permission = item?.id;
    item.isDisabled = false;
  });
};
const handleUncheckAll = () => {
  let listPermission = convertPermissionList();
  listPermission.map((item: any) => {
    if (item.name.slice(0, 4) != "view") {
      item.isDisabled = true;
    } else {
      item.isDisabled = false;
    }
    item.is_permission = 0;
  });
};
const handleCancel = () => {
  emit("reload");
};
const handleOk = (e) => {
  e.preventDefault();
  ruleForm.value?.validate().then(() => {
    confirmLoading.value = true;
    let listPermission = convertPermissionList();
    let forms = JSON.parse(JSON.stringify(form.value));
    forms.listPermission = listPermission.filter(
      (p: any) => p.is_permission != 0
    );
    saveFormData(forms);
  });
};
const convertPermissionList = () => {
 
  let data = permission.value;
  let groupData = {};
  let listPermission: any = [];
  for (const prop in data) {
    groupData[prop] = {};
    for (const per in data[prop]) {
      groupData[prop][per] = [];
      for (let i = 0; i < data[prop][per].length; i++) {
        let item = data[prop][per][i];
        listPermission.push(item);
      }
    }
  }

  return listPermission;
};
const saveFormData = (form) => {
  RoleService.save(form)
    .then((response) => {
      debugger
      if (response.data.errorCode == 0) {
        message.success(t("common.save_success"));
        confirmLoading.value = false;
        handleCancel();
      }
    })
    .catch((error) => {
      message.error(error.message);
      confirmLoading.value = false;
    });
};
watch(
  () => props.show,
  (val) => {
    if (val && form.value.mode == "add") {
      fetchPermission();
      form.value.name = "";
      form.value.title = "";
      form.value.listPermission = [];
      form.value.id = null;
    }
    if (val && form.value.mode == "edit") {
      permission.value = props.formData.listPermission;
      form.value.id = props.formData.id;
    }
  },
  { immediate: true }
);
watch(
  () => props.handleCallback,
  (val) => {

    if (val == true) {
      let listPermission = convertPermissionList();
      let forms = JSON.parse(JSON.stringify(form.value));
      forms.id = props.formData.id || null;
      forms.listPermission = listPermission.filter(
        (p: any) => p.is_permission != 0
      );
      saveFormData(forms);
    }
  },
  { immediate: true }
);
defineExpose({ ruleForm, form,isCallBack });
</script>
<style scoped lang="scss">
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
.text-center {
  text-align: center;
}
.list-permission {
  max-height: 560px;
  overflow: auto;
}

.list-permission-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
  background: #fafafa;
  .title-permission {
    justify-content: center;
    border-bottom: 1px solid #d9d9d9;
  }
}
</style>
