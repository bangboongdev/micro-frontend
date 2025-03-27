<template >
  <div class="card">
    <div class="header">
      <a-row class="title">
        <a-col span="12">{{ title }}</a-col>
        <a-col span="12" class="justify-end">
          <slot name="headerOption"></slot
        ></a-col>
      </a-row>
      <div class="content">
        <a-row class="search-bar">
          <span class="search-bar-btn"><slot name="button"></slot></span>
          <div class="search-bar-input">
            <o-select
              :value="value"
              @input="changeSelect"
              @getData="getDataSelected"
              @changeDefaultFirstOption="changeDefaultFirstOption"
              :placeholder="placeholderSearch"
              :entity="entitySearch"
              :textField="'bar_code'"
              :isLabel="false"
              :option-label-prop="optionLabelProp"
              :defaultActiveFirstOption="defaultActiveFirstOption"
              ref="select"
              :isAddSelect="true"
              :title="'Danh sách ' + $t(`${camelCaseEntity}.name`)"
              :disabled="selectedDisabled"
              :icon="icon"
              :filters="[
                {
                  field: 'customer_id',
                  operator: 'equal',
                  value: customerId ? customerId : null,
                },
              ]"
              :mode="'multiple'"
              :pageSize="10000"
              :typeSearch="'client'"
              :fieldFilter="'customer_id'"
              :fieldSearch="['bar_code', 'name']"
            >
              <template #customRender="{ item }">
                <a-row class="list-item">
                  <a-col span="1" class="item-img">
                    <a-avatar :src="getImage(item.avatar_id)" />
                  </a-col>
                  <a-col span="23" style="padding-left: 8px">
                    <a-row>
                      <a-col span="12" class="flex-column">
                        <span class="title">{{ item.name }}</span>
                        <span class="sub-title">{{ item.code }}</span>
                      </a-col>
                      <a-col span="12" class="flex-column flex-end">
                        <span>{{
                          item.price ? formatNumber(item.price) : 0
                        }}</span>
                        <span
                          ><strong>{{
                            item.weight ? formatNumber(item.weight) : 0
                          }}</strong></span
                        >
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </template>
            </o-select>
          </div>
          <span class="search-bar-extra"><slot name="extra"></slot></span>
        </a-row>
      </div>
      <div class="content-table">
        <a-table
          bordered
          ref="table_search"
          :data-source="dataTable"
          :columns="cols"
          :pagination="pagination"
          :default-expand-all-rows="'true'"
          :row-key="(record) => record.id"
        >
          <template #number="{ text, record, column, index }">
            <a-input-number
              style="width: 100%"
              v-model:value="record[column.key]"
              :formatter="
                (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              "
              :parser="(value) => value.replace(/(,*)/g, '')"
              @change="
                onChangeQuantity($event, column.key, record, index, column)
              "
              :min="1"
            >
            </a-input-number>
          </template>
          <template #link="{ text }">
            <a>{{ text }}</a>
          </template>
          <template #select="{ record }">
            <a-select
              v-model:value="record.name_of_unit_id"
              @change="handleChange(record, 'unit_id', $event)"
            >
              <a-select-option
                v-for="item in record.products_unit"
                :key="item.id"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </template>
          <template #customNote="{ text, record, index }">
            <div>{{ text }}</div>
            <div class="editable-cell">
              <span class="sub-title">{{ $t("common.default") }}</span>
              <span
                v-if="!editableData[index] && record.note == ''"
                class="editable-cell-icon"
                @click="edit(index)"
                >{{ $t("common.add_note") }}<edit-outlined
              /></span>
              <span class="editable-cell-icon block" @click="edit(index)">{{
                record.note || ""
              }}</span>
              <div
                v-if="editableData[index]"
                class="editable-cell-input-wrapper"
              >
                <a-input
                  class="text-note"
                  v-model:value="editableData[index].note"
                  @pressEnter="save(index)"
                  @blur="save(index)"
                  :placeholder="$t('common.enter_note')"
                />
              </div>
            </div>
          </template>
          <template #action="{ record, index }">
            <DeleteOutlined
              :style="{ color: '#ee6e73', marginRight: '8px' }"
              @click="() => DELETE_ITEM({ record, index })"
            />
          </template>
          <template #expandedRowRender="{ record, index }">
            <span class="lot-serial">
              <template v-for="(tag, index) in record.serial" :key="tag">
                <a-tag
                  color="blue"
                  @close="handleClose(record, 'serial', index, tag)"
                  closable
                  class="mode-tags"
                  >{{ tag.serial_number }}</a-tag
                >
              </template>
            </span>
            <template v-if="record?.is_property == 1">
              <a-dropdown
                :trigger="['click']"
                :placement="'bottomCenter'"
                v-for="(item, index) in record.properties"
                :key="index"
              >
                <a-button class="btn-no-border">
                  {{ $t(`product.property.${index}`) }}
                  <DownOutlined />
                  <a-tag color="blue">{{ item.name_of_selected }}</a-tag>
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-for="(element, i) in item[index]" :key="i">
                      <a-radio-group v-model:value="item.name_of_selected"
                        ><a-radio :value="element.trimEnd()"
                          >{{ element }}
                        </a-radio>
                      </a-radio-group>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>

            <a-input
              class="text-note text-border"
              v-model:value="serialItem"
              @change="onChangeSerial(record, index)"
              @pressEnter="saveSerial(record, 'serial', $event, index)"
              :placeholder="$t('common.enter_serial')"
              v-show="record.is_serial == 1 && record.is_lot != 1"
            />
            <span :class="{ is_serial: record.is_serial == 1 }">
              <span
                v-for="(tag, indexTag) in record.lots"
                :key="tag"
                class="lot-serial"
                @click="handleShowSerialOfLot(tag, record, index)"
              >
                <a-tag
                  color="blue"
                  @close="handleClose(record, 'lots', indexTag, tag)"
                  closable
                  class="mode-tags"
                  v-show="tag?.del_flag != 1"
                  >{{ tag.code }} - {{ formatDate(tag.expired_date) }} - SL:{{
                    tag.quantity
                  }}
                </a-tag>
                <template v-for="(item, i) in tag.serial" :key="i">
                  <a-tag
                    @close="handleClose(record, 'serial', indexTag, item, tag)"
                    closable
                    class="mode-tags"
                    v-if="item.del_flag != 1"
                    >{{ item.serial_number }}
                  </a-tag>
                </template>
              </span>
            </span>
            <o-select
              :placeholder="$t('common.enter_lot')"
              entity="lot"
              ref="select_lot"
              :value="lot"
              @input="onChangeLot($event, 'lots', record, index, tag)"
              :showSearch="true"
              :textField="'code'"
              :isAddSelect="true"
              :title="$t('lot.name')"
              :icon="icon"
              :isLabel="false"
              class="select-lot"
              v-show="record.is_lot == 1"
              :mode="'multiple'"
              :filters="[
                {
                  field: 'product_id',
                  operator: 'equal',
                  value: record?.id || null,
                },
                {
                  field: 'customer_id',
                  operator: 'equal',
                  value: customerId ? customerId : null,
                },
              ]"
              :fill-field="{ dataItem: record }"
            >
              <template #customRender="{ item }">
                <div>
                  <span>{{ item.code }}</span> -
                  <span>{{ item.expired_date }}</span>
                </div>
              </template>
            </o-select>
          </template>
        </a-table>
        <lot-form
          :visible="visible"
          :form-data="formData"
          :title="titleForm"
          @selectData="selectData($event)"
          @changeSerialLot="changeSerialLot($event)"
        ></lot-form>
        <div class="footer"><slot name="footer"></slot></div>
      </div>
    </div>
  </div>
