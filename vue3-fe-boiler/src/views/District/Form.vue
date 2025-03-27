<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
  >
     <a-form-item :label="fields.title.label" name="title">
      <a-input
        v-model:value="form.title"
        :placeholder="fields.title.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.type.label" name="type">
      <a-input
        v-model:value="form.type"
        :placeholder="fields.type.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.province_id.label" name="province_id">
      <a-input
        v-model:value="form.province_id"
        :placeholder="fields.province_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.district_id.label" name="district_id">
      <a-input
        v-model:value="form.district_id"
        :placeholder="fields.district_id.placeholder"
      />
  </a-form-item>

  <a-form-item :label="fields.location.label" name="location">
      <a-input
        v-model:value="form.location"
        :placeholder="fields.location.placeholder"
      />
  </a-form-item>


  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { ref } from "vue";
interface Props {
  formData: any;
  width: string;
  rules: any;
  fields: any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  width: "",
  rules: {},
  fields: {},
});
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 6 });
const wrapperCol = ref<{ span: number }>({ span: 16 });
const layout = ref<string>("horizontal");
const form = ref<any>(props.formData);
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);

const handleChangeActive = ($event?:any) => {
  if (!$event.value) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};
defineExpose({ruleForm,form})
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}
</style>