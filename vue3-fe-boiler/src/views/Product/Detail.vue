<template>
  <a-row justify="center">
    <a-col :span="20">
      <a-row>
        <a-col :span="18">
          <a-row>
            <a-card hoverable :bordered="false" class="card-border" :title="$t('company.title.general_information')"
              style="width: 100%">
              <a-row type="flex" justify="start" align="middle">
                <a-col :span="24">

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.code.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.code}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.name.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.name}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.amount.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.amount}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.name_of_company_id.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.name_of_company_id}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.name_of_category_id.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.name_of_category_id}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.start_time.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.start_time}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.end_time.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.end_time}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.description.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.description}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                </a-col>
              </a-row>
            </a-card>
          </a-row>
          <a-row>
            <a-card hoverable :bordered="false" class="card-border" title="Thông tin hệ thống" style="width: 100%">
              <a-row type="flex" justify="start" align="middle">
                <a-col :span="24">
                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.ins_date.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.ins_date ? moment(form.ins_date).format("DD/MM/YYYY HH:mm") : '--'}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.ins_id.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.name_of_ins_id}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.upd_date.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.upd_date ? moment(form.upd_date).format("DD/MM/YYYY HH:mm") : '--'}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.upd_id.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.name_of_upd_id}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-card>
          </a-row>
        </a-col>

        <a-col :span="6">
          <a-row justify="start">
            <a-card hoverable style="width: 15vw; margin-left: 24px" class="card-border">
              <template #cover>
                <img :src="getImage(form.avatar_id)" alt="avatar" />
              </template>
              <a-card-meta>
                <template #description>
                  <a-row type="flex" justify="center">
                    <a-col><strong>Ảnh đại diện</strong></a-col>
                  </a-row>
                </template>
              </a-card-meta>
            </a-card>
          </a-row>
          <a-row justify="start">
            <a-card hoverable style="width: 15vw; margin-left: 24px" class="card-border">
              <a-card-grid style="width: 100%">
                <a-row>
                  <a-col :span="24">
                    <a-row>
                      <p>Trạng thái</p>
                    </a-row>
                    <a-row>
                      <a-col :span="16"><p>{{form.is_active == 1? `Hoạt động` : `Ngừng hoạt động`}}</p></a-col>
                      <a-col :span="8"><a-switch :checked="form.is_active == 1 ? true : false"></a-switch></a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </a-card-grid>

            </a-card>
          </a-row>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import moment from "moment/moment";
import { generateFields } from "@/formUtility";
import { getImage } from "@/utility";
import * as _ from "lodash";
import { PlusCircleOutlined, UndoOutlined } from "@ant-design/icons-vue";
import { watch, ref, toRefs } from "vue";
import ColumnConfig from "@/config/columns";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "product";
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
</script>

<style scoped lang="scss">
.avatar {
  width: 256px;
  height: 256px;
  object-fit: cover;
  margin: 24px;
}

.box {
  margin: 24px;
  border-radius: 5px;
  border: 1px solid rgb(246, 247, 246);
}

.card-border {
  border-radius: 4px;
  margin-bottom: 16px;
}

:deep() .ant-form-item-label>label {
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