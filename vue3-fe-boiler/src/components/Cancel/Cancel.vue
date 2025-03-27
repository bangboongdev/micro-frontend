<template>
  <a-modal
    v-model:visible="visibleCancel"
    :title="$t('purchaseOrder.cancel.title')"
    :destroyOnClose="true"
    :closable="true"
    cancel-text="TRỞ LẠI"
    :ok-text="$t('purchaseOrder.cancel.cancel')"
    centered
    :width="'60%'"
    :bodyStyle="{
      overflowY: 'auto',
      overflowX: 'hidden',
    }"
    :ok-button-props="{
      style: {
        background: '#00885a',
        borderColor: '#00885a',
        width: '120px',
      },
    }"
    @cancel="handleClose"
    @ok="handleOk"
  >
    <span
      >{{ $t("purchaseOrder.cancel.question") }}
      <strong>{{ `${dataCancel.code}` }} </strong>
    </span>

    <div class="clearfix">
      <a-upload
        list-type="picture-card"
        :multiple="true"
        :customRequest="customRequest"
        :before-upload="beforeUpload"
        @change="handleChange"
        @preview="handlePreview"
        v-model:file-list="fileList"
      >
        <div>
          <plus-outlined />
          <div class="ant-upload-text">{{ $t('common.upload_img') }}</div>
        </div>
      </a-upload>
      <a-modal
        v-model:visible="previewVisible"
        :footer="null"
        @cancel="handleCancelPreview"
      >
        <a-image alt="picture" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
    <a-textarea
      v-model:value="dataCancel.cancel_note"
      placeholder="Nội dung"
      :rows="3"
      style="margin-top: 10px"
    />
  </a-modal>
</template>
<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import FileService from "@/services/FileService";
import PurchaseOrderService from "@/services/PurchaseOrderService";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default {
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewImage:""
    };
  },
  props: {
    visibleCancel: {
      type: Boolean,
      default: false,
    },
    dataCancel: {},
  },
  components: {
    PlusOutlined,
  },
  methods: {
    handleChange(info) {
      const status = info.file.status;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleCancelPreview() {
      this.previewVisible = false;
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error(this.$t("permission.file"));
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error(this.$t("permission.memory_file"));
      }
      return isJpgOrPng && isLt5M;
    },
    customRequest(options) {
      const { onSuccess, onError, file } = options;
      FileService.uploadImg(file)
        .then((response) => {
          onSuccess(response.data.data.file_id);
        })
        .catch((err) => {
          onError(err);
        });
    },
    handleClose() {
      this.$emit("handleClose");
    },
    handleOk() {
      let form = this.dataCancel;
      form.fileList = this.fileList.map((p) => p.response);
      PurchaseOrderService.cancel(form)
        .then((response) => {
          if (response.data.errorCode != 0) {
            if (Array.isArray(response.data.errorMessage)) {
              this.$message.error(
                response.data.errorMessage.map((p) => p.errorMessage).join("\n")
              );
            } else {
              this.$message.warning(response.data.errorMessage);
            }
            return;
          }
          this.$message.success(
            this.$t("purchaseOrder.cancel.success")
          );
          this.handleClose();
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error.message);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.clearfix {
  padding: 10px 0;
}
</style>