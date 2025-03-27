<template>
  <a-form
    ref="ruleForm"
    :rules="rules"
    :model="form"
    :label-col="{ span: 24 }"
    :wrapper-col="{ span: 24 }"
  >
    <a-row :gutter="16">
      <a-col span="12">
        <a-card
          class="card-padding"
          :title="$t(`${entity}.title.purchase_info`)"
        >
          <a-row>
            <a-col span="12" class="flex-column">
              <span class="text-uppercase">{{
                $t(`${entity}.attribute.approved_id`)
              }}</span>
              <div>
                <span class="text-bold">{{ form.name_of_approved_id }} </span>
                <span
                  >({{
                    moment(form.order_date).format("DD/MM/YYYY HH:mm")
                  }})</span
                >
              </div>
            </a-col>
            <a-col span="12" class="no-padding">
              <a-form-item
                :label="$t(`${entity}.attribute.issued_id`)"
                name="issued"
              >
                <o-select
                  :placeholder="$t(`${entity}.attribute.issued_id`)"
                  entity="user"
                  v-model:value="form.issued"
                  @input="onChangeIssued($event)"
                  :showSearch="true"
                  :isDisplay="'none'"
                  :isLabel="false"
                >
                  <template #customRender="{ item }">
                    <a-row class="row-center">
                      <a-col span="1">
                        <a-image
                          style="width: 90%; height: 90%"
                          :src="getImage(item.avatar_id)"
                        ></a-image>
                      </a-col>
                      <a-col span="23">
                        <div class="item-info">
                          <div class="item-column">
                            <span class="title">{{ item.username }}</span>
                            <span class="sub-title">{{ item.code }}</span>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                </o-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card
          class="card-border no-padding"
          :title="$t(`${entity}.title.list_order`)"
        >
          <a-form-item name="list_order">
            <a-skeleton active :loading="loading">
              <a-list
                item-layout="horizontal"
                :data-source="form.listInstance"
                class="list-order-item"
              >
                <template #header>
                  <a-row>
                    <a-col span="9">{{
                      $t(`${entity}.title.product_name`)
                    }}</a-col>
                    <a-col span="3" class="text-right">{{
                      $t(`${entity}.title.quantity`)
                    }}</a-col>
                    <a-col span="6"></a-col>
                    <a-col span="3">{{
                      $t(`${entity}.title.select_location`)
                    }}</a-col>
                  </a-row>
                </template>
                <template #renderItem="{ item }">
                  <a-row
                    class="order-item"
                    :draggable="true"
                    @dragstart="startDrag($event, item)"
                  >
                    <a-col span="24">
                      <a-row>
                        <a-col span="1">
                          <a-checkbox v-model:checked="item.id"></a-checkbox>
                        </a-col>
                        <a-col span="8">
                          <p class="title">{{ item.name_of_product_id }}</p>
                          <span class="sub-title">{{
                            item.name_of_unit_id
                          }}</span>

                          <span class="lot-serial">
                            <a-tooltip
                              :title="
                                $t(`${entity}.title.lot_code`, [
                                  item.code_of_lot_id,
                                  formatDate(item.manufactured_date),
                                  formatDate(item.expired_date),
                                ])
                              "
                              v-if="item.code_of_lot_id != null"
                              color="#00885A"
                            >
                              <a-tag color="blue"
                                ><span>
                                  {{ item.code_of_lot_id }}
                                  {{ $t("lot.short_text.manufactured_date")
                                  }}{{ formatDate(item.manufactured_date) }}
                                  {{ $t("lot.short_text.expired_date")
                                  }}{{ formatDate(item.expired_date) }}</span
                                ></a-tag
                              >
                            </a-tooltip>
                            <a-tooltip
                              :title="
                                $t(`${entity}.title.serial`, {
                                  field: item.serial_number,
                                })
                              "
                              v-if="item.serial_number != null"
                              color="#00885A"
                            >
                              <a-tag
                                ><span>{{ item.serial_number }}</span></a-tag
                              >
                            </a-tooltip>
                          </span>
                        </a-col>
                        <a-col span="3" class="text-right">{{
                          item.quantity
                        }}</a-col>
                        <a-col span="11">
                          <a-row>
                            <a-col span="8"></a-col>
                            <a-col span="16" class="serial-item item-center">
                              <a-cascader
                                v-model:value="item.estimate_location_id"
                                :options="listLocation"
                                style="width: 100%"
                                :placeholder="
                                  $t(`${entity}.title.select_location`)
                                "
                                @change="onChangeLocation"
                                :fieldNames="{
                                  label: 'code',
                                  value: 'id',
                                  children: 'children',
                                }"
                              >
                                <template
                                  #displayRender="{ labels, selectedOptions }"
                                >
                                  <span
                                    v-for="(label, index) in labels"
                                    :key="selectedOptions[index].value"
                                  >
                                    <span v-if="index === labels.length - 1">
                                      {{ label }}
                                    </span>
                                    <span v-else>{{ label }} /</span>
                                  </span>
                                </template>
                              </a-cascader>
                            </a-col>
                          </a-row>
                        </a-col>

                        <a-col span="1">
                          <a-tooltip placement="topLeft">
                            <template #title>
                              <span>{{ $t(`${entity}.title.copy`) }}</span>
                            </template>
                            <CopyOutlined
                              class="copy-icon"
                              @click="copyLocation(item, form.listInstance)"
                            />
                          </a-tooltip>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col span="1"></a-col>
                        <a-col span="23">
                          <span class="sub-property">
                            <a-dropdown
                              :trigger="['click']"
                              :placement="'bottomCenter'"
                              v-if="item.color != ''"
                            >
                              <a-button class="btn-no-border">
                                {{ $t(`product.property.color`) }}
                                <DownOutlined />
                                <a-tag color="blue">{{ item.color }}</a-tag>
                              </a-button>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item
                                    v-for="(element, i) in item.list_of_color"
                                    :key="i"
                                  >
                                    <a-radio-group v-model:value="item.color"
                                      ><a-radio :value="element"
                                        >{{ element }}
                                      </a-radio>
                                    </a-radio-group>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                            <a-dropdown
                              :trigger="['click']"
                              :placement="'bottomCenter'"
                              v-if="item.material != '' || null"
                            >
                              <a-button class="btn-no-border">
                                {{ $t(`product.property.material`) }}
                                <DownOutlined />
                                <a-tag color="blue">{{ item.material }}</a-tag>
                              </a-button>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item
                                    v-for="(
                                      element, i
                                    ) in item.list_of_material"
                                    :key="i"
                                  >
                                    <a-radio-group v-model:value="item.material"
                                      ><a-radio :value="element"
                                        >{{ element }}
                                      </a-radio>
                                    </a-radio-group>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                            <a-dropdown
                              :trigger="['click']"
                              :placement="'bottomCenter'"
                              v-if="item.size != '' || null"
                            >
                              <a-button class="btn-no-border">
                                {{ $t(`product.property.size`) }}
                                <DownOutlined />
                                <a-tag color="blue">{{ item.size }}</a-tag>
                              </a-button>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item
                                    v-for="(element, i) in item.list_of_size"
                                    :key="i"
                                  >
                                    <a-radio-group v-model:value="item.size"
                                      ><a-radio :value="element"
                                        >{{ element }}
                                      </a-radio>
                                    </a-radio-group>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                          </span>
                        </a-col>
                      </a-row>
                    </a-col>
                  </a-row>
                </template>
              </a-list>
            </a-skeleton>
          </a-form-item>
        </a-card>
      </a-col>
      <a-col span="12">
        <a-card class="card-border" :title="nameOfWarehouseId">
          <a-tabs
            v-model:activeKey="zoneGroupActive"
            :size="'small'"
            @change="handleChangeZoneGroup"
          >
            <a-tab-pane
              :key="zoneGroup.id"
              v-for="zoneGroup in listLocation"
              :tab="zoneGroup.code"
            >
              <a-tabs
                v-model:activeKey="zoneActive"
                :size="'small'"
                @change="handleChangeZone"
              >
                <a-tab-pane
                  :key="zone.id"
                  v-for="zone in zoneGroup.children"
                  :tab="zone.name"
                >
                  <template #tab>
                    <span>
                      <apple-outlined />
                      {{ zone.code }}
                    </span>
                  </template>
                  <a-row>
                    <a-col span="24">
                      <div
                        class="wh-wrap wrap-scroll"
                        v-html="zone.content"
                        @drop="onDrop($event, 1)"
                        @dragover.prevent
                        @dragenter.prevent
                      ></div>
                    </a-col>
                  </a-row>
                </a-tab-pane>
              </a-tabs>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import moment from "moment/moment";
