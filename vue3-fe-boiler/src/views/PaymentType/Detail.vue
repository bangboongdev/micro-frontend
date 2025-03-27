<template>
  <a-row justify="center">
    <a-col :span="20">
      <a-row type="flex" :gutter="[24, 0]">
        <a-col :span="18">
          <a-card
            hoverable
            :bordered="false"
            class="card-border"
            :title="$t('utility.title.general_information')"
          >
            <a-row :gutter="[0, 24]">
              <a-col :span="24">
                <a-row>
                  <a-col :span="4">
                    <span>{{ fields.code.label }}</span>
                  </a-col>
                  <a-col :span="1">:</a-col>
                  <a-col :span="10">{{ form.code }}</a-col>
                </a-row>
              </a-col>

              <a-col :span="24">
                <a-row>
                  <a-col :span="4">
                    <span>{{ fields.name.label }}</span>
                  </a-col>
                  <a-col :span="1">:</a-col>
                  <a-col :span="10">{{ form.name }}</a-col>
                </a-row>
              </a-col>

              <a-col :span="24">
                <a-row>
                  <a-col :span="4">
                    <span>{{ fields.description.label }}</span>
                  </a-col>
                  <a-col :span="1">:</a-col>
                  <a-col :span="10">{{ form.description }}</a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>

          <a-card
            hoverable
            :bordered="false"
            class="card-border"
            :title="$t('utility.title.system_information')"
          >
            <a-row :gutter="[0, 24]">
              <a-col :span="24">
                <a-row>
                  <a-col :span="4">
                    <span>{{ fields.ins_id.label }}</span>
                  </a-col>
                  <a-col :span="1">:</a-col>
                  <a-col :span="10">{{ form.name_of_ins_id }}</a-col>
                </a-row>
              </a-col>
              <a-col :span="24">
                <a-row>
                  <a-col :span="4">
                    <span>{{ fields.ins_date.label }}</span>
                  </a-col>
                  <a-col :span="1">:</a-col>
                  <a-col :span="10">
                    <span>
                      {{
                        form.ins_date
                          ? moment(form.ins_date).format("DD/MM/YYYY HH:mm")
                          : "--"
                      }}
                    </span>
                  </a-col>
                </a-row>
              </a-col>

              <a-col :span="24">
                <a-row>
                  <a-col :span="4">
                    <span>{{ fields.upd_id.label }}</span>
                  </a-col>
                  <a-col :span="1">:</a-col>
                  <a-col :span="10">{{ form.name_of_upd_id }}</a-col>
                </a-row>
              </a-col>

              <a-col :span="24">
                <a-row>
                  <a-col :span="4">
                    <span>{{ fields.upd_date.label }}</span>
                  </a-col>
                  <a-col :span="1">:</a-col>
                  <a-col :span="10">
                    <span>
                      {{
                        form.upd_date
                          ? moment(form.upd_date).format("DD/MM/YYYY HH:mm")
                          : "--"
                      }}
                    </span>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card
            hoverable
            :bordered="false"
            class="card-border"
            :title="$t('utility.attribute.avatar_id')"
          >
            <a-row justify="center">
              <img
                :src="getImage(form.avatar_id)"
                alt="avatar"
                class="avatarDetail"
              />
            </a-row>
          </a-card>
          <a-card
            hoverable
            :bordered="false"
            class="card-border"
            :title="$t('utility.attribute.is_active')"
          >
            <a-row justify="space-between">
              <a-col>
                <span>
                  {{
                    form.is_active == 2 ? `Đang hoạt động` : `Ngừng hoạt động`
                  }}
                </span>
              </a-col>
              <a-col>
                <a-switch
                  :checked="form.is_active == 2 ? true : false"
                  @change="handleChangeActive"
                />
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import moment from "moment";
import { generateFields } from "@/formUtility";
import { getImage } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "payment_type";
interface Props {
  formData: any;
  isShowModal: boolean;
  isAutoLoad: boolean;
  isAdd: boolean;
  isAction: boolean;
  form: any;
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
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
columns = columns.value.map((p?: any) => {
  return {
    ...p,
    title: t(camelCaseEntity + ".attribute." + p.dataIndex),
  };
});
const loading = ref<boolean>(false);
const grid: any = ref();
const hideModal = () => {
  emit("hideModal");
};
const forms = ref<any>(props.formData);
const handleChangeActive = ($event?: any) => {
  if (!$event) {
    forms.value.is_active = 1;
  } else {
    forms.value.is_active = 2;
  }
};
</script>

<style scoped lang="scss">
.avatarDetail {
  min-width: 76%;
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