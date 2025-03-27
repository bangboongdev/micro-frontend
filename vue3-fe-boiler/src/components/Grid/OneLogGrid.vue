<template>
  <a-config-provider>
    <template #renderEmpty>
      <a-empty>
        <template #description>
          <span>
            {{ $t("common.empty") }}
          </span>
        </template>
        <a-button type="primary" v-if="isAdd">
          <template #icon> <PlusOutlined /> </template
          >{{
            $t("common.add", {
              entity: title,
            })
          }}</a-button
        >
      </a-empty>
    </template>
    <a-table
      :scroll="{ x: 1500, y: 700 }"
      :columns="defaultColumns.columns?.length > 0 ? cols : colsPreventive"
      :locale="{
        filterConfirm: $t('common.filter'),
        filterReset: $t('common.cancel'),
      }"
      :row-key="(record) => record.id"
      :row-selection="{
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
      }"
      :data-source="dataTable?.data?.items"
      :loading="tableLoading"
      :pagination="false"
      :indentSize="8"
      @change="handleTableChange"
    >
      <template #link="{ text, record }">
        <a
          @click="() => openRecord(record)"
          @contextmenu="handleRightClick($event, record)"
          >{{ text }}</a
        >
      </template>
      <template #date="{ text }">{{
        text == null ? "--" : formatDate(text)
      }}</template>
      <template #datetime="{ text }">{{
        text == null ? "--" : formatDateTimeVN(text)
      }}</template>
      <template #time="{ text }">{{ text }}</template>
      <template #number="{ text }"
        ><strong>{{ formatNumber(text) }}</strong></template
      >
      <template #icon="{}">
        <!-- format fileid to icon  -->
        <a-button v-if="isDownload" @click="handleDownload"
          ><DownloadOutlined />
        </a-button>
      </template>
      <template #email="{ text }">
        <a :href="'mailto:' + text">
          <a-tooltip :title="text" placement="topLeft">
            {{ text }}
          </a-tooltip>
        </a>
      </template>
      <template #image="{ text }">
        <img
          width="48"
          height="48"
          v-bind:src="getImage(text)"
          alt="image"
          v-if="text"
        />
      </template>
      <template #phone="{ text }">
        <a :href="'tel:' + text">{{ text }}</a>
      </template>
      <template #list="{ text, column }">
        <a-tooltip :title="renderList(text, column)" placement="topLeft">
          <a-tag :color="renderList(text, column, 'color')">
            {{ renderList(text, column) }}
          </a-tag>
        </a-tooltip>
      </template>
      <template #bool="{ text, column }">
        {{ renderBool(text, column) }}
      </template>
      <template #multiple-list="{ text }">
        <a-tag v-for="item in renderMultipleList(text)" :key="item">
          <a-tooltip :title="item" placement="topLeft">
            {{ item.toUpperCase() }}
          </a-tooltip>
        </a-tag>
      </template>
      <template #text="{ text }">
        <a-tooltip :title="text" placement="topLeft">
          {{ text }}
        </a-tooltip>
      </template>
      <template #file="{ text }">
        <img v-if="text" :src="text" alt="file" width="36" height="36"
      /></template>
      <template
        #filterDate="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-date-picker
            :locale="locale"
            :value="selectedKeys[0]"
            @change="
              (e) => {
                setSelectedKeys(e ? [e] : []);
              }
            "
            type="date"
            format="DD-MM-YYYY"
            style="width: 100%"
          />
        </div>
        <div style="padding: 0 8px 8px">
          <a-button
            type="primary"
            size="small"
            style="width: 120px; margin-right: 8px"
            @click="
              () => handleSearchDate(selectedKeys, confirm, column.dataIndex)
            "
          >
            <template #icon><SearchOutlined /></template>
            {{ $t("common.search") }}
          </a-button>
          <a-button
            size="small"
            style="width: 120px"
            @click="
              () => handleReset(selectedKeys, clearFilters, column.dataIndex)
            "
          >
            {{ $t("common.cancel") }}
          </a-button>
        </div>
      </template>
      <template
        #filterDropdown="{
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          column,
        }"
      >
        <div style="padding: 8px">
          <a-input
            ref="searchInput"
            :placeholder="`Tìm kiếm`"
            :value="selectedKeys[0]"
            style="width: 250px; margin-bottom: 8px; display: block"
            @change="
              (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
            "
            @pressEnter="
              () => handleSearch(selectedKeys, confirm, column.dataIndex)
            "
          />
          <a-button
            type="primary"
            size="small"
            style="width: 120px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><SearchOutlined /></template>
            {{ $t("common.filter") }}
          </a-button>
          <a-button
            size="small"
            style="width: 120px"
            @click="
              () => handleReset(selectedKeys, clearFilters, column.dataIndex)
            "
          >
            {{ $t("common.cancel") }}
          </a-button>
        </div>
      </template>
      <template #filterIcon="filtered">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #action="{ record }">
        <EditOutlined
          :style="{ color: '#3f51b5', marginRight: '8px' }"
          @click="() => showEdit(record)"
          v-permission:edit="entity"
        />
        <DeleteOutlined
          :style="{ color: '#ee6e73', marginRight: '8px' }"
          @click="() => showConfirm(record)"
          v-permission:delete="entity"
        />
      </template>
      <template #renderAction="{ record }">
        <a-tooltip placement="top">
          <template #title>
            <span> {{ $t("common.edit") }} </span>
          </template>
          <EditOutlined
            :style="{ color: '#3f51b5', marginRight: '8px' }"
            @click="() => showEdit(record)"
            v-permission:edit="entity"
          />
        </a-tooltip>
        <a-tooltip placement="top">
          <template #title>
            <span> {{ $t("common.copy") }}</span>
          </template>
          <CopyOutlined
            :style="{ color: '#66bb6a', marginRight: '8px' }"
            @click="() => showCopy(record)"
          />
        </a-tooltip>

        <a-tooltip placement="top">
          <template #title>
            <span>{{ $t("common.delete") }}</span>
          </template>
          <DeleteOutlined
            :style="{ color: '#ee6e73', marginRight: '8px' }"
            @click="() => showConfirm(record)"
            v-permission:delete="entity"
          />
        </a-tooltip>
        <!-- <a-tooltip placement="top">
            <template #title>
              <span>{{ $t("common.cancel") }}</span>
            </template>
            <StopOutlined
              :style="{ color: '#ee6e73', marginRight: '8px' }"
              @click="() => showCancel(record)"
            />
          </a-tooltip> -->
      </template>
      <template #customRender="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{ fragment }}</mark
            >
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </a-config-provider>
  <div class="pagination" v-if="dataTable?.data?.items?.length > 0">
    <a-pagination
      show-size-changer
      v-model="pagination.current"
      :showLessItems="pagination.showLessItems"
      :showTitle="pagination.showTitle"
      :size="pagination.size"
      :hideOnSinglePage="pagination.hideOnSinglePage"
      :page-size-options="pagination.pageSizeOptions"
      :total="dataTable?.data?.totalCount"
      :showTotal="
        (total, range) => `${range[0]}-${range[1]} / ${total} bản ghi `
      "
      :page-size="pagination.pageSize"
      @showSizeChange="onShowSizeChange"
      @change="onShowSizeChange"
    >
      <template #buildOptionText="props">
        <span>{{ props.value }} / {{ $t("common.page") }}</span>
      </template>
    </a-pagination>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import mixins from "@/mixins";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import camelCase from "lodash/camelCase";
import FileSaver from "file-saver";
import { formatDate, getImage, formatNumber } from "@/utility";
import { formatDateTimeVN } from "@/mixins.js";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  StopOutlined,
  FileImageOutlined,
  SwapOutlined,
  UserSwitchOutlined,
  EnterOutlined,
  PlusOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { useMutation, useQueryClient } from "vue-query";
import ImportHistoryService from "@/services/ImportHistoryService";
import i18n from "@/lang";
const { t } = i18n.global;
const store = useStore();
interface Paper {
  showLessItems: boolean;
  size: string;
  showTitle: boolean;
  hideOnSinglePage: boolean;
  showSizeChanger: boolean;
  pageSize: number;
  pageSizeOptions: string[];
  current?: number;
  showTotal: (total: any, range: any) => string;
}
const pager: Paper = {
  showLessItems: true,
  size: "small",
  showTitle: false,
  hideOnSinglePage: false,
  showSizeChanger: true,
  pageSize: 50,
  pageSizeOptions: ["10", "20", "50", "100"],
  showTotal: (total, range) =>
    `Hiển thị kết quả từ ${range[0]}-${range[1]} trên tổng ${total}`,
};

interface Props {
  defaultColumns: any;
  title: string;
  entity: string;
  columns: any;
  isAction: boolean;
  isPopup: boolean;
  isAutoLoad: boolean;
  isAdd: boolean;
  isDownload: boolean;
  dataTable: any;
  tableLoading: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  defaultColumns: [],
  title: "",
  entity: "",
  columns: [],
  isAction: true,
  isPopup: true,
  isAutoLoad: true,
  isAdd: true,
  isDownload: true,
  dataTable: {},
  tableLoading: false,
});
const emit = defineEmits<{
  (e: "emitRecord", record: any): void;
  (e: "openRecord", record: any): any;
  (e: "cancelRecord", record: any): void;
  (e: "editRecord", record: any): void;
  (e: "showAdvance", record: any): void;
  (e: "duplicateRecord", record: any): void;
  (e: "rightClick"): any;
  (e: "emitData", params: any): any;
  (e: "showConfirm", record: any): any;
}>();
const data = ref<any>(props.dataTable?.data?.items);
const cols = ref<any>([]);
const selectedColumns = ref<any>([]);
const searchedColumn = ref<any>([]);
const pagination = ref<Paper>(pager);
const selectedRows = ref<any>([]);
const filterGrids = ref<any>([]);
const searchText = ref<string>("");
const isFiltering = ref<boolean>(false);
const recordContext = ref<any>({});
const searchInput: any = ref();
watch(
  () => props.defaultColumns,
  (val: any) => {
    if (val) {
      let columns: any = [];
      if (props.isAction) {
        columns.unshift({
          title: t("common.action"),
          key: "operation",
          fixed: "left",
          width: 110,
          slots: { customRender: "action" },
        });
      } else {
        columns.unshift({
          title: t("common.action"),
          key: "operation",
          fixed: "left",
          width: 110,
          slots: { customRender: "renderAction" },
        });
      }
      if (val.columns !== undefined) {
        var tmp = val.columns.map((p: any) => {
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
            p.onFilter = (value: any, record: any) => {
              return true;
            };

            p.onFilterDropdownVisibleChange = (visible: any) => {
              if (visible) {
                setTimeout(() => {
                  if (searchInput.value) {
                    searchInput.value.focus();
                  }
                }, 0);
              }
            };
          }
          return p;
        });
      }

      columns = [].concat.apply(columns, tmp);
      cols.value = columns;
      selectedColumns.value = val.selectedColumns;
    }
  }
);
// dung cho nhung cot chua viet seeder

