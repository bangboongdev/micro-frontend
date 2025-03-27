<template>
  <a-modal
    :title="title"
    v-model:visible="visible"
    centered
    okText="LƯU"
    :ok-button-props="{
      style: {
        background: '#00885a',
        borderColor: '#00885a',
        width: '120px',
      },
    }"
    cancelText="HỦY"
    :cancel-button-props="{
      style: { border: 'none' },
    }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="ruleForm"
      :rules="rules"
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      :layout="layout"
    >
      <a-form-item
        :label="$t('lot.attribute.code')"
        name="code"
        :wrapper-col="{ span: 16 }"
      >
        <a-input
          :disabled="true"
          v-model:value="formData.code"
          :placeholder="$t('lot.attribute.code')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lot.attribute.manufactured_date')"
        name="manufactured_date"
        :wrapper-col="{ span: 16 }"
      >
        <a-date-picker
          :disabled="true"
          v-model:value="formData.manufactured_date"
          :locale="locale"
          type="date"
          format="DD-MM-YYYY"
          :placeholder="$t('lot.attribute.manufactured_date')"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lot.attribute.expired_date')"
        name="expired_date"
        :wrapper-col="{ span: 16 }"
      >
        <a-date-picker
          :disabled="true"
          v-model:value="formData.expired_date"
          :locale="locale"
          type="date"
          format="DD-MM-YYYY"
          :placeholder="$t('lot.attribute.expired_date')"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :label="$t('lot.attribute.quantity')"
        name="quantity"
        :wrapper-col="{ span: 16 }"
      >
        <a-input-number
          v-model:value="formData.quantity"
          :placeholder="$t('lot.attribute.quantity')"
          style="width: 100%"
          :defaultValue="0"
          :formatter="
            (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/(,*)/g, '')"
        />
      </a-form-item>
      <a-row>
        <a-col span="2"></a-col>
        <a-col span="20">
          <span class="flex-item">
            <template v-for="(tag, index) in formData.serial" :key="index">
              <a-tag
                color="blue"
                @close="
                  handleClose(formData, 'serial', index, tag, formData.serial)
                "
                closable
                class="mode-tags"
                >{{ tag.serial_number }}</a-tag
              >
            </template>
          </span>
          <a-input
            class="text-note text-border"
            v-model:value="formData.serialItem"
            @pressEnter="saveSerial($event, 'serial', formData)"
            :placeholder="$t('common.enter_serial')"
            v-show="formData.is_serial == 1"
          />
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import moment from "moment/moment";

export default {
  data() {
    const rules = {
      quantity: [
        {
          required: true,
          message: "Vui lòng nhập số lượng",
          type: "number",
        },
      ],
    };

    return {
      rules,
      moment,
      value: "",
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formData: {
      type: Object,
      default: {},
    },
    title: String,
  },
  mounted() {},
  methods: {
    handleOk(e) {
      e.preventDefault();
      this.$refs.ruleForm.validate().then(() => {
        let form = JSON.parse(JSON.stringify(this.formData));
        if (form.mode == "edit") {
          this.$emit("changeSerialLot", form);
        } else {
          this.$emit("selectData", form);
        }
      });
    },
    saveSerial($event, dataIndex, form) {
      form[dataIndex].push({ serial_number: form.serialItem });
      form.serialItem = "";
      form.quantity = form[dataIndex].length;
    },
    handleClose(form, dataIndex, index, tag, serial) {
      if (form.is_serial == 1 && form.is_lot == 1) {
        serial = serial.filter((item,indexItem) => indexItem != index);
        this.formData.serial =serial;
        form.quantity = serial.length;
      } else {
        tag.del_flag = 1;
        form.quantity = serial.filter((item) => item.del_flag != 1).length;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.flex-item {
  display: flex;
  margin-bottom: 8px;
}
</style>
