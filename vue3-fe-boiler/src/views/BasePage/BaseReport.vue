<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    :title="title"
    @back="() => $router.go(-1)"
  >
    <template v-slot:extra>
      <a-button v-if="isSupport" @click="handleSupport">
        {{ $t("report.attribute.support") }}</a-button
      >
      <a-button v-if="isPrint" @click="handlePrint">
        {{ $t("report.attribute.print") }}</a-button
      >
      <a-button
        v-if="isExport"
        type="primary"
        :loading="loadingExport"
        @click="handleExport"
      >
        {{ $t("report.attribute.export") }}</a-button
      >
    </template>
  </a-page-header>
  <a-skeleton active v-if="loading" />
  <a-row v-if="!loading">
    <a-col class="container" :span="24">
      <a-row :gutter="[8, 24]" justify="space-between">
        <a-col>
          <a-row :gutter="[8, 0]" align="middle">
            <a-col>
              <span>{{ $t("common.import.time") }}: </span>
            </a-col>
            <a-col>
              <a-range-picker
                v-model:value="dateDefault"
                :format="dateFormat"
                :allowClear="false"
                :style="{
                  width: '220px',
                  display: 'inline-flex',
                  margin: '0 8px',
                }"
                @change="onChangeRange"
            /></a-col>
            <a-col>
              <a-button @click="openFilterModal">
                {{ $t("report.attribute.filter") }}</a-button
              ></a-col
            >
          </a-row>
        </a-col>
        <a-col>
          <a-dropdown
            @click="openCustomModal"
            :trigger="['click']"
            :visible="isCustomOption"
          >
            <a-button>
              {{ $t("report.attribute.custom") }}
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item
                  v-for="column in columnConfigs"
                  :key="column.dataField"
                >
                  <a-checkbox
                    :checked="column.is_checked == 1 ? true : false"
                    @change="handleChangeVisible(column)"
                  >
                    {{ column.title }}</a-checkbox
                  >
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="apply"
                  ><a-button @click="apply" type="primary">{{
                    $t("common.apply")
                  }}</a-button></a-menu-item
                >
                <a-menu-divider />
                <a-menu-item key="reset"
                  ><a-button @click="reset">{{
                    $t("common.reset")
                  }}</a-button></a-menu-item
                >
              </a-menu>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-row :gutter="[16, 24]" align="middle">
        <a-col :span="24">
          <span class="filter_by">{{ $t("report.attribute.filter_by") }}:</span>
          <template v-for="(item, key) in conditions" :key="item">
            <a-tag
              v-if="item && item.key && item.tagName"
              closable
              @close="closeTag(key)"
            >
              <span>{{
                $t(`${category}.attribute.${entity}.attribute.${key}`) +
                ": " +
                item.tagName
              }}</span>
            </a-tag>
          </template>
        </a-col>
      </a-row>
      <a-row :gutter="[16, 24]">
        <a-col :span="24">
          <a-row :gutter="[0, 16]">
            <a-col :span="24" style="overflow-x: auto">
              <table
                class="table-report table-report-base dataTable no-footer"
                id="table-report"
              >
                <thead>
                  <tr>
                    <template
                      v-for="(column, index) in dynamicColumn.column"
                      :key="index"
                    >
                      <th
                        :rowspan="column.rowspan"
                        :colspan="column.colspan"
                        class="text-center"
                        :style="{ width: column.width + 'px' }"
                      >
                        <span>{{ column.name }}</span>
                      </th>
                    </template>
                  </tr>
                  <tr>
                    <template
                      v-for="(i, index) in dynamicColumn.childDynamicCol"
                      :key="index"
                    >
                      <th
                        v-for="(element, index) in dynamicColumn.childDynamic"
                        :key="index"
                        :style="{ width: element.width + 'px' }"
                        class="text-center"
                      >
                        <span>{{ element.name }}</span>
                      </th>
                    </template>
                    <template
                      v-for="(i, index) in dynamicColumn.column"
                      :key="index"
                    >
                      <template v-if="i.group.length > 0">
                        <th
                          v-for="(element, index) in i.group"
                          :key="index"
                          :style="{ width: element.width + 'px' }"
                          class="text-center"
                        >
                          {{ element }}
                        </th>
                      </template>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-if="reportData !== null || reportData?.length > 0"
                  >
                    <tr v-for="data in reportData" :key="data.id">
                      <template
                        v-for="column in columnConfigs"
                        :key="column.data_field"
                      >
                        <td
                          v-if="
                            column.dynamic_data == null &&
                            column.parent_group_name == null &&
                            column.visible == 1
                          "
                          :class="'text-' + wrapClass(column.data_type)"
                        >
                          <a-tooltip placement="topLeft">
                            <template #title>
                              {{
                                data[column.data_field]
                                  ? dataType(
                                      data[column.data_field],
                                      column.data_type
                                    )
                                  : "-"
                              }}</template
                            >
                            {{
                              data[column.data_field]
                                ? dataType(
                                    data[column.data_field],
                                    column.data_type
                                  )
                                : "-"
                            }}
                          </a-tooltip>
                        </td>
                      </template>
                      <template
                        v-for="(i, index) in dynamicColumn.childDynamicCol"
                        :key="index"
                      >
                        <template
                          v-for="column in columnConfigs"
                          :key="column.data_field"
                        >
                          <td
                            :class="'text-' + wrapClass(column.data_type)"
                            v-if="
                              column.dynamic_data !== null &&
                              column.parent_group_name == null &&
                              column.visible == 1
                            "
                          >
                            <a-tooltip placement="topLeft">
                              <template #title>
                                {{
                                  data[i.id + "_" + column.data_field]
                                    ? data[i.id + "_" + column.data_field]
                                    : "-"
                                }}</template
                              >
                              {{
                                data[i.id + "_" + column.data_field]
                                  ? data[i.id + "_" + column.data_field]
                                  : "-"
                              }}</a-tooltip
                            >
                          </td>
                        </template>
                      </template>

                      <template
                        v-for="column in columnConfigs"
                        :key="column.data_field"
                      >
                        <td
                          v-if="
                            column.dynamic_data == null &&
                            column.parent_group_name !== null &&
                            column.visible == 1
                          "
                          :class="'text-' + wrapClass(column.data_type)"
                        >
                          <a-tooltip placement="topLeft">
                            <template #title>
                              {{
                                data[column.data_field]
                                  ? data[column.data_field]
                                  : "-"
                              }}</template
                            >
                            {{
                              data[column.data_field]
                                ? data[column.data_field]
                                : "-"
                            }}</a-tooltip
                          >
                        </td>
                      </template>
                    </tr>
                    <tr v-if="reportData?.length > 0" class="row-summary">
                      <td
                        :colspan="dynamicColumn.colspanTotal"
                        class="text-left"
                      >
                        Tổng :
                        {{
                          reportSummary || reportSummary !== null
                            ? reportSummary?.total_count
                            : 0
                        }}
                      </td>
                      <template
                        v-for="(i, index) in dynamicColumn.childDynamicCol"
                        :key="index"
                      >
                        <template
                          v-for="column in columnConfigs"
                          :key="column.data_field"
                        >
                          <td
                            :class="'text-' + wrapClass(column.data_type)"
                            v-if="
                              column.dynamic_data !== null &&
                              column.parent_group_name == null &&
                              column.visible == 1
                            "
                          >
                            {{
                              reportSummary[i.id + "_" + column.data_field]
                                ? reportSummary[i.id + "_" + column.data_field]
                                : "-"
                            }}
                          </td>
                        </template>
                      </template>
                      <template
                        v-for="column in columnConfigs"
                        :key="column.data_field"
                      >
                        <td
                          :class="'text-' + wrapClass(column.data_type)"
                          v-if="
                            column.dynamic_data == null &&
                            column.parent_group_name !== null &&
                            column.visible == 1
                          "
                        >
                          {{
                            reportSummary[column.data_field]
                              ? reportSummary[column.data_field]
                              : "-"
                          }}
                        </td>
                      </template>
                    </tr>
                  </template>
                  <template v-if="reportData == null || reportData.length == 0">
                    <tr>
                      <td :colspan="dynamicColumn.totalCol">
                        <a-empty>
                          <template #description>
                            <span>
                              {{ $t("common.empty") }}
                            </span>
                          </template>
                        </a-empty>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </a-col>
            <a-col :span="24">
              <a-pagination
                v-if="reportData?.length > 0"
                v-model:current="currentPage"
                :total="totalCount"
                :pageSize="paseSize"
                defaultPageSize="50"
                :size="sizeOfPage"
                :show-total="
                  (total) =>
                    `${$t('common.import.show_result_from')} ${pageRange} ${$t(
                      'common.import.per_total'
                    )} ${totalCount ? totalCount : 0} `
                "
                @change="changePage"
                show-less-items
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>

      <a-modal
        :title="title"
        v-model:visible="filterVisible"
        centered
        :okText="$t(`${category}.common.filter`)"
        :ok-button-props="{
          style: {
            background: '#00885a',
            borderColor: '#00885a',
            width: '120px',
          },
        }"
        :cancelText="$t(`${category}.common.cancel`)"
        :cancel-button-props="{
          style: { border: 'none' },
        }"
        @ok="handleFilter"
        @cancel="handleCancel"
        :width="widthModal"
        :bodyStyle="bodyStyleModal"
        :wrapClassName="wrapClassName"
      >
        <template #footer>
          <a-button key="cancel" @click="handleCancel">{{
            $t(`${category}.common.cancel`)
          }}</a-button>
          <a-button
            key="filter"
            type="primary"
            :loading="loading"
            @click="handleFilter"
          >
            <FilterFilled />{{ $t(`${category}.common.filter`) }}</a-button
          >
        </template>
        <component
          :is="filterComponent"
          ref="filterForm"
          :entity="entity"
          :tagName="tagName"
          :conditions="conditions"
          :filterVisible="filterVisible"
          :fields="fields"
          :rules="rules"
        ></component>
      </a-modal>
      <a-modal
        :title="title"
        v-model:visible="supportVisible"
        centered
        width="600px"
        cancelText="Thoát"
        @ok="handleSupportOk"
        @cancel="handleSupportOk"
        :cancel-button-props="{
          style: { border: 'none' },
        }"
      >
        <component :is="supportComponent"></component>
      </a-modal>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import {
  ArrowRightOutlined,
  EditOutlined,
  CheckOutlined,
  DownOutlined,
  FilterFilled,
} from "@ant-design/icons-vue";
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  computed,
  onMounted,
  watch,
  reactive,
} from "vue";
import { useStore } from "vuex";
import * as _ from "lodash";
import moment, { Moment } from "moment";
import utility from "@/utility";
import ReportService from "@/services/ReportService";
import FileSaver from "file-saver";
import { forEach } from "lodash";
import i18n from "@/lang";
import { formatDate, formatNumber } from "@/utility";
const filterForm: any = ref();
const { t } = i18n.global;
const store = useStore();
const filterVisible = ref<boolean>(false);
const supportVisible = ref<boolean>(false);
const conditions = ref<any>({});
const dateFormat = ref<string>("DD/MM/YYYY");
const currentPage = ref<number>(1);
const pageSize = ref<number>(5);
const sizeOfPage = ref<string>("small");
const loadingExport = ref<boolean>(false);
const dateDefault = ref<Moment[]>([
  moment().startOf("month"),
  moment().endOf("month"),
]);
const tagName = ref<string | null>(null);
const isCustomOption = ref<boolean>(false);
interface Payload {
  type: string;
  category: string;
}
interface Props {
  entity: string;
  category: string;
  isPrint: boolean;
  isExport: boolean;
  isSupport: boolean;
  defaultParam: any;
  defaultValue: string;
}
const props = withDefaults(defineProps<Props>(), {
  entity: "",
  category: "",
  isPrint: false,
  isExport: true,
  isSupport: true,
  defaultParam: [],
  defaultValue: "",
});
const filterComponent = computed(() => {
  let instance = _.startCase(_.camelCase(props.entity)).replaceAll(" ", "");
  let folder = _.startCase(props.category);
  return defineAsyncComponent(
    () => import(`@/views/Report/${folder}/${instance}/Filter.vue`)
  );
});
const supportComponent = computed(() => {
  let instance = _.replace(_.startCase(_.camelCase(props.entity)), " ", "");
  let folder = _.startCase(props.category);
  return defineAsyncComponent(
    () => import(`@/views/Report/${folder}/${instance}/Support.vue`)
  );
});
const title = computed(() => {
  return t(`${props.category}.attribute.${props.entity}.name`);
});
const loading = computed(() => store.state.report.loading);
const reportObject = computed(() => store.state.report.reportObject);
const reportData = computed(() => store.state.report.reportData);
const reportSummary = computed(() => store.state.report.reportSummary);
const is_pagination = computed<boolean>(() => store.state.report.is_pagination);
const columnConfigs = computed(() => store.getters["report/columnConfigs"]);
const paramValue = computed(() => store.getters["report/paramValue"]);
const hasSummaryData = computed(() => store.getters["report/hasSummaryData"]);
const dynamicColumn = computed(() => store.getters["report/dynamicColumn"]);
const totalCount = computed(() => store.getters["report/totalCount"]);
const pageRange = computed(() => {
  if (reportData.value?.length) {
    let begin: number = pageSize.value * (currentPage.value - 1) + 1;
    let last: number = 0;
    if (reportData.value?.length < pageSize.value) {
      last = reportData.value?.length;
    } else {
      last = begin + reportData.value?.length;
    }
    return begin + "-" + last;
  } else {
    return t(`common.empty`);
  }
});
onMounted(() => {
  if (props.defaultParam.length > 0) {
    const [{ key, value }] = props.defaultParam;
    conditions.value[props.defaultValue] = {
      key: key,
      label: value,
      value: key,
      tagName: value,
    };
    const payload: Payload = {
      type: props.entity,
      category: props.category,
    };
    getItem(payload).then(() => {
      paramValue.value.page_size = pageSize.value;
      paramValue.value.page_index = currentPage.value;
      paramValue.value[props.defaultValue + "_ids"] =
        conditions.value[props.defaultValue].key;

      paramValue.value.from_date = dateDefault.value[0].format("YYYY-MM-DD");
      paramValue.value.to_date = dateDefault.value[1].format("YYYY-MM-DD");
      paramValue.value.is_get_summary = 0;

      getReportData({
        type: props.entity,
        report_category: props.category,
        has_summary_data: hasSummaryData.value,
        param_values: paramValue.value,
      });
    });
  }
});