let colsPreventive = ref<any>([]);

if (props.isAction) {
  colsPreventive.value.push({
    title: t("common.action"),
    key: "operation",
    fixed: "left",
    width: 110,
    slots: { customRender: "action" },
  });
} else {
  colsPreventive.value.push({
    title: t("common.action"),
    key: "operation",
    fixed: "left",
    width: 110,
    slots: { customRender: "renderAction" },
  });
}
let tmp = props.columns.map((p: any) => {
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
    p.onFilter = (value: any, record: any) => {
      return true;
    };

    p.onFilterDropdownVisibleChange = (visible: any) => {
      if (visible) {
        setTimeout(() => {
          if (searchInput.value) {
            searchInput.value.focus();
          }
        }, 0);
      }
    };
  }
  return p;
});
colsPreventive.value = [].concat.apply(colsPreventive.value, tmp);
console.log(cols);
console.log(colsPreventive);
let selectedColumnPreventive: any = [];
for (let p of colsPreventive.value) {
  if (p.dataIndex && typeof p.isAddSelect == "undefined") {
    selectedColumnPreventive.push(p.dataIndex);
  }
}
const maxHeight = computed(
  () => store.state[camelCase(props.entity)].maxHeight
);
onMounted(() => {
  pagination.value.current = 1;
  if (props.isAutoLoad) {
    fetch({
      subFilters: [],
      filters: [],
    });
  }
});
const handleDate = (data: any) => {
  pagination.value.current = 1;
  fetch({
    subFilters: [],
    filters: [],
  });
};
const onShowSizeChange = (current: number, pageSize: number) => {
  pagination.value.pageSize = pageSize;
  pagination.value.current = current;
  handleTableChange({ current, pageSize }, [], []);
};
const actionRecord = (record: any, action: any) => {
  if (action.type == "edit") {
    showEdit(record);
  } else if (action.type == "delete") {
    showConfirm(record);
  } else {
    emit("emitRecord", {
      action: action.type,
      record: record,
    });
  }
};
const renderList = (text: any, column: any, key = "text") => {
  let item: any = column?.dataSource?.find((p: any) => p.value == text);
  return item ? item[key] : (key = "color" ? "blue" : "");
};
const renderBool = (text: any, column: any, key = "text") => {
  let item: any = column?.dataSource?.find((p: any) => p.value == text);
  return item ? item[key] : text;
};
const renderMultipleList = (text: any) => {
  return text ? text.split(",") : "";
};
const handleTableChange = (pagination: any, filters: any, sorter: any) => {
  if (isFiltering.value) return;
  for (let prop in filters) {
    filterGrids.value = filterGrids.value.filter((p: any) => p.field != prop);
    if (filters[prop]) {
      if (Array.isArray(filters[prop])) {
        if (filters[prop].length > 0) {
          filterGrids.value.push({
            field: prop,
            operator: "in",
            value: filters[prop],
          });
        }
      } else {
        filterGrids.value.push({
          field: prop,
          operator: "like",
          value: filters[prop],
        });
      }
    }
  }
  const pager = Object.assign({}, pagination.value);
  pager.current =
    typeof pagination.current !== "undefined"
      ? pagination.current
      : pagination.value?.current;
  pager.pageSize =
    typeof pagination.pageSize !== "undefined"
      ? pagination.pageSize
      : pagination.value?.pageSize;

  pagination.value = pager;

  fetch({
    sortField: sorter.field,
    sortOrder: sorter.order,
    // subFilters: subFilters,
    filters: filterGrids.value,
  });
};
const fetch = (params: any) => {
  const pa = JSON.parse(JSON.stringify(params));
  pa.pageSize = pagination.value.pageSize;
  pa.pageIndex = pagination.value.current;
  pa.columns =
    props.defaultColumns.selectedColumns?.length > 0
      ? selectedColumns.value
      : selectedColumnPreventive;
  pa.filters = pa.filters.map((p: any) => {
    let field = props.columns.find((x: any) => x.dataIndex === p.field);
    if (field) {
      p.field = field.originalIndex || field.dataIndex;
    }
    return p;
  });
  if (pa.subFilters) {
    pa.subFilters = pa.subFilters.map((p: any) => {
      let field = props.columns.find((x: any) => x.dataIndex === p.field);
      if (field) {
        p.field = field.originalIndex || field.dataIndex;
      }
      return p;
    });
  }
  emit("emitData", pa);
};
const reload = (filters?: any) => {
  if (filters) {
    if (Array.isArray(filters)) {
      filters.map((filter) => {
        let tmp_filter = filterGrids.value.find(
          (p: any) => p.field == filter.field
        );
        if (!tmp_filter) {
          filterGrids.value.push(filter);
        } else {
          tmp_filter.operator = filter.operator;
          tmp_filter.value = filter.value;
          tmp_filter.value1 = filter.value1;
        }
      });
    } else {
      let tmp_filter = filterGrids.value.find(
        (p: any) => p.field == filters.field
      );
      if (!tmp_filter) {
        filterGrids.value.push(filters);
      } else {
        tmp_filter.operator = filters.operator;
        tmp_filter.value = filters.value;
        tmp_filter.value1 = filters.value1;
      }
    }
  }
  pagination.value.current = 1;
  console.log(filterGrids.value);
  fetch({
    filters: filterGrids.value,
    // subFilters: subFilters,
  });
  setTimeout(() => {
    selectedRows.value = [];
    emit("showAdvance", selectedRows.value);
  }, 0);
};
const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  searchText.value = selectedKeys[0];
  searchedColumn.value = dataIndex;
  isFiltering.value = true;
  filterGrids.value = filterGrids.value.filter(
    (p: any) => p.field != dataIndex
  );

  filterGrids.value.push({
    field: dataIndex,
    value: selectedKeys[0],
  });
  reload();
};
const handleSearchDate = (selectedKeys: any, confirm: any, dataIndex: any) => {
  confirm();
  searchText.value = selectedKeys[0].format("DD-MM-YYYY");
  searchedColumn.value = dataIndex;
  isFiltering.value = true;
  filterGrids.value = filterGrids.value.filter(
    (p: any) => p.field != dataIndex
  );

  filterGrids.value.push({
    field: dataIndex,
    operator: "between",
    value: selectedKeys[0].format("YYYY-MM-DD 00:00:00"),
    value1: selectedKeys[0].format("YYYY-MM-DD 23:59:59"),
  });
  reload();
};
const handleReset = (selectedKeys: any, clearFilters: any, dataIndex: any) => {
  clearFilters();
  searchText.value = "";
  filterGrids.value = filterGrids.value.filter(
    (p: any) => p.field != dataIndex
  );
  reload();
};
const onSelectChange = (selectedRowKeys: any) => {
  selectedRows.value = selectedRowKeys;
  emit("showAdvance", selectedRows.value);
};
const openRecord = (record: any) => {
  emit("openRecord", record);
};
const handleRightClick = (e: any, record: any) => {
  e.preventDefault();
  // this.$refs.menu.open(e);
  recordContext.value = record;
};

