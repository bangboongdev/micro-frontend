<template>
  <a-button
    :type="typeButton"
    @click="showModal"
    v-permission:import="entity.replaceAll('-', '_')"
  >
    <!-- <template #icon><CloudUploadOutlined /></template> -->
    {{ $t("common.excel.import") }}
  </a-button>
  <a-modal
    v-model:visible="visible"
    width="1000px"
    :title="$t('common.import.input_excel')"
    @ok="handleOk"
  >
    <template #footer>
      <a-button
        v-if="current !== 2"
        type="default"
        key="back"
        @click="handleCancel"
        >{{ $t("common.close") }}</a-button
      >
      <a-button
        type="default"
        v-if="current == 1"
        key="prev"
        @click="handlePrev"
        >{{ $t("common.back") }}</a-button
      >
      <a-button
        v-if="current == 2"
        key="complete"
        type="primary"
        @click="handleComplete"
        >{{ $t("common.complete") }}</a-button
      >
      <a-button
        v-if="current == 0"
        type="primary"
        :disabled="fileList.length === 0"
        :loading="importLoading"
        style="margin-top: 16px"
        @click="handleUpload"
      >
        {{ $t("common.next") }}<ArrowRightOutlined />
      </a-button>
      <a-button
        type="primary"
        v-if="current == 1"
        :loading="importLoading"
        :disabled="validImportTotal === 0"
        @click="handleImport"
      >
        {{ $t("common.next") }}<ArrowRightOutlined />
      </a-button>
    </template>
    <a-row>
      <a-col :span="24">
        <a-steps :current="current">
          <a-step v-for="step in steps" :key="step.index">
            <template #icon>
              <div class="icon">
                <component :is="step.icon" />
              </div>
              <p>{{ step.description }}</p>
            </template>
          </a-step>
        </a-steps>
      </a-col>
    </a-row>
    <div v-if="current == 0">
      <h3></h3>
      <a-radio-group v-model:value="uploadType">
        <a-radio :value="'create'">{{
          $t("common.import.create_file")
        }}</a-radio>
        <a-radio :value="'update'">{{
          $t("common.import.update_file")
        }}</a-radio>
      </a-radio-group>
      <a-row>
        <a-col :span="24">
          <div class="upload-content">
            <a-upload-dragger
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
            >
              <p class="ant-upload-drag-icon">
                <!-- <CloudUploadOutlined /> -->
              </p>
              <p class="ant-upload-text">
                <a href="#">{{ $t("common.import.select_file") }}</a>
                {{ $t("common.import.or_dragger") }}
              </p>
            </a-upload-dragger>
          </div>
        </a-col>
      </a-row>
      <p>
        {{ $t("common.import.download_excel") }}
        <span
          ><a href="#" @click="handleExportTemplateFile">{{
            $t("common.import.here")
          }}</a></span
        >
      </p>
    </div>
    <div v-if="current == 1">
      <p class="overview">
        <a-space :size="16">
          <span
            >{{ $t("common.import.total_rows") }}:
            <strong> {{ importTotal }}</strong></span
          >
          <span
            >{{ $t("common.import.valid_total_rows") }}:
            <strong style="color: green"> {{ validImportTotal }}</strong></span
          >
          <span
            >{{ $t("common.import.invalid_total_rows") }}:
            <strong style="color: red">{{ invalidImportTotal }}</strong></span
          >
        </a-space>
      </p>
      <div class="excel_table">
        <a-row>
          <div class="table_title">
            <p class="error_title">{{ $t("common.import.row_index") }}</p>
            <p v-for="column in importObject.header" :key="column.index">
              {{ column.column_name }}
            </p>
          </div>
          <div
            class="table_content"
            v-for="(item, index) in importObject.data"
            :key="index"
          >
            <div class="column_detail error_column">
              <div
                :class="[
                  item.failures !== undefined &&
                  item.failures !== null &&
                  item.failures &&
                  item.failures.length > 0
                    ? 'row_error'
                    : '',
                ]"
              >
                {{ item.row_index }}<br />
                <div
                  v-html="[item.failures ? item.failures.join('<br />') : '']"
                ></div>
              </div>
            </div>
            <template
              v-for="(column, key) in importObject.header"
              :key="column.index"
            >
              <div :class="wrapClass(column.data_type) + ' column_detail'">
                {{ item[key] }}
              </div>
            </template>
          </div>
        </a-row>
      </div>
    </div>
    <div v-if="current == 2">
      <div class="complete">
        <CheckCircleFilled />
        <p>{{ $t("common.import.upload_done") }}</p>
        <p>
          {{ $t("common.import.import_done") }} {{ validImportTotal }}/{{
            importTotal
          }}
          {{ $t("common.record") }}
        </p>
      </div>
    </div>
  </a-modal>