const getItem = (payload: Payload) => {
  return store.dispatch("report/getItem", payload);
};
const saveColumnConfigs = (payload: Array<object>) => {
  return store.dispatch("report/saveColumnConfigs", payload);
};
const resetColumnConfigs = (payload: Array<object>) => {
  return store.dispatch("report/resetColumnConfigs", payload);
};
const getReportData = (payload: Object) => {
  return store.dispatch("report/getReportData", payload);
};
const exportExcel = (payload: Array<object>) => {
  return store.dispatch("report/exportExcel", payload);
};
const changePage = (page: number, pageSize: number) => {
  handleFilter();
};
const wrapClass = (data_type: string) => {
  let wrapClass = "left";
  switch (data_type) {
    case "number":
      wrapClass = "right";
      break;
    case "date":
    case "date_time":
    case "time":
      wrapClass = "center";
      break;
    default:
      wrapClass = "left";
      break;
  }
  return wrapClass;
};
const dataType = (data: any, data_type: string) => {
  let dataType: any = data;
  switch (data_type) {
    case "number":
      dataType = formatNumber(data);
      break;
    case "date":
    case "date_time":
    case "time":
      dataType = formatDate(data);
      break;
    default:
      dataType = data;
      break;
  }
  return dataType;
};
// handlePrint() {},
const handleExport = () => {
  loadingExport.value = true;
  const payload: any = genFilter();
  exportExcel(payload).then((response) => {
    let fileName =
      t(`${props.category}.attribute.${props.entity}.name`) +
      `_` +
      formatDate(moment()) +
      `.xlsx`;
    FileSaver.saveAs(new Blob([response.data]), fileName);
  });
  loadingExport.value = false;
};
const handleSupport = () => {
  supportVisible.value = true;
};
const handleSupportOk = () => {
  supportVisible.value = false;
};
const handleCancel = () => {
  let payload = genFilter().param_values;
  for (let prop in conditions.value) {
    payload[prop] = conditions.value[prop];
  }
  filterVisible.value = false;
};
const handleFilter = () => {
  ;
  setLoading(true);
  const payload = genFilter();
  getReportData(payload);
  if (payload.param_values[props.defaultValue]) {
    conditions.value = JSON.parse(JSON.stringify(payload.param_values));
  }
  filterVisible.value = false;
  // console.log(reportData)
  setLoading(false);
};
const openFilterModal = () => {
  let payload = genFilter().param_values;
  for (let prop in conditions.value) {
    payload[prop] = conditions.value[prop];
  }
  filterVisible.value = true;
};
const onChangeRange = (range: Moment[]) => {
  handleFilter();
};