const showEdit = (record: any) => {
  emit("editRecord", record);
};
const showCopy = (record: any) => {
  emit("duplicateRecord", record);
};
const showCancel = (record: any) => {
  emit("cancelRecord", record);
};
const showConfirm = (record: any) => {
  emit("showConfirm", record);
};

// const handleDownload = () => {
//   ImportHistoryService.downloadFile(id).then((response) => {
//     let fileName = "cau" + `_` + "cau" + `.xlsx`;
//     FileSaver.saveAs(new Blob(["cau"]), fileName);
//   });

//   // console.log(downloadFile);
// };
defineExpose({ reload, data });
</script>
<style lang="scss" scoped>
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
}

.text-bold {
  font-weight: 700 !important;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 8px;
}
:deep() .ant-table-thead > tr > th,
:deep() .ant-table-tbody > tr > td {
  padding: 10px !important;
}
:deep() thead.ant-table-thead > tr {
  height: unset !important;
}
.ant-table-wrapper {
  height: 76vh;
}
// :deep() .ant-table-body {
//   height: calc(100vh) !important;
// }
:deep() .ant-table-body .ant-table-placeholder {
  display: none;
}
.list-option {
  margin: 0;
  list-style: none;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0;
  border-radius: 4px;
  width: 200px;
  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    .sub-option {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }
    &:hover {
      background: #fafafa;
    }
  }
}
li.option-item.border-bottom {
  border-bottom: 1px solid #b3b3b3;
}
</style>
