
<template>
  <div>
    <div class="indicator" v-if="pageLoading">
      <a-spin :spinning="pageLoading" size="large"> </a-spin>
    </div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="headerTitle"
    >
      <template v-slot:backIcon>
        <ArrowLeftOutlined v-if="isShowBack" @click="() => $router.go(-1)" />
        <template v-else />
      </template>
      <template v-slot:subTitle>
        <UndoOutlined type="undo" @click="reloadGrid" />
      </template>
      <template v-slot:extra>
        <template v-if="advanceMenu.length == 0">
          <slot name="header"></slot>
          <a-button
            @click="handleAdd"
            v-if="
              isAddButton &&
              !(dataTable?.data?.totalCount == 0 && isVisibleEmptySlot)
            "
            :style="{
              color: 'white',
              background: '#00885a',
            }"
            v-permission:add="entity.replaceAll('-', '_')"
          >
            <template #icon><PlusOutlined /></template
            >{{
              $t("common.add", { entity: headerTitle.toLowerCase() })
            }}</a-button
          >
        </template>
        <template v-else>
          <span>{{ `Đã chọn: ${advanceMenu.length}` }}</span>
          <base-export
            v-show="isExport"
            :selected="advanceMenu"
            :entity="entity"
          ></base-export>
          <a-button
            class="mass-del-btn"
            type="danger"
            @click="handleMassDelete"
            v-if="isAddButton"
          >
            {{ $t("common.remove") }}
          </a-button>
        </template>
      </template>

      <a-row type="flex" align="middle" :gutter="[16, 0]">
        <a-col>
          <base-import
            :entity="entity"
            typeButton="text"
            v-if="isImport"
            @uploadCompleted="uploadCompleted"
          ></base-import>
        </a-col>
        <a-col v-if="isCustomColumn">
          <a-popover
            v-model:visible="isCustomOption"
            trigger="click"
            placement="bottomLeft"
            :overlayStyle="{ paddingTop: '0px' }"
          >
            <template #content>
              <a-row
                v-for="column in customColumnConfigs"
                :key="column.id"
                :gutter="[0, 16]"
              >
                <a-col :span="24">
                  <a-checkbox
                    :checked="column.is_checked == 1 ? true : false"
                    @change="handleChangeVisible(column)"
                    :disabled="column.data_field == 'code' ? true : false"
                  >
                    {{ column.title }}</a-checkbox
                  >
                </a-col>
              </a-row>
              <a-row :gutter="[0, 16]" class="button-custom">
                <a-col :span="24">
                  <a-button @click="apply" type="primary">{{
                    $t("common.apply")
                  }}</a-button>
                </a-col>
                <a-col :span="24">
                  <a-button @click="reset">{{ $t("common.reset") }}</a-button>
                </a-col>
              </a-row>
            </template>
            <a style="color: green"
              ><SettingOutlined style="font-size: 20px" />
              {{ $t("common.custom_columns") }}
            </a>
          </a-popover>
        </a-col>
        <a-col>
          <a-dropdown :trigger="['click']" v-if="isViewType">
            <a style="color: green"
              ><EyeOutlined style="font-size: 20px" />
              {{ $t("common.view_type") }}
            </a>
            <template #overlay>
              <a-menu>
                <a-radio-group :value="viewType">
                  <a-menu-item v-for="type in viewTypeList" :key="type.id">
                    <a-radio
                      :value="type.name"
                      @click="changeViewType(type.name)"
                    >
                      {{ type.text }}
                    </a-radio></a-menu-item
                  >
                </a-radio-group>
              </a-menu>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
    </a-page-header>
    <slot name="tabs"></slot>
    <slot
      name="empty"
      v-if="
        dataTable?.data?.totalCount == 0 &&
        isVisibleEmptySlot &&
        viewType == 'table'
      "
    ></slot>
    <!-- <a-empty
      v-if="
       dataTable?.data?.totalCount == 0 &&
        !isVisibleEmptySlot &&
        viewType == 'table'
      "
    >
      <template #description>
        <span>
          {{ $t("common.empty") }}
        </span>
      </template>
      <a-button type="primary" @click="handleAdd">{{
        $t("common.add", {
          entity: title,
        })
      }}</a-button>
    </a-empty> -->
    <keep-alive>
      <o-list
        v-if="viewType == 'list'"
        ref="list"
        :dataList="dataList"
        :entity="entity"
        :columns="columns"
        :isAutoLoad="isAutoLoad"
        :isDateList="isDateList"
        :disabledFitterForm="disabledFitterForm"
        @editRecord="editRecord($event)"
        @getDateList="getDateList"
        @duplicateRecord="duplicateRecord($event)"
        @deleteConfirm="deleteItem($event)"
        @emitData="emitDataList($event)"
        @showAdvance="showAdvance"
        @recordDetail="recordDetail($event)"
        :defaultColumns="defaultColumns"
        :listLoading="listLoading"
      >
        <template #detail>
          <slot name="detailList"></slot>
        </template>
        <template #dynamicButton>
          <slot name="dynamicButton"></slot>
        </template>
      </o-list>
    </keep-alive>
    <keep-alive>
      <o-grid
        v-if="viewType == 'table'"
        ref="grid"
        :entity="entity"
        :columns="columns"
        :defaultColumns="defaultColumns"
        :title="title"
        :isPopup="false"
        :isAutoLoad="isAutoLoad"
        @editRecord="editRecord($event)"
        @duplicateRecord="duplicateRecord($event)"
        @cancelRecord="cancelRecord($event)"
        @openRecord="openRecord($event)"
        @emitRecord="emitRecord($event)"
        @showAdvance="showAdvance"
        @emitData="emitDataTable($event)"
        @showConfirm="deleteItem($event)"
        :dataTable="dataTable"
        :tableLoading="tableLoading"
        :isAction="isAction"
        v-show="dataTable?.data?.totalCount > 0"
      >
        <slot name="customRenderList"> </slot>
      </o-grid>
    </keep-alive>
    <a-modal
      :title="title"
      v-model:visible="visible"
      centered
      :width="widthModal"
      :bodyStyle="bodyStyleModal"
      :destroyOnClose="true"
      :wrapClassName="wrapClassName"
    >
      <template #footer>
        <a-button class="btn-cancel" @click="handleCancel">
          {{ $t("common.back") }}
        </a-button>
        <a-button
          @click="handleOk"
          class="btn-submit"
          :loading="confirmLoading"
        >
          <template #icon>
            <SaveOutlined />
          </template>
          {{ $t("common.save") }}
        </a-button>
      </template>
      <keep-alive>
        <component
          :is="formComponent"
          ref="detail"
          :entity="entity"
          :formData="formData"
          :formUser="formUser"
          :show="visible"
          :fields="fields"
          :rules="rules"
          :relationModel="Models[camelCaseEntity]"
          v-if="visible"
          :handle-callback="handleCallback"
          :spin-loading="pageLoading"
          @cancelForm="handleCancel"
          @saveForm="handleOk"
          @confirmSave="confirmSave()"
          @reload="confirmReload"
          @update-form="updateForm($event)"
        ></component>
      </keep-alive>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import {
  defineAsyncComponent,
  ref,
  computed,
  watch,
  onMounted,
  useSlots,
} from "vue";