const genFilter = () => {
  ;
  const filters = filterForm.value?.formState
    ? filterForm.value?.formState
    : paramValue.value;
  filters.page_index = currentPage.value;
  filters.page_size = pageSize.value;
  filters.from_date = dateDefault.value[0].format("YYYY-MM-DD");
  filters.to_date = dateDefault.value[1].format("YYYY-MM-DD");
  const payload = {
    type: props.entity,
    report_category: props.category,
    has_summary_data: hasSummaryData.value,
    param_values: filters,
  };
  return payload;
};
const openCustomModal = () => {
  isCustomOption.value = !isCustomOption.value;
};
const handleChangeVisible = (column: any) => {
  if (column.is_checked == 1) {
    column.is_checked = 0;
  } else {
    column.is_checked = 1;
  }
};
const apply = () => {
  columnConfigs.value.forEach(function (element: any) {
    element.visible = element.is_checked;
  });
  let payload: any = { column_configs: columnConfigs };
  saveColumnConfigs(payload);
  isCustomOption.value = false;
};
const reset = () => {
  let payload: any = { type: props.entity, report_category: props.category };
  resetColumnConfigs(payload);
  isCustomOption.value = false;
};
const setLoading = async (data: boolean) => {
  await store.commit("report/SET_LOADING", data);
};
const closeTag = (key: string) => {
  setLoading(true);
  tagName.value = key;
  let payload = genFilter();
  payload.param_values[key + "_ids"] = "";
  payload.param_values[key] = {
    key: null,
    value: null,
    tagName: null,
    label: null,
  };
  conditions.value[key + "_ids"] = "";
  conditions.value[key] = {
    key: null,
    value: null,
    tagName: null,
    label: null,
  };
  getReportData(payload);
  setLoading(false);
};
</script>

