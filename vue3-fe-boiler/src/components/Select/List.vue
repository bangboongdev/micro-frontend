<template>
  <div class="wrapper-content">
    <div class="heading">
      <div class="new-add" v-if="isAddSelect"></div>
      <div class="search-heading">
        <b>{{ $t("common.search") }} : </b>
        <a-input-search
          :placeholder="placeholder"
          v-model="value"
          :style="{ width: '50%', marginLeft: '8px' }"
          @pressEnter="fetchData"
          @search="fetchData"
        />
        <a-button
          type="primary"
          @click="newAdd"
          v-permission:add="entity.replaceAll('-', '_')"
          :style="{
            background: '#00885a',
            borderColor: '#00885a',
            marginLeft: '8px',
          }"
        >
          <template #icon><PlusOutlined /></template
          >{{
            $t("common.add", { entity: headerTitle.toLowerCase() })
          }}</a-button
        >
      </div>
    </div>
    <a-spin :spinning="loading" size="deflault" tip="Đang tải...">
      <div class="header-left" v-if="mode == 'multiple'">
        <a-button
          type="primary"
          :disabled="!hasSelected"
          :loading="loading"
          @click="reloadSelected"
          v-if="mode == 'multiple' && selectedRowKeys.length > 0"
        >
          {{ $t("common.removeAll") }}
        </a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `Đã chọn ${selectedRowKeys.length}` }}
          </template>
        </span>
      </div>
      <a-table
        :rowClassName="setRowClassName"
        :scroll="{ x: 300, y: this.maxHeight }"
        :pagination="pagination"
        :row-selection="rowSelection"
        :locale="{
          filterConfirm: this.$t('common.filter'),
          filterReset: this.$t('common.cancel'),
        }"
        :row-key="(record) => record.id"
        type="radio"
        :columns="cols"
        :data-source="data"
      >
        <template #date="{ text }">{{
          text == null ? "" : formatDate(text)
        }}</template>
        <template #datetime="{ text }">{{
          text == null ? "" : formatDateTimeVN(text)
        }}</template>
        <template #time="{ text }">{{ text }}</template>
        <template #number="{ text }">{{ text }}</template>
        <template #numberEdit="{ record, column, index }">
          <a-input-number
            v-model:value="record[column.dataIndex]"
            :formatter="
              (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/(,*)/g, '')"
            @change="
              onChangeQuantity($event, column.key, record, index, column)
            "
            :min="0"
          >
          </a-input-number>
        </template>
        <template #email="{ text }">
          <a :href="'mailto:' + text">
            <a-tooltip :title="text" placement="topLeft">
              {{ text }}
            </a-tooltip>
          </a>
        </template>
        <template #phone="{ text }">
          <a :href="'tel:' + text">{{ text }} </a>
        </template>
        <template #list="{ text, column }">
          <a-tooltip :title="renderList(text, column)" placement="topLeft">
            <a-tag :color="renderList(text, column, 'color')">
              {{ renderList(text, column) }}
            </a-tag>
          </a-tooltip></template
        >
        <template #image="{ text }">
          <img
            width="36"
            height="36"
            v-bind:src="getImage(text)"
            alt="image"
            v-if="text"
          />
        </template>
        <template #bool="{ text, column }">
          {{ renderBool(text, column) }}
        </template>
      </a-table>
    </a-spin>
    <a-modal
      :title="title"
      v-model:visible="visible"
      :width="'auto'"
      centered
      :bodyStyle="bodyStyleModal"
      :destroyOnClose="true"
      :wrapClassName="wrapClassName"
    >
      <template #footer>
        <a-button class="btn-cancel" @click="handleCancel">
          {{ $t("common.back") }}
        </a-button>
        <a-button
          @click="handleOk"
          class="btn-submit"
          :loading="confirmLoading"
        >
          <template #icon>
            <SaveOutlined />
          </template>
          {{ $t("common.save") }}
        </a-button>
      </template>
      <keep-alive>
        <component
          :is="formComponent"
          ref="detail"
          :formData="formData"
          :fields="fields"
          :rules="rules"
          v-if="visible"
          :show="visible"
          :width="inputWidth"
        ></component>
      </keep-alive>
    </a-modal>
  </div>
</template>