import { getImage,formatDate } from "@/utility";
import { computed, ref } from "vue";
import constant from "@/constant";
import utility from "@/utility";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import {
  UserOutlined,
  EnvironmentOutlined,
  CopyOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import mixins from "@/mixins";
import i18n from "@/lang";
const { t } = i18n.global;
const store = useStore();
interface Props {
  entity: string;
  nameOfWarehouseId: string;
}
const props = withDefaults(defineProps<Props>(), {
  entity: "",
  nameOfWarehouseId: "",
});
const emit = defineEmits<{
  (e: "handleClose"): void;
  (e: "reorder"): void;
}>();
const form = computed(() => store.state[props.entity].listInstance);
const loading = computed(() => store.state[props.entity].loading);
const listLocation = computed(() => store.getters["warehouse/listLocation"]);
const zgActive = computed(() => store.getters["warehouse/zoneGroupActive"]);
const zActive = computed(() => store.getters["warehouse/zoneActive"]);
let validateLocation = async (rule: any, value: any) => {
  let forms = form.value?.listInstance;
  if (!forms.find((p: any) => p.estimate_location_id != 0)) {
    return Promise.reject(t(`${props.entity}.validator.estimate_location`));
  } else {
    return Promise.resolve();
  }
};
let validateIssued = async (rule: any, value: any) => {
  let issued_id = form.value?.issued_id;
  if (typeof issued_id === "undefined" || issued_id == null) {
    return Promise.reject(t(`${props.entity}.validator.issued_id`));
  } else {
    return Promise.resolve();
  }
};
let rules = ref<any>({
  list_order: [
    {
      required: true,
      validator: validateLocation,
      trigger: "change",
    },
  ],
  issued: [
    {
      required: true,
      validator: validateIssued,
      trigger: ["change", "blur"],
    },
  ],
});
const ruleForm = ref<any>();
const value = ref<string>("");
const zoneGroupActive =  ref<any>(zgActive.value);
const zoneActive =  ref<any>(zActive.value);

const handleChangeZoneGroup = (key: any) => {
  zoneGroupActive.value = key;
};
const handleChangeZone = (key: any) => {
  zoneActive.value = key;
};
const handleClose = () => {
  emit("handleClose");
};
const onChangeIssued = ($event: any) => {
  form.value.issued_id = $event.value.key;
};
const onChangeLocation = (value: any, selectedOptions: any) => {
  zoneGroupActive.value = value[0];
  zoneActive.value = value[1];
  setTimeout(() => {
    let alias = selectedOptions[2].code;
    let arr_location = document.getElementsByClassName("wh-seat goods");
    Array.from(arr_location).forEach((item) => {
      if (alias == item.getAttribute("data-code")) {
        let toggleClass = setInterval(function () {
          item.classList.toggle("background-select");
        }, 100);
        setTimeout(() => {
          clearInterval(toggleClass);
          item.classList.add("background-select");
        }, 1500);
      }
    });
  }, 0);
};
const copyLocation = (item: any, form: any) => {
  form.value.listInstance = form.map((element: any) => {
    return {
      ...element,
      estimate_location_id: item.estimate_location_id,
    };
  });
};
const startDrag = (evt: any, item: any) => {
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("itemID", item.id);
};
const onDrop = (evt: any, list: any) => {
  const itemID = evt.dataTransfer.getData("itemID");
  const [element] = evt.path;
  if (!element.classList.contains("wh-seat")) {
    return;
  } else {
    let toggleClass = setInterval(function () {
      element.classList.toggle("background-select");
    }, 100);
    setTimeout(() => {
      clearInterval(toggleClass);
      element.classList.add("background-select");
    }, 1500);
  }
  const code = element.getAttribute("data-code");

  // find id location
  let listLocations = listLocation.value;
  let zoneGroup = listLocations.find((p: any) => p.id == zoneGroupActive.value);
  let zone = zoneGroup["children"].find((p: any) => p.id == zoneActive.value);
  let location = zone["children"].find((p: any) => p.code == code);
  let location_id = location.id;

  let estimate_location_id: any = [];
  estimate_location_id.push(zoneGroupActive.value);
  estimate_location_id.push(zoneActive.value);
  estimate_location_id.push(location_id);
  form.value?.listInstance.forEach((element: any, index: any) => {
    if (element.id == itemID) {
      element["estimate_location_id"] = estimate_location_id;
    }
  });
};
defineExpose({ ruleForm });
</script>
<style lang="scss" scoped>
.card-border.no-padding {
  :deep(.ant-card-body) {
    padding: 0;
  }
  :deep(.ant-card-head) {
    padding: 0 12px;
  }
}
.card-padding {
  :deep(.ant-card-body) {
    padding: 12px;
  }
  :deep(.ant-card-head) {
    padding: 0 12px;
  }
}
.order-item {
  padding: 8px 0;
  border-bottom: 1px solid #ededed;
  align-items: center;
  p.title {
    margin: 0;
  }
  span.sub-title {
    font-size: 12px;
    color: rgba(41, 41, 41, 0.8);
  }
  .serial-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .serial-item.item-center {
    align-items: center;
  }
  span.text-border-margin {
    margin: 2px 0;
  }
}
.list-order-item {
  background: #fff;
  :deep(.ant-list-header) {
    background-color: #f9fafc;
    padding: 12px;
    font-weight: 500;
  }
  :deep(.ant-list-items) {
    padding: 0 12px;
  }
}
.text-right {
  text-align: right;
}
.row-item-center {
  display: flex;
  min-height: 38px;
  align-items: center;
}
.column-item {
  display: flex;
  min-height: 38px;
  flex-direction: column;
}
.copy-icon {
  margin-left: 4px;
  color: blue;
}
.purchase-info {
  padding: 12px;
  align-items: center;
  span.bold {
    font-weight: 600;
  }
}
.flex-column {
  display: flex;
  flex-direction: column;
  .text-uppercase {
    text-transform: uppercase;
    font-weight: 500;
  }
  .text-bold {
    font-weight: 500;
    margin-right: 4px;
  }
}
.no-padding {
  :deep(.ant-form-item) {
    margin: 0;
  }
}

.row-center {
  align-items: center;
  display: flex;
  .item-info {
    display: flex;
    justify-content: space-between;
    padding-left: 8px;
    align-items: center;
    .item-column {
      display: flex;
      flex-direction: column;
      .title {
      }
      .sub-title {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
.customer-info {
  height: 40px;
  .ant-image-img {
    width: 38px;
    height: 38px;
    margin-right: 8px;
  }
  .title {
    color: #08f;
  }
  .close-customer {
    color: #798c9c;
    cursor: pointer;
  }
}
.lot-serial {
  display: flex;
  flex-wrap: wrap;
  .ant-tag {
    font-size: 10px;
    cursor: pointer;
    margin-bottom: 4px;
  }
}
.property {
  margin-right: 4px;
  .property-item {
    margin-right: 4px;
    font-size: 12px;
    font-style: italic;
    color: #757575;
    .ant-tag {
      font-size: 10px;
    }
  }
}
</style>