<style lang="scss" scoped>
.container {
  padding: 24px;
  background: #fff;
}
.ant-btn:hover {
  border-color: var(--mainColor);
  color: var(--mainColor);
}
.ant-btn:focus {
  border-color: var(--mainColor);
  color: var(--mainColor);
}
.ant-btn-primary {
  color: white;
  background: var(--mainColor);
  border-color: var(--mainColor);
}
.ant-btn-primary:hover {
  border-color: var(--mainColor);
  color: white;
}
.ant-btn-primary:focus {
  border-color: var(--mainColor);
  color: white;
}
.ant-pagination {
  :deep(.ant-pagination-item-active) {
    border-color: var(--mainColor);
    a {
      border-color: var(--mainColor);
      color: var(--mainColor);
    }
  }
  :deep(.ant-pagination-item:hover) {
    border-color: var(--mainColor);
    color: var(--mainColor);
    a {
      border-color: var(--mainColor);
      color: var(--mainColor);
    }
  }
  :deep(.ant-pagination-next) {
    border-color: var(--mainColor);
    .ant-pagination-item-link:hover {
      border-color: var(--mainColor);
      color: var(--mainColor);
    }
  }
  :deep(.ant-pagination-next:focus) {
    border-color: var(--mainColor);
    a {
      border-color: var(--mainColor);
      color: var(--mainColor);
    }
  }
  :deep(.ant-pagination-next:hover) {
    border-color: var(--mainColor);
    .ant-pagination-item-link {
      border-color: var(--mainColor);
      color: var(--mainColor);
    }
  }
}
.ant-calendar-picker {
  a {
    color: var(--mainColor);
  }
  :deep(.ant-input:hover) {
    border-color: var(--mainColor);
  }
}
.ant-calendar-picker-container {
  color: red;
}
.text-center {
  padding: 8px 8px;
  text-align: center;

  overflow: hidden;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}