</template>
<script>
import EditTableCell from "./EditTableCell";
import LotForm from "./LotForm";
import utility from "@/utility";
import axios from "axios";
import { cloneDeep } from "lodash-es";
import {
  DeleteOutlined,
  CheckOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "@vue/runtime-core";
import { mapGetters, mapMutations } from "vuex";
import _ from "lodash";
import mixins from "@/mixins";

export default defineComponent({
  mixins: [utility, mixins],
  setup() {
    const editableData = reactive({});
    return {
      editableData,
      icon: ref(PlusOutlined),
      visible: ref(false),
      value: ref([]),
    };
  },
  data() {
    let camelCaseEntity = _.camelCase(this.entitySearch);
    let cols = [];
    var tmp = this.columns.map((p) => {
      switch (p.dataType) {
        case "number":
          p.className = "column-number";
          break;
        default:
          p.className = "column-string";
          break;
      }
      if (p.isBold) {
        p.class += " text-bold";
      }
      if (!p.slots) {
        p.slots = {
          customRender: "customRender",
        };
        if (p.isCodeIndex) {
          p.slots.customRender = "link";
        } else {
          if (p.dataType) {
            p.slots.customRender = p.dataType;
          }
        }
      }
      return p;
    });
    cols = [].concat.apply(cols, tmp);
    if (this.isAction) {
      cols.push({
        key: "operation",
        width: "5%",
        slots: { customRender: "action" },
      });
    }
    return {
      cols: cols,
      form: {},
      formData: {},
      titleForm: "",
      lot: undefined,
      camelCaseEntity,
      serialItem: "",
      keypress: "",
      dataSelect: [],
      defaultActiveFirstOption: false,
    };
  },
  components: {
    EditTableCell,
    DeleteOutlined,
    CheckOutlined,
    EditOutlined,
    PlusOutlined,
    LotForm,
    ArrowRightOutlined,
    DownOutlined,
  },
  props: {
    title: String,
    columns: {
      type: Object,
      default: {},
    },
    entitySearch: String,
    placeholderSearch: String,
    optionLabelProp: String,
    isAction: {
      type: Boolean,
      default: true,
    },
    pagination: {
      type: Boolean,
      default: false,
    },
    selectedDisabled: {
      type: Boolean,
      default: true,
    },
    customerId: undefined,
  },
  mounted() {
    console.log(this.dataSource)
    this.handleKeypress();
  },
  unmounted() {
    this.handleRemoveKeypress();
  },
  watch: {
    selectedDisabled: {
      handle(val) {
        if (val == false) {
          this.handleKeypress();
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters("selectedProduct", {
      dataSource: "dataSource",
    }),
    dataTable() {
      return this.dataSource?.filter((item) => item.del_flag == 0);
    },
  },
  methods: {
    getDataSelected($event) {
      this.dataSelect = $event;
    },
    handleKeypress() {
      let self = this;
      document.addEventListener("keypress", self.handleScanQr);
    },
    handleRemoveKeypress() {
      let self = this;
      document.removeEventListener("keypress", self.handleScanQr);
    },
    handleScanQr(e) {
      let self = this;
      if (self.selectedDisabled == false) {
        if (e.target.tagName !== "INPUT") {
          self.keypress += e.key;
          e.preventDefault();
        }
        if (e.keyCode == 13) {
          const str = self.keypress.replace("Enter", "");
          const result = self.dataSelect.find((item) => item.bar_code == str);
          if (result) {
            self.ADD_ITEM(result);
          }
          self.keypress = "";
        }
      }
    },
    handleChange(record, dataIndex, $event) {
      const dataSource = [...this.dataSource];
      let target = dataSource.find((item) => item.id === record.id);
      if (target) {
        target[dataIndex] = $event;
      }
      // Set sate input number
      // this.ON_CHANGE_INPUT_NUMBER(target);
    },
    onChangeSerial(record, index) {},
    //handle Close tags serial
    handleClose(record, dataIndex, index, item, tag) {
      const dataSource = [...this.dataSource];
      let target = dataSource.find((item) => item.id === record.id);
      item.del_flag = 1;
      if (target) {
        if (dataIndex == "lots") {
          record.quantity = target[dataIndex].reduce(function (sum, element) {
            if (element.del_flag != "1") {
              return sum + element.quantity;
            } else {
              return sum;
            }
          }, 0);
        }
        if (dataIndex == "serial") {
          // Nếu là serial of lot thì cập nhật số lượng theo serial
          if (tag) {
            // tag.quantity = tag[dataIndex].filter((item) => item.del_flag != 1).length;
          }
          // Nếu chỉ là serial thì cập nhật số lượng theo serial
          else {
            record.quantity = target[dataIndex].filter(
              (item) => item.del_flag != 1
            ).length;
          }
        }
        this.SET_STATE_DATA(dataSource);
      }
    },
    ...mapMutations("selectedProduct", {
      DELETE_ITEM: "DELETE_ITEM",
      SAVE_ITEM_INPUT: "SAVE_ITEM_INPUT",
      ON_CHANGE_INPUT_NUMBER: "ON_CHANGE_INPUT_NUMBER",
      SAVE_SERIAL: "SAVE_SERIAL",
      SET_STATE_DATA: "SET_STATE_DATA",
      ADD_ITEM: "ADD_ITEM",
    }),
    saveSerial(record, dataIndex, value, index) {
      const dataSource = [...this.dataSource];
      let target = dataSource.find(
        (item, i) => item.id === record.id && item.del_flag != 1
      );
      if (target) {
        target[dataIndex].push({
          serial_number: this.serialItem,
        });
        this.serialItem = "";
        record.quantity = target[dataIndex].length;
      }
      this.SET_STATE_DATA(dataSource);
    },
    selectData(record) {
      const dataSource = [...this.dataSource];
      let target = dataSource.find(
        (item, indexItem) => item.id === record.product_id && item.del_flag != 1
      );
      if (target) {
        target[record.dataIndex].push(record);
        target["quantity"] = target[record.dataIndex].reduce(function (
          sum,
          element
        ) {
          if (element.del_flag == "0") {
            return sum + element.quantity;
          } else {
            return sum;
          }
        },
        0);
      }
      this.SET_STATE_DATA(dataSource);
      this.visible = false;
    },
    changeSerialLot(record) {
      const dataSource = [...this.dataSource];
      let target = dataSource.find(
        (item, indexItem) => indexItem === this.form.recordKey
      );
      if (target) {
        let index = target[this.form.dataIndex].find(
          (item) => item.id == record.id && item.del_flag != 1
        );
        if (index) {
          target[this.form.dataIndex].forEach((item) => {
            if (
              item.purchase_order_item_instance_id ==
              record.purchase_order_item_instance_id
            ) {
              item.quantity = record.quantity;

              item.serial = [...record.serial];
            }
          });
        }
      }
      this.SET_STATE_DATA(dataSource);
      this.visible = false;
    },
    onChangeQuantity(e, dataIndex, record, index, column) {
      const dataSource = [...this.dataSource];

      this.SET_STATE_DATA(dataSource);
    },
    changeDefaultFirstOption() {
      this.defaultActiveFirstOption = true;
    },
    changeSelect($event) {
      this.value = [];
      if (Array.isArray($event.value) && $event.value.length != 0) {
        $event.value.map((item) => {
          let result = this.dataSelect.find((i) => item.value === i.id);
          this.ADD_ITEM(result);
        });
      }
    },
    edit(key) {
      this.editableData[key] = cloneDeep(
        this.dataSource.filter((item, index) => index === key)[0]
      );
    },
    save(key) {
      // Set state input note
      // this.SAVE_ITEM_INPUT(this.editableData[key]);
      Object.assign(
        this.dataSource.filter((item, index) => key === index)[0],
        this.editableData[key]
      );
      delete this.editableData[key];
    },
    // Thay đổi cơ chế chọn nhiều
    onChangeLot($event, dataIndex, record, index, tag) {
      const dataSource = [...this.dataSource];
      this.lot = [];
      let data = [];
      // Nếu là chọn nhiều
      $event.forEach((element) => {
        if (element.data) {
          data.push(element.data);
        }
      });
      if (data.length != 0) {
        // Đổi trạng thái các selected cũ thành đã xóa del_flag =1
        let newDataSource = [];
        let data_deleted = record[dataIndex].filter(
          (item) => item.del_flag == 1
        );
        data = [...data, ...data_deleted];
        data.forEach((item) => {
          let e = record[dataIndex].find(
            (element) => element.id === item.id && element.del_flag == 0
          );
          if (e) {
            e.quantity = item?.quantity || 0;
            newDataSource.push(e);
          } else {
            newDataSource.push(item);
          }
        });
        record[dataIndex] = newDataSource;
        record["quantity"] = newDataSource.reduce(function (sum, element) {
          if (element.del_flag != "1") {
            return sum + element.quantity;
          } else {
            return sum;
          }
        }, 0);

        this.SET_STATE_DATA(dataSource);
      } else {
        const id = $event[0].key;
        let form = {};
        form.is_serial = record.is_serial;
        form.serialItem = "";
        form.dataIndex = dataIndex;
        form.recordKey = index;
        form.product_id = record.id;
        form.titleForm = "Nhập hàng cho lô :" + record.name;
        const entity = this.$refs.select_lot.entity;
        axios
          .get(`${entity}/${id}`)
          .then((response) => {
            if (response.data.errorCode != 0) {
              if (Array.isArray(response.data.errorMessage)) {
                this.$message.error(
                  response.data.errorMessage
                    .map((p) => p.errorMessage)
                    .join("\n")
                );
              } else {
                this.$message.warning(response.data.errorMessage);
              }
              return;
            }
            form.mode = "add";
            form.quantity = 0;
            form.serial = [];
            this.formData = Object.assign(form, response.data.data);
            this.visible = true;
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
      }
    },
    handleShowSerialOfLot(tag, record, index) {
      let form = tag;
      form.mode = "edit";
      form.is_serial = record.is_serial;
      form.is_lot = record.is_lot;
      form.recordKey = index;
      form.dataIndex = "lots";
      this.formData = form;
      this.visible = true;
    },
    handleOk() {},
    getImage(avatarId) {
      return avatarId ? `${axios.defaults.baseURL}/file/${avatarId}` : "";
    },
  },
});
</script>
<style lang="scss" scoped>
.btn-no-border {
  margin-left: 8px;
  font-size: 12px;
  border: unset;
}
$height-table: 530px;
.card {
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05),
    0 1px 3px 0 rgba(63, 63, 68, 0.15);
  border-radius: 3px;
  padding: 20px;
  position: relative;
  margin-bottom: 20px;
  padding-bottom: 0;
  max-height: $height-table;
}

.ant-row.title {
  font-weight: 500;
  font-size: 16px;
  padding-bottom: 8px;
}
.content {
  .search-bar {
    margin: 0 10px 15px 0;
    .search-bar-input {
      width: 100%;
    }
  }
}
.content-table {
  width: calc(100% + 40px);
  margin: 0 -20px;
  .table-header {
    border: 1px solid #c4cdd5;
    border-width: 1px 0;
    padding: 8px;
    background: #efefef;
  }
}
.content-table {
  :deep(.ant-table-wrapper) {
    height: calc(#{$height-table} - 190px);
    overflow: auto;
  }
  :deep(tr.ant-table-expanded-row, tr.ant-table-expanded-row:hover) {
    background: #fff;
  }
  :deep() .ant-table-thead > tr > th,
  :deep() .ant-table-tbody > tr > td {
    padding: 8px;
    border: unset;
    border-top: 1px solid #c4cdd5;
  }
  :deep() .ant-table-tbody > tr.ant-table-expanded-row-level-1 > td {
    border: unset;
  }
  :deep() {
    th.column-string,
    td.column-string {
      text-align: left !important;
    }
    th.column-date,
    td.column-date {
      text-align: center !important;
    }

    th.column-number,
    td.column-number {
      text-align: right !important;
    }
    td.column-string.text-bold {
      font-weight: 700 !important;
      text-align: right !important;
    }
  }
}

.justify-end {
  justify-content: flex-end;
  display: flex;
}

.flex-column {
  flex-direction: column;
  display: flex;
  .sub-title {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
}
.flex-column.flex-end {
  align-items: flex-end;
}
.list-item {
  align-items: center;
  // border-bottom: 1px solid #c4cdd5;
  .item-img {
    display: flex;
    justify-content: center;
    img {
      width: 90%;
      height: 90%;
    }
  }
}
.editable-cell {
  position: relative;
  span.sub-title {
    font-style: italic;
    font-size: 12px;
    color: #757575;
  }
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    cursor: pointer;
    top: 2px;
    left: 54px;
    font-size: 12px;
  }

  .editable-cell-icon {
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
  color: #108ee9;
}
.editable-cell-icon.block {
  display: block;
  color: #108ee9;
}
.text-note {
  font-size: 13px;
}
.text-note.text-border {
  margin: 4px 4px 8px 0;
  border-radius: 2px;
  border: unset;
  border-bottom: 1px solid #c4cdd5;
  display: block;
  width: 50%;
}
.text-note.text-border:focus {
  box-shadow: unset;
}
.select-lot {
  font-size: 13px;

  :deep(.ant-select-selector) {
    border: unset;
    border-bottom: 1px solid #c4cdd5;
  }
  :deep(button.ant-btn.ant-btn-icon-only) {
    border: unset;
    border-bottom: 1px solid #c4cdd5;
  }
}
.select.select-lot {
  :deep(.ant-select) {
    width: 50% !important;
  }
}
.mode-tags {
  margin: 4px 4px 4px 0;
}
.is_serial {
  display: block;
}
.lot-serial {
  display: flex;
  flex-wrap: wrap;
}
</style>