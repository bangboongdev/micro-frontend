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
                $t(`${entity}.attribute.issued_id`)
              }}</span>
              <div>
                <span class="text-bold">{{ form.name_of_issued_id }} </span>
                <span
                  >({{
                    moment(form.order_date).format("DD/MM/YYYY HH:mm")
                  }})</span
                >
              </div>
            </a-col>
            <a-col span="12" class="flex-column">
              <span class="text-uppercase">{{
                $t(`${entity}.attribute.approved_id`)
              }}</span>
              <div>
                <span class="text-bold">{{ form.name_of_approved_id }} </span>
                <span
                  >({{
                    moment(form.approved_date).format("DD/MM/YYYY HH:mm")
                  }})</span
                >
              </div>
            </a-col>
          </a-row>
        </a-card>
        <a-card
          class="card-border no-padding"
          :title="$t(`${entity}.title.list_order`)"
        >
          <a-form-item name="list_location">
            <a-skeleton active :loading="loading">
              <a-list
                item-layout="horizontal"
                :data-source="form.location"
                class="list-order-item"
              >
                <template #header>
                  <a-row :gutter="16">
                    <a-col span="12">{{
                      $t(`${entity}.title.product_info`)
                    }}</a-col>

                    <a-col span="3">{{
                      $t(`${entity}.title.real_quantity`)
                    }}</a-col>

                    <a-col span="8">{{ $t(`${entity}.title.location`) }}</a-col>
                  </a-row>
                </template>
                <template #renderItem="{ item }">
                  <a-row
                    :gutter="16"
                    class="order-item"
                    :draggable="true"
                    @dragstart="startDrag($event, item)"
                  >
                    <a-col span="24">
                      <a-row>
                        <a-col span="12">
                          <p class="title">
                            <span class="text-code">{{
                              $t("purchaseOrder.title.code")
                            }}</span
                            >#{{ item.code }}
                          </p>
                          <div class="sub-title-row">
                            <span>{{ item.name_of_product_id }}</span>
                            <span>x {{ item.quantity }}</span>
                          </div>
                          <div>
                            <EnvironmentTwoTone /><span
                              class="sub-title-italic"
                              >{{ item.name_of_estimate_location_id }}</span
                            >
                          </div>
                        </a-col>
                        <a-col span="3" class="text-right">
                          <a-input-number
                            v-model:value="item.real_quantity"
                            @change="onChangeQuantity(item)"
                          ></a-input-number>
                        </a-col>
                        <a-col span="8">
                          <a-cascader
                            v-model:value="item.estimate_location_id"
                            :options="listLocation"
                            style="width: 100%"
                            :placeholder="$t(`${entity}.title.select_location`)"
                            @change="onChangeLocation(value, selectedOptions)"
                            :fieldNames="{
                              label: 'code',
                              value: 'id',
                              children: 'children',
                            }"
                          >
                            <!-- <template #displayRender="{ labels, selectedOptions }">
                        <span
                          v-for="(label, index) in labels"
                          :key="selectedOptions[index].value"
                        >
                          <span v-if="index === labels.length - 1">
                            {{ label }}
                          </span>
                          <span v-else>{{ label }} /</span>
                        </span>
                      </template> -->
                          </a-cascader>
                        </a-col>
                        <a-col span="1">
                          <a-tooltip placement="topLeft">
                            <template #title>
                              <span>{{ $t(`${entity}.title.copy`) }}</span>
                            </template>
                            <CopyOutlined
                              class="copy-icon"
                              @click="copyLocation(item, form.location)"
                            />
                          </a-tooltip>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col span="14">
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
                        <a-col span="9" class="text-right">
                          <a-form-item
                            :label="$t(`${entity}.title.serial`)"
                            :label-col="{ span: 6 }"
                            :wrapper-col="{ span: 18 }"
                            v-if="item.is_serial == 1"
                          >
                            <a-input
                              v-model:value="item.serial_number"
                              @change="onChangeQuantity(item)"
                              :placeholder="
                                $t(`${entity}.placeholder.serial_number`)
                              "
                            ></a-input>
                          </a-form-item>
                        </a-col>
                        <a-col span="1"></a-col>
                        <a-col v-show="item.is_edit" span="24"
                          ><a-input
                            class="no-border"
                            :placeholder="$t('purchaseOrder.attribute.note')"
                            v-model:value="item.issued_note"
                          ></a-input>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col span="24">
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
import constant from "@/constant";
import utility from "@/utility";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import {
  UserOutlined,
  EnvironmentOutlined,
  CopyOutlined,
  EnvironmentTwoTone,
  DownOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import mixins from "@/mixins";
import { computed, ref } from "vue";
import i18n from "@/lang";
const { t } = i18n.global;
const store = useStore();
interface Props {
  entity: string;
  nameOfWarehouseId: string;
}
const ruleForm = ref<any>();
const props = withDefaults(defineProps<Props>(), {
  entity: "",
  nameOfWarehouseId: "",
});
const emit = defineEmits<{
  (e: "handleClose"): void;
  (e: "reorder"): void;
}>();
const form = computed(() => store.state[props.entity].instanceLocation);
const loading = computed(() => store.state[props.entity].loading);
const listLocation =  computed(() =>  store.getters["warehouse/listLocation"]);
const zgActive =  computed(() => store.getters["warehouse/zoneGroupActive"]);
const zActive =  computed(() => store.getters["warehouse/zoneActive"]);
let validateLocation = async (rule: any, value: any) => {
  let forms = form.value.location;
  if (!forms.find((p: any) => p.estimate_location_id?.length != 0)) {
    return Promise.reject(t(`${props.entity}.validator.real_location`));
  } else if (
    forms
      .filter((item: any) => item.is_serial == 1)
      .find((p: any) => p.serial_number == null || p.serial_number == "")
  ) {
    return Promise.reject(t(`${props.entity}.validator.serial_number`));
  } else {
    return Promise.resolve();
  }
};
let rules: any = {
  list_location: [
    {
      required: true,
      validator: validateLocation,
      trigger: "change",
    },
  ],
};

const value = ref<string>("");
const zoneGroupActive = ref<any>(zgActive.value);
const zoneActive = ref<any>(zActive.value);

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
  form.value.issued = $event.value;
  form.value.issued_id = $event.value.key;
};
const onChangeQuantity = (item: any) => {
  item.is_edit = true;
};
const onChangeLocation = (value: any, selectedOptions: any) => {
  ;
  zoneGroupActive.value = value[0];
  zoneActive.value = value[1];
  if (selectedOptions?.length != 0) {
    setTimeout(() => {
      let alias = selectedOptions[2].code;
      let arr_location = document.getElementsByClassName("wh-seat goods");
      Array.from(arr_location).forEach((item:any) => {
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
  }
};
const copyLocation = (item: any, forms: any) => {
  form.value.location = forms.map((element: any) => {
    return {
      ...element,
      location_id: item.location_id,
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
  let ids = location.id;

  let location_id: any = [];
  location_id.push(zoneGroupActive.value);
  location_id.push(zoneActive.value);
  location_id.push(ids);
  form.value?.location.forEach((element: any, index: any) => {
    if (element.id == itemID) {
      element["location_id"] = location_id;
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
    color: rgb(24, 144, 255);
    span.text-code {
      color: rgba(41, 41, 41, 0.8);
      margin-right: 4px;
    }
  }
  .sub-title-row {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
  }
  span.sub-title-italic {
    font-size: 12px;
    font-style: italic;
    color: rgba(41, 41, 41, 0.8);
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
.no-border {
  border: unset;
  border-bottom: 1px solid #ededed;
}
.no-border:focus {
  box-shadow: unset;
}
</style>
<style lang="scss">
.wh-wrap.wrap-scroll {
  .wh-container-column.wh-right {
    .wh-column-index {
      position: sticky;
      top: 0;
      z-index: 1;
      background: #fff;
    }

    .wh-container-row {
      height: 54vh;
      width: 98%;
      overflow: scroll;
      .wh-row-index {
        position: sticky;
        left: 0;
        z-index: 1;
        background: #fff;
      }
    }
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
.btn-no-border {
  padding-left: 0px;
  font-size: 12px;
  border: unset;
}
</style>