.text-left {
  text-align: left;
  padding: 8px 8px;

  overflow: hidden;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}
.text-right {
  text-align: right;
  padding: 8px 8px;

  overflow: hidden;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
}
.table-report-base {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: #212b35;
  font-size: 1.3rem;
}
.table-report-base {
  color: #000;
  border: 1px solid #f0f0f0;
}

.table-report-base thead tr {
  height: 35px;
}
.row-summary {
  font-weight: 700;
}
.table-report-base thead tr .first-total-th {
  border-left: 1px solid #dbdcde;
}

.table-report-base thead tr .total-th {
  border-right: 1px solid #dbdcde;
  border-bottom: 1px solid #dbdcde;
}

.table-report-base thead tr .quantity-th {
  min-width: 80px;
  width: 80px;
  white-space: normal;
}

.table-report-base thead tr .amount-th {
  min-width: 100px;
  width: 100px;
}

.table-report-base thead tr th {
  background: #3d73a2;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0;
  border-right: 1px solid #fff;
  white-space: nowrap;
  border-bottom: 1px solid #ebeef0;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ant-dropdown-menu-vertical {
  .ant-btn,
  .ant-btn-primary {
    width: 100%;
  }
}
.ant-tag {
  margin-right: 4px;
}
.filter_by {
  margin-right: 8px;
}
.table-report-base thead tr th i.fa.fa-info {
  top: -3px;
  color: #fff;
  border-color: #fff;
  left: 0;
}
.table-report-base tbody tr .quantity-td {
  min-width: 80px;
  width: 80px;
}