</template>
<script>
import {
  // CloudUploadOutlined,
  InboxOutlined,
  QuestionCircleOutlined,
  ArrowRightOutlined,
  EditOutlined,
  CheckOutlined,
  CheckCircleFilled,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { defineComponent, ref } from "vue";
import camelCase from "lodash/camelCase";
import { mapState, mapGetters, mapActions } from "vuex";
import i18n from "@/lang";
import FileSaver from "file-saver";

const { t } = i18n.global;

export default defineComponent({
  setup(props, context) {
    const fileList = ref([]);
    const handleRemove = (file) => {
      const index = fileList.value.indexOf(file);
      const newFileList = fileList.value.slice();
      newFileList.splice(index, 1);
      fileList.value = newFileList;
    };

    const beforeUpload = (file) => {
      fileList.value = [...fileList.value, file].slice(-1);
      return false;
    };

    const uploadType = ref("create");
    const visible = ref(false);
    const current = ref(0);

    const showModal = () => {
      visible.value = true;
    };

    const handleOk = (e) => {
      console.log(e);
      visible.value = false;
    };
    const handlePrev = () => {
      current.value--;
    };
    const handleComplete = () => {
      visible.value = false;
      current.value = 0;
      context.emit("uploadCompleted");
    };
    const handleCancel = () => {
      visible.value = false;
      current.value = 0;
    };
    const steps = [
      {
        icon: "CloudUploadOutlined",
        description: t("common.import.upload_file"),
      },
      {
        icon: "EditOutlined",
        description: t("common.import.check_data"),
      },
      {
        icon: "CheckOutlined",
        description: t("common.import.done"),
      },
    ];
    return {
      steps,
      current,
      visible,
      showModal,
      handleOk,
      handlePrev,
      handleCancel,
      handleComplete,
      handleRemove,
      beforeUpload,
      uploadType,
      fileList,
      ignored_columns: ["row_index", "failures", "importable"],
    };
  },
  components: {
    // CloudUploadOutlined,
    InboxOutlined,
    QuestionCircleOutlined,
    ArrowRightOutlined,
    EditOutlined,
    CheckOutlined,
    CheckCircleFilled,
  },
  props: {
    entity: String,
    typeButton: {
      type: String,
      default: "default",
    },
  },
  emits: ["uploadCompleted"],
  computed: {
    ...mapState({
      importLoading(state, getters) {
        return state[camelCase(this.entity)].importLoading;
      },
      importObject(state, getters) {
        return state[camelCase(this.entity)].importObject;
      },
    }),
    importTotal() {
      return this.$store.getters[`${camelCase(this.entity)}/importTotal`];
    },
    validImportTotal() {
      return this.$store.getters[`${camelCase(this.entity)}/validImportTotal`];
    },
    invalidImportTotal() {
      return this.$store.getters[
        `${camelCase(this.entity)}/invalidImportTotal`
      ];
    },
    wrapClass() {
      return (data_type) => {
        let wrapClass = "text-left";
        switch (data_type) {
          case "number":
            wrapClass = "text-right";
            break;
          case "date":
          case "datetime":
          case "time":
            wrapClass = "text-center";
            break;
          default:
            wrapClass = "text-left";
            break;
        }
        return wrapClass;
      };
    },
  },
  methods: {
    ...mapActions({
      validateImport(dispatch, payload) {
        return dispatch(camelCase(this.entity) + "/validateImport", payload);
      },
      import(dispatch, payload) {
        return dispatch(camelCase(this.entity) + "/import", payload);
      },
      export(dispatch, payload) {
        dispatch(camelCase(this.entity) + "/export", payload).then(
          (response) => {
            let fileName = `Danh_sach_${payload.title}.xlsx`;
            FileSaver.saveAs(new Blob([response.data]), fileName);
          }
        );
      },
    }),
    handleUpload() {
      const payload = {
        file: this.fileList[0],
        action: this.uploadType,
      };
      this.validateImport(payload)
        .then((response) => {
          this.current++;
          this.fileList = [];
        })
        .catch(() => {
          message.error(this.$t("common.import.upload_error"));
        });
    },
    handleImport() {
      const data = this.importObject.data;
      const items = data.filter((p) => p.importable);
      const payload = {
        file_id: this.importObject.file_id,
        action: this.uploadType,
        total: this.validImportTotal,
        items,
      };
      this.import(payload)
        .then((response) => {
          this.current++;
        })
        .catch(() => {
          message.error(this.$t("common.import.import_error"));
        });
    },
    /**
     * Tải về file mẫu
     */
    handleExportTemplateFile() {
      let payload = {
        action: "create",
        title: this.$t(camelCase(this.entity) + ".name"),
      };
      this.export(payload);
    },
  },
});
</script>
<style lang="scss" scoped>
$green: green;
.ant-steps {
  .ant-steps-item {
    margin: 0;
    padding: 8px;

    :deep(.ant-steps-item-icon) {
      position: relative;
      bottom: 8px;
      p {
        font-size: small;
      }
      .icon {
        border: 1px solid;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin: auto;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
.ant-steps-item-process {
  :deep(.ant-steps-item-icon) {
    p {
      color: $green;
    }
  }
  .icon {
    background: $green;
    color: white;
  }
}
.ant-steps-item-finish {
  :deep(.ant-steps-item-icon) {
    p {
      color: $green;
    }
  }
  .icon {
    background: $green;
    color: white;
  }
}
.ant-steps-item-finish {
  :deep(.ant-steps-item-title::after) {
    background-color: $green !important;
    color: $green;
  }
}
.ant-radio-wrapper {
  :deep(.ant-radio-inner:hover) {
    border-color: $green;
  }
}
.ant-radio-wrapper-checked {
  :deep(.ant-radio-inner) {
    border-color: $green;
  }
  :deep(.ant-radio-inner::after) {
    background-color: $green;
  }
}
.upload-content {
  margin: 24px 0px;
  :deep(.ant-upload-drag:hover) {
    border-color: $green;
  }
  .anticon {
    color: $green !important;
  }
}
.excel_table {
  overflow: auto;
  height: 40vh;
  border: 1px solid #f0f0f0;
  .table_title {
    display: flex;
    position: sticky;
    top: 0px;
    background: #fafafa;
    z-index: 1;
    p {
      width: 240px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0px;
      padding: 24px 0px;
      font-size: 16px;
      font-weight: 600;
      border-right: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  .table_content {
    display: flex;
    .column_detail {
      width: 240px;
      border-bottom: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;
      padding: 8px;
      .row_error {
        color: red;
      }
    }
  }
  .table_content:hover {
    background: #b0e0e6;
  }
  .error_column {
    position: sticky;
    left: 0px;
    background: white;
  }
  .error_title {
    position: sticky;
    left: 0px;
    background: #fafafa;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
}
a {
  color: $green;
}
.ant-btn-primary {
  color: #fff;
  background-color: $green;
  border-color: $green;
}
.ant-btn-primary[disabled] {
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  text-shadow: none;
  box-shadow: none;
}
.ant-btn-default:hover {
  border-color: $green;
  color: $green;
}
.ant-btn-default {
  color: rgb(0, 136, 90);
  border-color: rgb(0, 136, 90);
}
.ant-btn-default:hover {
  border-color: $green;
  color: $green;
}
.complete {
  margin: 24px 0px;
  color: $green;
  text-align: center;
  .anticon {
    font-size: 40px;
  }
}
.ant-btn-text {
  color: rgb(0, 136, 90);
  border-color: white;
  padding: 0;
  .anticon {
    font-size: 20px;
  }
}
</style>