import axios from "axios";
import { generateFormData, generateFields, generateRules } from "@/formUtility";
import moment from "moment/moment";
import UserServices from "@/services/UserService";
import ColumnConfig from "@/config/columns";
import Model from "@/config/models";
import * as _ from "lodash";
import constant from "@/constant";
import {
  UndoOutlined,
  DownloadOutlined,
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
  EyeOutlined,
} from "@ant-design/icons-vue";
import BaseImport from "@/components/Excel/BaseImport.vue";
import BaseExport from "@/components/Excel/BaseExport.vue";
import { useStore } from "vuex";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import camelCase from "lodash/camelCase";
import { message, Modal } from "ant-design-vue";
import { useMutation, useQueryClient } from "vue-query";
import i18n from "@/lang";
import user from "@/store/modules/user";
const queryClient = useQueryClient();
const { t } = i18n.global;
interface Props {
  isCustomColumn: boolean;
  isViewType: boolean;
  entity: string;
  isAdd: boolean;
  isShowBack: boolean;
  isImport: boolean;
  isExport: boolean;
  isAction: boolean;
  isAutoLoad: boolean;
  isReloadGrid: boolean;
  widthModal: string;
  wrapClassName: string;
  bodyStyleModal: any;
  supportRole: any;
  resetForm: any;
  dataTable: any;
  listLoading: boolean;
  tableLoading: boolean;
  dataList: any;
  isDateList: boolean;
  disabledFitterForm: any;
}
interface Filter {
  field?: string;
  operator?: string;
  value?: string;
  value1?: string;
}
const props = withDefaults(defineProps<Props>(), {
  isCustomColumn: false,
  isViewType: false,
  entity: "",
  isAdd: true,
  isShowBack: false,
  isImport: false,
  isExport: false,
  isAction: true,
  isAutoLoad: true,
  isReloadGrid: true,
  widthModal: "",
  wrapClassName: "",
  bodyStyleModal: {},
  supportRole: [],
  resetForm: null,
  dataTable: {},
  dataList: {},
  listLoading: false,
  tableLoading: false,
  isDateList: false,
  disabledFitterForm: [],
});
const formUser = ref();
const a = () => {
  console.log(123, formUser.value);
};
watch(formUser, a);
const useSaveFormDataMutation = () => {
  return useMutation(
    (form: any) => {
     return axios.post(`${props.entity}`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    
    {
      onSuccess: async () => {
        await queryClient.removeQueries(props.entity);
      },
    }
  );
};
const useSaveFormData = useSaveFormDataMutation();
//delete item
const useDeleteItemMutation = () => {
  return useMutation((id: number) => axios.delete(`${props.entity}/${id}`), {
    onSuccess: async () => {
      await queryClient.removeQueries(props.entity);
    },
  });
};
const useDeleteItem = useDeleteItemMutation();
// delete mutiple items
const useDeleteItemsMutation = () => {
  return useMutation(
    (recordId: number[]) =>
      axios.delete(`${props.entity}/${recordId.join(",")}`),
    {
      onSuccess: async () => {
        await queryClient.removeQueries(props.entity);
      },
    }
  );
};
const useDeleteItems = useDeleteItemsMutation();
const viewTypeList = [
  {
    id: 1,
    name: "table",
    text: t("common.table_type"),
  },
  {
    id: 2,
    name: "list",
    text: t("common.list_type"),
  },
];
const viewType = ref<string>(viewTypeList[0].name);
const pageLoading = ref<boolean>(false);
const store = useStore();
const slots = useSlots();
const detail: any = ref();
const grid: any = ref();
const list: any = ref();
let camelCaseEntity: string = _.camelCase(props.entity);
let headerTitle: string = t(camelCaseEntity + ".name") || "";
const Models = ref<any>(Model);
let form: any = generateFormData(Models.value[camelCaseEntity]) || {};
const fields = generateFields(camelCaseEntity);
const rules = generateRules(camelCaseEntity);
const isCustomOption = ref<boolean>(false);
const isViewOption = ref<boolean>(false);
const dateFormat = ref<string>("DD/MM/YYYY");
const visible = ref<boolean>(false);
const handleCallback = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const formData = ref<any>(form);
const id = ref<any>(null);
const isAddButton = props.isAdd;
const title = ref<string>("");
const dateChange = ref<object>({});
const config = ref<any>(Models.value[camelCaseEntity]);
const advanceMenu = ref<any>([]);
const isShowModal = ref<boolean>(false);
const spinning = ref<boolean>(false);
const emit = defineEmits<{
  (e: "emitRecord", record: any): void;
  (e: "openRecord", record: any): any;
  (e: "cancelRecord", record: any): void;
  (e: "handleExport"): any;
  (e: "handleReloadGrid"): any;
  (e: "emitDataTable", record: any): any;
  (e: "emitDataList", record: any): any;
  (e: "recordDetail", record: any): void;
  (e: "getDateList"): any;
}>();
const userRole = user.state.loginObj.role; 
const formComponent = computed(() => {
  let instance = _.replace(_.startCase(_.camelCase(props.entity)), " ", "");
  return defineAsyncComponent(
    () => import("@/views/"+ userRole + "/" + instance + "/Form.vue")
  );
});
// let loading = computed(() => store.state[camelCase(props.entity)].loading);
// const total = computed<number>(
//   () => store.state[camelCase(props.entity)].total
// );
const service = computed(() => store.state[camelCase(props.entity)].service);
const isVisibleEmptySlot = computed(
  () => slots.empty && slots.empty().length > 0
);
const columnConfigs = computed(
  () => store.state[camelCase(props.entity)].columnConfigs
);
const defaultColumns = computed(
  () => store.getters[`${camelCase(props.entity)}/defaultColumns`]
);
const customColumnConfigs = computed(
  () => store.getters[`${camelCase(props.entity)}/customColumnConfigs`]
);
const getColumnConfig = (payload: string) => {
  return store.dispatch(camelCase(props.entity) + "/getColumnConfig", payload);
};
const saveColumnConfig = (payload: Array<object>) => {
  return store.dispatch(camelCase(props.entity) + "/saveColumnConfig", payload);
};
const resetColumnConfig = (payload: Array<object>) => {
  return store.dispatch(
    camelCase(props.entity) + "/resetColumnConfig",
    payload
  );
};
const Column = ref<any>(ColumnConfig);
let columns = Column.value[camelCaseEntity] || [];

columns = columns.map((p: any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
watch(defaultColumns, (val) => {
  if (val) {
    val?.columns?.forEach((p: any) => {
      columns.forEach((e: any) => {
        if (
          p.dataIndex == e.dataIndex &&
          (p.dataType == "list" || p.dataType == "bool")
        ) {
          p.dataSource = e.dataSource;
        }
      });
    });
  }
});
onMounted(() => {
  getColumnConfig(props.entity);
  let view = localStorage.getItem(`${props.entity}-view`);
  if (view != null) {
    viewType.value = view;
  }
});
const handleChangeVisible = (column: any) => {
  if (column.is_checked == 1) {
    column.is_checked = 0;
  } else {
    column.is_checked = 1;
  }
};
const role = ref();
const emitDataTable = (params: any) => {
  emit("emitDataTable", params);
  role.value = params; 
};
const emitDataList = (params: any) => {
  emit("emitDataList", params);
};
const changeViewType = (name: string) => {
  viewType.value = name;
  localStorage.setItem(`${props.entity}-view`, name);
};
const apply = () => {
  customColumnConfigs.value.forEach(function (element: any) {
    element.visible = element.is_checked;
  });
  let payload: any = { column_configs: customColumnConfigs.value };
  localStorage.setItem(
    `column-${props.entity}`,
    JSON.stringify(customColumnConfigs.value)
  );
  saveColumnConfig(payload);
  isCustomOption.value = false;
};
const reset = () => {
  let payload: any = { entity: props.entity };
  resetColumnConfig(payload);

  isCustomOption.value = false;
};
const reloadGrid = () => {
  if (!props.isReloadGrid) {
    emit("handleReloadGrid");
    return;
  }
  reload();
};
const reload = (filter?: Filter) => {
  if (grid.value) {
    grid.value.reload(filter);
  }
  if (list.value) {
    list.value.reload(filter);
  }
};
const confirmReload = () => {
  visible.value = false;
  handleCallback.value = false;
  confirmLoading.value = false;
  pageLoading.value = false;
  reload();
};
const showModal = () => {
  visible.value = true;
};
const handleAdd = () => {
  id.value = null;
  if (detail.value) {
    detail.value.ruleForm.resetFields();
  }
  formData.value = generateFormData(config.value);
  formData.value["mode"] = "add";
  title.value = t("common.add") + " " + t(camelCaseEntity + ".name") || "";
  if (detail.value) {
    detail.value.form = formData.value;
  }
  if (detail.value && detail.value.relationForm) {
    for (let prop in detail.value.relationForm) {
      detail.value.relationForm[prop] = [];
    }
  }
  visible.value = true;
};
const handleOk = (e?: any) => {
  e?.preventDefault();
  handleCallback.value = false;
  detail.value?.ruleForm.validate().then(() => {
    pageLoading.value = true;
    confirmLoading.value = true;
    let forms = convertFormData();
    try {
      if (detail.value?.isCallBack) {
        isShowModal.value = true;
        confirmLoading.value = true;
        handleCallback.value = true;
        formData.value = forms;
      } else {
        saveFormData(forms);
      }
    } catch (err: any) {
      console.error(err);
      message.error(err);
    }
  });
};
const convertFormData = (callback?: any) => {
  
  let form = JSON.parse(JSON.stringify(detail.value?.form)); 
  if (id.value) {
    form.id = id.value;
  }
  if(props.entity == 'user') {
  form.entity_id = user.state.loginObj.entity_id;
  }
  for (let prop in form) {
    for (let propConfig in config.value) {
      if (config.value[propConfig].relation == prop) {
        form[prop + "_id"] = form[prop]["key"];
        delete form[prop];
      }
      if (config.value[propConfig].relationDefault == prop) {
        form[prop + "_id"] = form[prop]["key"];
        delete form[prop];
      }
      if (config.value[propConfig].relationMultiple == prop) {
        form[prop + "_ids"] = form[prop].map((item: any) => ({
          [prop + "_id"]: item.value,
          ["name_of " + prop + "_id"]:
            typeof item.label == "string" ? item.label : item.label.children,
        }));
        delete form[prop];
        form[prop] = role.value.filters[0].value;
      }
    }
    if (config.value[prop] && config.value[prop].dataType) {
      if (config.value[prop].dataType == "time") {
        form[prop] = moment(form[prop]).format("H:mm:ss");
      }
    }
    if (config.value[prop] && config.value[prop].dataType) {
      if (config.value[prop].dataType == "dateTime") {
        form[prop] = moment(form[prop]).utcOffset("GMT+07:00").format();
      }
    }
  }
  if (detail.value?.relationForm) {
    for (let prop in detail.value?.relationForm) {
      form[prop] = JSON.parse(JSON.stringify(detail.value?.relationForm[prop]));
    }
  }
  if (callback) {
    form = callback(form);
  }
  return form;
};
const openCustomColumns = () => {
  isCustomOption.value = !isCustomOption.value;
};
const hideCustomColumns = () => {
  isCustomOption.value = false;
};
const updateForm = ($event: any) => {
  if (!detail?.value.form) return;
  try {
    let form = convertFormData($event.value);
    saveFormData(form);
  } catch (err: any) {
    message.error(err);
  }
};
const deleteItem = (record: any) => {
  Modal.confirm({
    title: "Bạn chắc chắn muốn xoá bản ghi " + record.code + "?",
    content: "",
    okText: "Xác nhận",
    cancelText: "Huỷ",
    onOk() {
      useDeleteItem
        .mutateAsync(record.id)
        .then((response) => {
          if (response.data.errorCode == 0) {
            message.success(`Xoá ${title.value} thành công`);
            if (list.value) {
              list.value.reload();
            }
            if (grid.value) {
              grid.value.reload();
            }
          } else {
            message.error(response.data.errorMessage);
          }
        })
        .catch((error) => {
          message.error(error.message);
        });
    },
    onCancel() {},
  });
};
const saveFormData = (form: any) => {
  useSaveFormData
    .mutateAsync(form)
    .then((response) => {
      confirmLoading.value = false;
      isShowModal.value = false;
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage
              .map((p: any) => p.errorMessage)
              .join("\n")
          );
        } else {
          message.error(response.data.errorMessage);
        }
        pageLoading.value = false;
        return false;
      }
      visible.value = false;
      pageLoading.value = false;

      message.success(
        t("common.save_success", {
          entity: t(`${camelCaseEntity}.name`),
        })
      );

      if (grid.value) {
        console.log("create grid");
        grid.value.reload();
      }
      if (list.value) {
        list.value.reload();
      }
    })
    .catch((error) => {
      console.error(error);
      confirmLoading.value = false;
      message.error(error.message);
    });
};
const handleExport = () => {
  emit("handleExport");
};
const handleCancel = (e: any) => {
  visible.value = false;
  isShowModal.value = false;
  pageLoading.value = false;
};
const openRecord = (record: any) => {
  emit("openRecord", record.id);
};
const recordDetail = (record: number) => {
  emit("recordDetail", record);
};
const emitRecord = (record: any) => {
  emit("emitRecord", record);
};
const showAdvance = (record: any) => {
  advanceMenu.value = record;
};
const getDateList = () => {
  emit("getDateList");
};
const editRecord = (record: any, callback?: any) => {
  id.value = record.id;
  pageLoading.value = true;
  handleCallback.value = false;
  title.value = t("common.edit") + " " + t(camelCaseEntity + ".name") || "";
  if (detail.value) {
    detail.value?.ruleForm.resetFields();
  }
  service.value
    .detail(record.id)
    .then((response: any) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage
              .map((p: any) => p.errorMessage)
              .join("\n")
          );
        } else {
          message.warning(response.data.errorMessage);
        }
        return;
      }
      let data = response.data.data;
      formData.value = generateFormData(config.value);
      for (let prop in config.value) {
        formData.value[prop] = data[prop];
        let configs = config.value[prop];
        if (configs.relation) {
          formData.value[configs.relation] = {
            value: data[configs.relation + "_id"] || "",
            label: data["name_of_" + configs.relation + "_id"] || "",
          };
        }
        if (configs.relationDefault) {
          formData.value[configs.relationDefault] = {
            key: data[configs.relationDefault + "_id"] || "",
            value: data["name_of_" + configs.relationDefault + "_id"] || "",
          };
        }
        if (configs.relationMultiple) {
          formData.value[configs.relationMultiple] = data[prop].map(
            (item: any) => ({
              // key: item[config.relationMultiple + "_id"] || "",
              value: item[configs.relationMultiple + "_id"] || "",
              label: item["name_of_" + configs.relationMultiple + "_id"] || "",
            })
          );
        }

        if (configs.dataType) {
          if (configs.dataType == "date") {
            formData.value[prop] = moment.utc(data[prop], "YYYY-MM-DD");
          }
          if (configs.dataType == "time") {
            formData.value[prop] = moment.utc(data[prop], "H:mm:ss");
          }

          if (configs.dataType == "array") {
            if (configs.dataRelation) {
              configs.dataRelation.map((p: any) => {
                data[prop].map((t: any) => {
                  let item = t;
                  item[p] = {
                    key: item[p + "_id"],
                    label: item["name_of_" + p + "_id"],
                  };
                });
              });
            }
            if (configs.fields) {
              Object.keys(configs.fields).map((i) => {
                for (let j = 0; j < data[prop].length; j++) {
                  let item = data[prop][j];
                  if (configs.fields[i].dataType == "bool") {
                    if (item[i] == 1) {
                      item[i] = true;
                    } else {
                      item[i] = false;
                    }
                  }
                }
              });
            }
          }
          if (configs.dataType == "object") {
            Object.values(configs.objectRelation).map((p: any) => {
              formData.value[prop][p] = {
                value: data[prop][p + "_id"] || "",
                label: data[prop]["name_of_" + p + "_id"] || "",
              };
            });
          }
        }
      }
      formData.value["mode"] = "edit";
      if (detail.value) {
        detail.value.form = formData.value;
      }
      if (detail.value && detail.value?.relationForm) {
        for (let prop in detail.value.relationForm) {
          detail.value.relationForm[prop] = JSON.parse(
            JSON.stringify(formData.value[prop])
          );
        }
      }
      if (callback) {
        callback();
      }
      visible.value = true;
      pageLoading.value = false;

      // this.$emit("editRecord", this.formData);
    })
    .catch((error: any) => {
      pageLoading.value = false;
      message.error(error.message);
    });
};
const duplicateRecord = ($event: any) => {
  editRecord($event, function () {
    formData.value["id"] = null;
    formData.value["code"] = "";
    // if (props.resetForm) {
    // resetForm($event);
    // }
    id.value = null;
    formData.value["mode"] = "duplicate";
    // console.log(formData)
  });
};
const handleMassDelete = () => {
  let recordId: number[] = advanceMenu.value;
  let data = [];
  if (viewType.value == "table") {
    data = grid?.value.data;
  } else if (viewType.value == "list") {
    data = list?.value.data;
  }
  let recordCode = ref<Array<any>>([]);
  let code: string = "code";
  let entity: string = props.entity;
  let count: number = 0;

  // if (Object.keys(constant.entityFieldCode).includes(entity)) {
  //   code = constant.entityFieldCode[entity];
  // }

  data?.forEach((record?: any) => {
    if (recordId.includes(record.id)) {
      recordCode.value.length < 3
        ? recordCode.value.push(record[code])
        : count++;
    }
  });

  if (recordCode.value.length >= 2 && count > 0) {
    recordCode.value.push(`và ${count} ${title.value} còn lại`);
  }

  Modal.confirm({
    title: `Bạn chắc chắn muốn xoá ${title.value} ${recordCode.value.join(
      ", "
    )} ?`,
    content: "",
    okText: "Xác nhận",
    cancelText: "Huỷ",
    onOk() {
      useDeleteItems
        .mutateAsync(recordId)
        .then((response) => {
          if (response.data.errorCode == 0) {
            message.success(`Xoá ${title.value} thành công`);
            reload();
            advanceMenu.value = [];
            if (grid.value) {
              grid.value.reload();
            }
            if (list.value) {
              list.value.reload();
            }
          } else {
            message.error(response.data.errorMessage);
          }
        })
        .catch((error) => {
          console.error(error);
          message.error(error.message);
        });
    },
    onCancel() {},
  });
};
const confirmSave = () => {
  handleCallback.value = false;
  pageLoading.value = false;
};
const cancelRecord = (record: any) => {
  emit("cancelRecord", record);
};
const uploadCompleted = () => {
  reloadGrid();
};
defineExpose({
  reload,
});
</script>
<style lang="scss" scoped>
.indicator {
  position: absolute;
  z-index: 999;
  background: #c9b8b824;
  height: 100vh;
  width: 100vw;
  text-align: center;
  :deep() .ant-spin {
    top: 35%;
    position: absolute;
  }
}
.btn-submit {
  background: #00885a;
  border-color: #00885a;
  width: 120px;
  color: #fff;
}
.btn-cancel {
  border: unset;
}
.ant-checkbox-wrapper {
  width: 100%;
  :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: #00885a;
    border-color: #00885a;
  }
  :deep(.ant-checkbox-inner) {
    border-color: #00885a;
  }
}
.button-custom {
  .ant-btn,
  .ant-btn-primary {
    width: 100%;
  }
  .ant-btn-primary {
    background: #00885a;
    border-color: #00885a;
  }
}
</style>