.table-report-base tbody tr .code-td {
  min-width: 110px;
  width: 110px;
}

.table-report-base tbody tr .amount-td {
  min-width: 100px;
  width: 100px;
}

.table-report-base tbody tr .name-td {
  min-width: 200px;
  width: 200px;
}

.table-report-base tbody tr .first-td {
  border-left: 1px solid #dbdcde;
}

.table-report-base tbody tr td {
  border-right: 1px solid #dbdcde;
  border-bottom: 1px solid #dbdcde;
  font-size: 13px;
}

.table-report-base tbody tr:hover td {
  background: #fff;
}
.table-report-base tbody tr:nth-child(odd):hover td,
.table-report-base tbody tr:nth-child(odd) td {
  background: #f6f6f6;
}

.table-report-base tbody tr .td-variant-name {
  vertical-align: top;
}

.table-report-base tbody tr .td-variant-name div {
  white-space: normal;
}
</style>
<style lang="scss">
.tbl-guide-base {
  font-size: 13px;
  margin-bottom: 5px;
}

.tbl-guide-base thead {
  width: 100%;
}

.tbl-guide-base thead tr {
  display: block;
}

.tbl-guide-base thead tr th {
  border: 1px solid #94a8b5;
  background-color: #3d73a2;
  font-weight: 500;
  color: #fff;
  vertical-align: middle;
  text-align: center;
  padding-left: 5px;
  height: 35px;
}

.tbl-guide-base tbody {
  height: 490px;
  overflow: auto;
  display: block;
  width: 100%;
}

.tbl-guide-base .td-content-title {
  border: 1px solid #ddd;
  border-left: none;
  vertical-align: middle;
  padding: 10px;
  width: 200px;
}

.tbl-guide-base .td-content-description {
  border: 1px solid #ddd;
  padding: 10px;
  border-right: none;
  vertical-align: middle;
}
</style>
