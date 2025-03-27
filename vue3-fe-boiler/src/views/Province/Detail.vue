<template>
  <a-row>
    <a-col :span="24">
      <a-card
        :bordered="false"
        class="card-border"
        :title="$t('province.title.general_information')"
      >
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24">
            <a-row :gutter="[0, 24]">
              <a-col :span="24" v-for="(item, key) in form" :key="key">
                <a-row v-if="key !== 'id' && key !== 'del_flag'">
                  <a-col :span="4"
                    ><span>{{ fields[key].label }}</span></a-col
                  >
                  <a-col :span="1">:</a-col>
                  <a-col :span="10"
                    ><strong>{{ form[key] }}</strong></a-col
                  >
                </a-row>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { generateFields } from "@/formUtility";
import { getImage } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "province";
interface Props {
  isShowModal: boolean;
  isAutoLoad: boolean;
  isAdd: boolean;
  isAction: boolean;
  form: any;
}
const props = withDefaults(defineProps<Props>(), {
  isShowModal: false,
  isAutoLoad: false,
  isAdd: false,
  isAction: false,
  form: {},
});
const { isShowModal } = toRefs(props);
const emit = defineEmits<{
  (e: "hideModal"): void;
}>();
let camelCaseEntity = ref<any>(_.camelCase(entity));
const fields = ref<any>(generateFields(camelCaseEntity.value));
const ColumnConfigs = ref<any>(ColumnConfig);
let columns = ref<any>(ColumnConfigs[camelCaseEntity] || []);
columns = columns.value.map((p?:any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
const loading = ref<boolean>(false);
const grid:any = ref();
const hideModal = () => {
  emit("hideModal");
};
</script>

<style scoped lang="scss">
.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}
.card-border {
  border-radius: 4px;
  margin-bottom: 16px;
}
:deep() .ant-form-item-label > label {
  color: #747c87 !important;
}
:deep(.ant-tabs-bar) {
  margin: 0;
  background-color: white;
}
:deep(.ant-btn-primary) {
  background-color: #00885a !important;
  border-color: #00885a !important;
}
</style>
<style>
.ant-btn-primary {
  background-color: #00885a;
  border-color: #00885a;
}
</style>