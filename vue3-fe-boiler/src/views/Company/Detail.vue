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
                          <p>{{ fields.delegate.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.delegate}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.tax_code.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.tax_code}}</p>
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
            <a-card hoverable :bordered="false" class="card-border" title="Thông tin liên hệ" style="width: 100%">
              <a-row type="flex" justify="start" align="middle">
                <a-col :span="24">
                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.mobile_no.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <a :href="'tel:' + form.mobile_no">{{form.mobile_no}}</a>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.email.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <a :href="'mailto:' + form.email">{{form.email}}</a>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.address.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.address}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.name_of_province_id.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.name_of_province_id}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>

                  <a-row :gutter="[0, 24]">
                    <a-col :span="24">
                      <a-row>
                        <a-col :span="6">
                          <p>{{ fields.name_of_district_id.label }}</p>
                        </a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="17">
                          <p>{{form.name_of_district_id}}</p>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-card>
          </a-row>
          <a-row>
            <a-card hoverable :bordered="false" class="card-border" title="Thông tin thêm" style="width: 100%">
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
                      <a-col :span="16"><p>{{form.is_active == 1 ? `Hoạt động` : `Ngừng hoạt động`}}</p></a-col>
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
const entity = "company";
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
.card-border {
  border-radius: 4px;
  margin-bottom: 24px;
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

.info {
  margin-bottom: 16px;
  margin-top: 24px;
  border-bottom: 1px solid gray;
}
</style>