<script >
import { defineComponent, defineAsyncComponent } from "vue";

import axios from "axios";
import ColumnConfig from "@/config/columns";
import debounce from "lodash/debounce";
import formUtility from "@/formUtility";
import Model from "@/config/models";
import moment from "moment/moment";
import {
  UndoOutlined,
  DownloadOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons-vue";
import * as _ from "lodash";
import mixins from "@/mixins";
import { mapGetters, mapMutations, mapState } from "vuex";

export default defineComponent({
  mixins: [mixins, formUtility],

  name: "base-list",
  props: {
    loadingProp: Boolean,
    placeholder: String,
    textField: String,
    entity: String,
    isAddSelect: Boolean,
    filters: [],
    mode: String,
    show: Boolean,
    fillField: {
      type: Object,
      default: {},
    },
  },
  components: {
    UndoOutlined,
    DownloadOutlined,
    PlusOutlined,
    SaveOutlined,
  },
  data() {
    let camelCaseEntity = _.camelCase(this.entity);
    let headerTitle = this.$t(camelCaseEntity + ".name") || "";
    let columns = ColumnConfig[camelCaseEntity] || [];

    columns = columns.map((p) => {
      return {
        ...p,
        title: this.$t(camelCaseEntity + ".attribute." + p.dataIndex),
      };
    });
    let title = this.$t(camelCaseEntity + ".name") || "";
    let form = this.generateFormData(Model[camelCaseEntity]) || {};
    const fields = this.generateFields(camelCaseEntity);
    const rules = this.generateRules(camelCaseEntity);
    let cols = [];
    var tmp = columns.map((p) => {
      switch (p.dataType) {
        case "number":
          p.className = "column-number";
          break;
        case "date":
        case "time":
        case "datetime":
          p.className = "column-date";
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
          filterIcon: "filterIcon",
          customRender: "customRender",
        };
        if (p.dataSource) {
          p.filters = p.dataSource;
        } else {
          if (p.dataType == "date" || p.dataType == "datetime") {
            p.slots.filterDropdown = "filterDate";
            if (p.disableSearch) {
              p.slots.filterDropdown = "";
            }
          } else if (p.dataType == "file") {
            p.slots.filterDropdown = "";
          } else {
            p.slots.filterDropdown = "filterDropdown";
          }
        }
        if (p.isCodeIndex) {
          p.slots.customRender = "link";
        } else {
          if (p.dataType) {
            p.slots.customRender = p.dataType;
          }
        }
      }

      if (p.dataSource) {
      } else {
        p.onFilter = (value, record) => {
          return true;
        };

        p.onFilterDropdownVisibleChange = (visible) => {
          if (visible) {
            setTimeout(() => {
              if (this.searchInput) {
                this.searchInput.focus();
              }
            }, 0);
          }
        };
      }
      return p;
    });
    cols = [].concat.apply(cols, tmp);
    const selectedColumns = [];
    for (let p of cols) {
      if (p.dataIndex && typeof p.isAddSelect == "undefined") {
        selectedColumns.push(p.dataIndex);
      }
    }
    this.fetchData = debounce(this.fetchData, 800);
    const maxHeight =
      (Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      ) *
        55) /
      100;

    return {
      confirmLoading: false,
      visible: false,
      maxHeight,
      data: [],
      selectedRowKeys: [],
      cols: cols,
      isClick: false,
      fetching: false,
      columns,
      isDisabled: false,
      typeChoose: "radio",
      typeData: ["Chọn một địa điểm", "Chọn nhiều địa điểm"],
      isKeepFilter: false,
      value: null,
      loading: this.loadingProp,
      params: { pageSize: 100, pageIndex: 1, filters: [] },
      pagination: {
        pageSize: 25,
      },
      title,
      formData: form,
      config: Model[camelCaseEntity],
      inputWidth: "width : 75%",
      fields,
      rules,
      headerTitle,
      camelCaseEntity,
      bodyStyleModal: {
        overflowX: "hidden",
      },
      wrapClassName: "form-full-screen",
      selectedColumns,
    };
  },
  created() {},
  watch: {
    show: {
      handler(val) {
        if (val == true) {
          this.fetchData();
        }
      },
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    reloadSelected() {
      this.selectedRowKeys = [];
      this.isDisabled = true;
    },
    renderList(text, column, key = "text") {
      let item = column?.dataSource?.find((p) => p.value == text);
      return item ? item[key] : (key = "color" ? "blue" : "");
    },
    renderBool(text, column, key = "text") {
      let item = column?.dataSource?.find((p) => p.value == text);
      return item ? item[key] : text;
    },
    reload(filter) {
      if (this.$refs.grid) {
        this.$refs.grid.reload(filter);
      }
    },
    customRow(record, index) {
      return {
        on: {
          click: (event) => {
            this.selectedRowKeys = [index];
            this.$emit("onSelectChange", {
              index: record.id,
              title: record.title,
              data: this.data,
              disabled: this.isDisabled,
            });
          },
        },
      };
    },
    setRowClassName(record, index) {
      return index === 0 ? "click-row-style" : "";
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      let data = [];
      selectedRowKeys.forEach((element, i) => {
        let item = this.data.find((p) => p.id == element);
        let target = this.cols.find((item) => item.isAddSelect == true);
        if (target) {
          item[target.dataIndex] = item[target.dataIndex]
            ? item[target.dataIndex]
            : 1;
        }
        data.push(item);
      });
      this.SET_DATA_TABLE(data);
    },
    ...mapMutations("onelogselect", {
      SET_DATA_TABLE: "SET_DATA_TABLE",
    }),

    convertPascalCase(title) {
      return title.replace(/(^\w|-\w)/g, function (text) {
        return text.replace(/-/, "").toUpperCase();
      });
    },
    fetchData(value) {
      if (!this.isKeepFilter) {
        this.data = [];
      }
      this.fetching = true;
      this.loading = true;
      this.filter = this.value;
      if (!this.isKeepFilter) {
        this.params.filters = [];
        if (value) {
          if (Array.isArray(value)) {
            this.params.ids = value;
          } else {
            this.params.filters = this.filters;
            this.params.filters.push({
              field: this.textField,
              value: value,
            });
          }
        }
      }
      if (this.filters.length != 0) {
        this.params.filters = this.filters;
      }
      this.params.columns = this.selectedColumns;
      let pa = {
        params: this.params,
      };
      axios
        .get(`${this.entity}`, pa)
        .then((response) => {
          this.data = response.data.data.items.map((item) => ({
            ...item,
            del_flag: 0,
          }));
          let target = this.cols.find((item) => item.isAddSelect == true);
          this.selectedRowKeys = [];

          if (target) {
            let dataSource = this.dataSource;
            // Nếu mà có lọc theo tham số truyền vào
            let filters = this.filters[0];
            let selectedRow = [];
            if (dataSource.length != 0) {
              if (filters.length != 0) {
                dataSource.forEach((element) => {
                  if (element[filters.field] == filters.value) {
                    selectedRow = element["lots"];
                  }
                });
              }
            }
            if (selectedRow.length != 0) {
              selectedRow.forEach((element) => {
                this.data.forEach((item, index) => {
                  if (element.id == item.id) {
                    item[target.dataIndex] = element[target.dataIndex];
                  }
                });
              });
              this.SET_DATA_TABLE(selectedRow);
              this.selectedRowKeys = selectedRow
                .filter((p) => p.del_flag != 1)
                .map((item) => item.id);
            } else {
              this.data.forEach((item, index) => {
                item[target.dataIndex] = 0;
                item.key = index;
              });
            }
          }

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error.message);
        });
    },
    newAdd() {
      this.id = null;
      if (this.$refs.detail) {
        this.$refs.detail.$refs.ruleForm.resetFields();
      }
      this.formData = this.generateFormData(this.config);
      this.formData["mode"] = "add";
      if (Object.keys(this.fillField).length != 0) {
        let data = this.fillField.dataItem;
        for (let prop in this.config) {
          let config = this.config[prop];
          if (config.relation) {
            this.formData[config.relation] = {
              key: data[config.relation + "_id"] || "",
              label: data["name_of_" + config.relation + "_id"] || "",
            };
            this.formData["is_disable_" + config.relation] = true;

            // Disabled o-select value fill
          }
        }
      }
      if (this.$refs.detail) {
        this.$refs.detail.form = this.formData;
      }
      if (this.$refs.detail && this.$refs.detail.relationForm) {
        for (let prop in this.$refs.detail.relationForm) {
          this.$refs.detail.relationForm[prop] = [];
        }
      }
      this.visible = true;
    },
    handleOk() {
      this.$refs.detail.$refs.ruleForm.validate().then(() => {
        this.confirmLoading = true;
        try {
          let form = JSON.parse(JSON.stringify(this.$refs.detail.form));

          if (this.id) {
            form.id = this.id;
          }
          for (let prop in form) {
            for (let propConfig in this.config) {
              if (this.config[propConfig].relation == prop) {
                form[prop + "_id"] = form[prop]["key"];
                delete form[prop];
              }
            }
            if (this.config[prop] && this.config[prop].dataType) {
              if (this.config[prop].dataType == "time") {
                form[prop] = moment(form[prop]).format("H:mm:ss");
              }
            }
          }
          if (this.$refs.detail.relationForm) {
            for (let prop in this.$refs.detail.relationForm) {
              form[prop] = JSON.parse(
                JSON.stringify(this.$refs.detail.relationForm[prop])
              );
            }
          }
          axios
            .post(`${this.entity}`, form)
            .then((response) => {
              this.confirmLoading = false;
              if (response.data.errorCode != 0) {
                if (Array.isArray(response.data.errorMessage)) {
                  this.$message.error(
                    response.data.errorMessage
                      .map((p) => p.errorMessage)
                      .join("\n")
                  );
                } else {
                  this.$message.error(response.data.errorMessage);
                }
                return false;
              }
              this.reload();

              this.visible = false;
              this.$message.success(
                this.$t("common.save_success", {
                  entity: this.$t(`${this.camelCaseEntity}.name`),
                })
              );
            })
            .catch((error) => {
              this.confirmLoading = false;
              this.$message.error(error.message);
            });
        } catch (err) {
          this.$message.error(err);
        }
      });
    },
    reload() {
      this.fetchData();
      setTimeout(() => {
        this.selectedRowKeys = [];
      }, 0);
    },
    handleCancel() {
      this.visible = false;
    },
    onChangeQuantity(e, dataIndex, record, index, column) {
      const data = [...this.data_selected];
      let target = data.find((item, i) => i === index);
      // if (target) {
      //   target[dataIndex] = e;
      // }
      this.SET_DATA_TABLE(data);
    },
  },
  computed: {
    formComponent() {
      let instance = _.replace(_.startCase(_.camelCase(this.entity)), " ", "");
      return defineAsyncComponent(() =>
        import("@/views/" + instance + "/Form.vue")
      );
    },
    rowSelection() {
      const { selectedRowKeys } = this;
      if (this.mode == "multiple") {
        this.typeChoose = "checkbox";
      }
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        type: this.typeChoose,
        hideDefaultSelections: true,
      };
    },
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    detail() {
      switch (this.entity) {
        case "location":
          return Location;
      }
    },
    ...mapState({
      selected_rows(state, getters) {
        return state["lot"].selected_rows;
      },
    }),
    ...mapGetters("selectedProduct", {
      dataSource: "dataSource",
    }),
    ...mapGetters("onelogselect", {
      data_selected: "data_selected",
    }),
  },
});
</script>
<style lang="scss">
.form-full-screen {
  .ant-modal,
  .ant-modal-content {
    height: 100vh;
    min-width: 600px;
    margin: 0;
    top: 0;
  }
  .ant-modal-body {
    height: calc(100vh - 110px);
    overflow: auto;
    background-color: #f0f1f1;
  }
  .ant-modal-header {
    border-bottom: 0;
    .ant-modal-title {
      font-weight: bold !important;
    }
  }
}
</style>
<style scoped lang="scss">
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

/* .ant-table-body {
  max-height: 50vh;
} */

.wrapper-content {
  text-align: center;
}

.search-heading {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
}

.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.choose-type {
  flex: 1;
  display: flex;
}

.ant-table td {
  white-space: nowrap;
}
.header-left {
  display: flex;
  align-items: center;
}
.btn-submit {
  background: #00885a;
  border-color: #00885a;
  width: 120px;
  color: #fff;
}
.btn-cancel {
  border: unset;
}
</style>