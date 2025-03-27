<template>
  <div class="container">
    <a-row>
      <a-col :span="collapse ? 0 : 6" class="list">
        <a-col :span="24">
          <a-row
            class="header-list"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <a-col :span="2">
              <a-row type="flex" justify="start">
                <a-checkbox
                  :checked="checkAll"
                  :indeterminate="indeterminate"
                  @change="onCheckAllChange"
                >
                </a-checkbox>
              </a-row>
            </a-col>
            <a-col :span="20"
              ><a-input-search
                v-model:value="searchText"
                :placeholder="titleList"
                enter-button
                style="width: 100%"
                @search="handleSearch"
            /></a-col>
            <a-col :span="2">
              <a-row type="flex" justify="end">
                <a-tooltip placement="topLeft">
                  <template #title>{{ $t("common.advance_filter") }}</template>
                  <BarsOutlined
                    :style="{ fontSize: '24px', color: 'green' }"
                    @click="showAdvanceFilter"
                  />
                </a-tooltip>
                <a-modal
                  :visible="isAdvanceFilter"
                  :title="$t('common.advance_filter')"
                  centered
                  :cancelText="$t('common.cancel')"
                  :okText="$t('common.filter')"
                  @ok="handleAdvanceFilter"
                  @cancel="hideAdvanceFilter"
                >
                  <template v-for="(row, index) in rows" :key="index">
                    <a-row
                      :gutter="[0, 16]"
                      type="flex"
                      justify="space-around"
                      align="middle"
                      v-if="row.dataType == 'list' || row.dataType == 'bool'"
                    >
                      <a-col :span="7"
                        ><span>{{ row.title }}</span></a-col
                      >
                      <a-col :span="1">:</a-col>
                      <a-col :span="16">
                        <a-select
                          v-model:value="filterForm[row.dataIndex]"
                          mode="multiple"
                          style="width: 100%"
                          :placeholder="row.title"
                          :disabled="disabledFitterForm.includes(row.dataIndex)"
                        >
                          <template
                            v-for="select in row.dataSource"
                            :key="select.id"
                          >
                            <a-select-option
                              :value="select.value"
                              :title="select.text"
                            >
                              {{ select.text }}
                            </a-select-option>
                          </template>
                        </a-select></a-col
                      >
                    </a-row>
                    <a-row
                      :gutter="[0, 16]"
                      type="flex"
                      justify="space-around"
                      align="middle"
                      v-else-if="
                        (row.dataType == 'date' ||
                          row.dataType == 'datetime') &&
                        disabledFitterForm.includes(row.dataIndex) == false
                      "
                    >
                      <a-col :span="7"
                        ><span>{{ row.title }}</span></a-col
                      >
                      <a-col :span="1">:</a-col>
                      <a-col :span="16"
                        ><a-date-picker
                          v-model:value="filterForm[row.dataIndex]"
                          :placeholder="row.title"
                          :locale="locale"
                          format="DD/MM/YYYY"
                      /></a-col>
                    </a-row>
                    <a-row
                      :gutter="[0, 16]"
                      type="flex"
                      justify="space-around"
                      align="middle"
                      v-else-if="
                        disabledFitterForm.includes(row.dataIndex) == false
                      "
                    >
                      <a-col :span="7"
                        ><span>{{ row.title }}</span></a-col
                      >
                      <a-col :span="1">:</a-col>
                      <a-col :span="16"
                        ><a-input
                          v-model:value="filterForm[row.dataIndex]"
                          :placeholder="row.title"
                          @pressEnter="handleAdvanceFilter"
                      /></a-col>
                    </a-row>
                  </template>
                </a-modal>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
        <a-col :span="24">
          <a-spin :spinning="listLoading">
            <a-list
              item-layout="vertical"
              :data-source="data"
              :locale="{ emptyText: $t('common.empty') }"
            >
              <template #loadMore>
                <a-row
                  type="flex"
                  justify="center"
                  align="center"
                  v-if="data.length < dataList?.data?.totalCount"
                  :style="{ margin: '16px 0px' }"
                >
                  <a-col>
                    <a-button :disabled="listLoading" @click="loadMore()">{{
                      $t("common.load_more")
                    }}</a-button>
                  </a-col>
                </a-row>
              </template>
              <template #renderItem="{ item }">
                <a-list-item
                  @click="getDetail(item)"
                  :class="itemActive(item.id)"
                >
                  <a-list-item-meta>
                    <template #avatar>
                      <a-col @mouseover="mouseOver" @mouseleave="mouseLeave">
                        <a-avatar
                          :src="getImage(item[avatar[0]?.dataIndex])"
                          v-if="
                            avatar.length !== 0 &&
                            isAvatar &&
                            checkAll == false &&
                            indeterminate == false
                          "
                        />
                        <a-checkbox
                          :checked="itemSelected.includes(item.id)"
                          @click="onChangeCheck(item.id)"
                          v-else
                        ></a-checkbox>
                      </a-col>
                    </template>
                    <template #title>
                      <a-row type="flex" justify="space-around">
                        <a-col :span="9">{{
                          defaultColumns.columns[0]?.title
                        }}</a-col>
                        <a-col :span="1">:</a-col>
                        <a-col :span="14">
                          <a-row type="flex" justify="end">
                            <a-col>
                              {{ item.code }}
                            </a-col>
                          </a-row>
                        </a-col>
                      </a-row>
                    </template>
                    <template #description>
                      <template v-for="(row, index) in rows" :key="index">
                        <a-row
                          type="flex"
                          justify="space-around"
                          v-if="item[row.dataIndex]"
                        >
                          <a-col :span="9">
                            {{ row?.title }}
                          </a-col>
                          <a-col :span="1"> : </a-col>
                          <a-col :span="14">
                            <a-col class="data">
                              <a-row
                                type="flex"
                                justify="end"
                                v-if="row.dataType == 'phone'"
                              >
                                <a-col>
                                  <a-tooltip placement="topLeft">
                                    <template #title>{{
                                      item[row.dataIndex]
                                        ? item[row.dataIndex]
                                        : "--"
                                    }}</template>
                                    <a :href="'tel:' + text">{{
                                      item[row.dataIndex]
                                        ? item[row.dataIndex]
                                        : "--"
                                    }}</a>
                                  </a-tooltip>
                                </a-col>
                              </a-row>
                              <a-row
                                type="flex"
                                justify="end"
                                v-else-if="row.dataType == 'email'"
                              >
                                <a-col>
                                  <a-tooltip placement="topLeft">
                                    <template #title>{{
                                      item[row.dataIndex]
                                        ? item[row.dataIndex]
                                        : "--"
                                    }}</template>
                                    <a :href="'mailto:' + text">{{
                                      item[row.dataIndex]
                                        ? item[row.dataIndex]
                                        : "--"
                                    }}</a>
                                  </a-tooltip>
                                </a-col>
                              </a-row>
                              <a-row
                                type="flex"
                                justify="end"
                                v-else-if="row.dataType == 'date'"
                              >
                                <a-col>
                                  <a-tooltip placement="topLeft">
                                    <template #title>{{
                                      formatDate(
                                        item[row.dataIndex]
                                          ? item[row.dataIndex]
                                          : "--"
                                      )
                                    }}</template>
                                    <span>{{
                                      formatDate(
                                        item[row.dataIndex]
                                          ? item[row.dataIndex]
                                          : "--"
                                      )
                                    }}</span>
                                  </a-tooltip>
                                </a-col>
                              </a-row>
                              <a-row
                                type="flex"
                                justify="end"
                                v-else-if="
                                  row.dataType == 'list' ||
                                  row.dataType == 'bool'
                                "
                              >
                                <a-col>
                                  <a-tooltip placement="topLeft">
                                    <template #title>{{
                                      renderList(
                                        item[row.dataIndex],
                                        row.dataSource,
                                        "text"
                                      )
                                    }}</template>
                                    <span>{{
                                      renderList(
                                        item[row.dataIndex],
                                        row.dataSource,
                                        "text"
                                      )
                                    }}</span>
                                  </a-tooltip>
                                </a-col>
                              </a-row>
                              <a-row
                                type="flex"
                                justify="end"
                                v-else-if="row.dataType == 'image'"
                              >
                                <a-col>
                                  <img
                                    width="48"
                                    height="48"
                                    v-bind:src="getImage(item[row.dataIndex])"
                                    alt="image"
                                    v-if="text"
                                  />
                                </a-col>
                              </a-row>
                              <a-row type="flex" justify="end" v-else>
                                <a-col>
                                  <a-tooltip placement="topLeft">
                                    <template #title>{{
                                      item[row.dataIndex]
                                        ? item[row.dataIndex]
                                        : "--"
                                    }}</template>
                                    <span>{{
                                      item[row.dataIndex]
                                        ? item[row.dataIndex]
                                        : "--"
                                    }}</span>
                                  </a-tooltip>
                                </a-col>
                              </a-row>
                            </a-col>
                          </a-col>
                        </a-row>
                      </template>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-spin>
        </a-col>
        <a-col :span="24" class="pagination">
          <a-row>
            <a-col :span="24" v-if="tags.length !== 0">
              <span> {{ $t("common.filter_by") }}: </span>
              <template v-for="tag in tags" :key="tag.dataIndex">
                <a-tag closable @close="closeTag(tag.dataIndex)">
                  <span>{{ tag.title }} : {{ tag.value }}</span>
                </a-tag>
              </template>
            </a-col>
            <a-col :span="24" v-if="dataList?.data?.totalCount"
              ><span
                >{{ $t("common.total") }}:1-{{ data.length }}/{{
                  dataList?.data?.totalCount
                }}
                {{ $t("common.record") }}</span
              ></a-col
            >
          </a-row>
        </a-col>
      </a-col>
      <a-col :span="collapse ? 24 : 18" class="detail-container">
        <a-row
          type="flex"
          justify="space-between"
          align="middle"
          class="detail-header"
        >
          <a-col
            ><component
              :is="collapse ? DoubleRightOutlined : DoubleLeftOutlined"
              @click="collapseActive"
            ></component
          ></a-col>
          <a-col>
            <a-row>
              <a-col><slot name="dynamicButton"></slot></a-col>
              <a-col>
                <a-button @click="editRecord">
                  <EditOutlined :style="{ color: '#3f51b5' }" /><span>{{
                    $t("common.edit")
                  }}</span></a-button
                >
              </a-col>
              <a-col>
                <a-button @click="duplicateRecord"
                  ><CopyOutlined :style="{ color: '#66bb6a' }" /><span>{{
                    $t("common.copy")
                  }}</span></a-button
                >
              </a-col>
              <a-col>
                <a-button @click="deleteRecord"
                  ><DeleteOutlined :style="{ color: '#ee6e73' }" /><span>{{
                    $t("common.delete")
                  }}</span></a-button
                >
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" align="middle">
          <a-col :span="24" v-if="data.length == 0">
            <a-empty>
              <template #description>
                <span>
                  {{ $t("common.empty") }}
                </span>
              </template>
            </a-empty>
          </a-col>
          <a-col :span="24" class="detail" v-else>
            <a-spin :spinning="listLoading">
              <slot name="detail"></slot>
            </a-spin>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  watch,
  computed,
  defineAsyncComponent,
  onMounted,
  watchEffect,
} from "vue";
import { formatDate, getImage, formatNumber } from "@/mixins/utility";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import { formatDateTimeVN } from "@/mixins.js";
import moment from "moment/moment";
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  BarsOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from "@ant-design/icons-vue";
import * as _ from "lodash";
interface Props {
  dataList: any;
  defaultColumns: any;
  listLoading: boolean;
  entity: string;
  columns: any;
  isAutoLoad: boolean;
  isDateList: boolean;
  disabledFitterForm: any;
}
const props = withDefaults(defineProps<Props>(), {
  entity: "",
  dataList: {},
  defaultColumns: {},
  listLoading: false,
  isAutoLoad: true,
  columns: [],
  isDateList: false,
  disabledFitterForm: [],
});
const isLoadMore = ref<boolean>(false);
const filterForm = ref<any>({});
const searchText = ref<string>("");
const filterList = ref<any>([]);
const detailData = ref<any>();
const pageSize = ref<number>(10);
const pageIndex = ref<number>(1);
const selectedColumns = ref<any>([]);
const collapse = ref<boolean>(false);
const checkAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);
const itemSelected = ref<number[]>([]);
const isAdvanceFilter = ref<boolean>(false);
const isAvatar = ref<boolean>(true);
const formatDateFilter: string = "YYYY-MM-DD HH:mm:ss";
const formatDateList: string = "YYYY/MM/DD HH:mm:ss";
const rows = computed(() =>
  props.defaultColumns.columns.filter(
    (column: any) =>
      column.dataIndex !== "code" && column.dataIndex !== "avatar_id"
  )
);
const titleList = computed(() => props.defaultColumns.columns[0]?.title);
const tags = computed(() => {
  let filterTag: any = [];
  props.defaultColumns.columns.forEach((column) => {
    filterList?.value?.forEach((filter) => {
      if (column.dataIndex == filter.field && filter.value !== "") {
        if (Array.isArray(filter.value)) {
          let dataSource: string[] = [];
          filter.value.forEach((e) => {
            column.dataSource.forEach((p) => {
              if (e == p.value) {
                dataSource.push(p.text);
              }
            });
          });
          if (dataSource.length > 0) {
            filterTag.push({
              title: column.title,
              dataIndex: column.dataIndex,
              value: dataSource.join(),
            });
          }
        } else if (
          (checkDateFormat(filter.value, formatDateFilter) ||
            checkDateFormat(filter.value, formatDateList)) &&
          filter.value1
        ) {
          filterTag.push({
            title: column.title,
            dataIndex: column.dataIndex,
            value: checkDateFormat(filter.value, formatDateFilter)
              ? formatDate(new Date(filter.value))
              : `${formatDate(new Date(filter.value))}-${formatDate(
                  new Date(filter.value1)
                )}`,
          });
        } else {
          filterTag.push({
            title: column.title,
            dataIndex: column.dataIndex,
            value: filter.value,
          });
        }
      }
    });
  });
  console.log("tag", filterTag);
  return filterTag;
});
const emit = defineEmits<{
  (e: "editRecord", record: any): void;
  (e: "deleteConfirm", record: any): any;
  (e: "emitData", record: any): any;
  (e: "showAdvance", record: any): void;
  (e: "recordDetail", record: any): void;
  (e: "duplicateRecord", record: any): void;
  (e: "getDateList"): void;
}>();
const data = ref<any>([]);
watch(
  () => props.dataList?.data?.items,
  (val) => {
    if (val) {
      if (isLoadMore.value) {
        data.value = data.value.concat(val);
        isLoadMore.value = false;
      } else {
        data.value = val;
        if (val.length > 0) {
          detailData.value = data.value[0];
          emit("recordDetail", detailData.value);
        } else {
          detailData.value = [];
        }
        indeterminate.value = false;
        checkAll.value = false;
      }
      console.log("data", data.value);
    }
  },
  { immediate: true }
);
watchEffect(() => {
  if (itemSelected.value) {
    emit("showAdvance", itemSelected.value);
    if (itemSelected.value.length !== 0) {
      if (itemSelected.value.length < data.value.length) {
        indeterminate.value = true;
        checkAll.value = false;
      } else if (itemSelected.value.length == data.value.length) {
        indeterminate.value = false;
        checkAll.value = true;
      }
    } else {
      indeterminate.value = false;
      checkAll.value = false;
    }
  }
});
onMounted(() => {
  getDetail(detailData.value);
  if (props.isDateList) {
    emit("getDateList");
  } else {
    fetch({
      subFilters: [],
      filters: [],
    });
  }
});
const detailComponent = computed(() => {
  let instance = _.replace(_.startCase(_.camelCase(props.entity)), " ", "");
  return defineAsyncComponent(
    () => import("@/views/" + instance + "/Detail.vue")
  );
});
const avatar = computed(() =>
  props.defaultColumns.columns.filter(
    (column: any) => column.dataIndex == "avatar_id"
  )
);
const checkDateFormat = (date: string, format: string) => {
  return moment(date, format, true).isValid();
};
const showAdvanceFilter = () => {
  let newForm: any = {};
  if (filterList.value.length > 0) {
    filterList.value.forEach((list) => {
      if (
        (checkDateFormat(list.value, formatDateFilter) ||
          checkDateFormat(list.value, formatDateList)) &&
        list.value1
      ) {
        if (checkDateFormat(list.value, formatDateFilter)) {
          newForm[list.field] = moment(list.value, formatDateFilter);
        } else {
          delete newForm[list.field];
        }
      } else {
        newForm[list.field] = list.value;
      }
    });
  } else {
    filterForm.value = {};
  }
  filterForm.value = newForm;
  isAdvanceFilter.value = true;
};
const hideAdvanceFilter = () => {
  isAdvanceFilter.value = false;
};
const handleAdvanceFilter = () => {
  let filters: any = [];
  for (const [key, value] of Object.entries(filterForm.value)) {
    if (value instanceof moment) {
      filters.push({
        field: key,
        operator: "between",
        value: moment(value).format("YYYY-MM-DD 00:00:00"),
        value1: moment(value).format("YYYY-MM-DD 23:59:59"),
      });
    } else if (Array.isArray(value)) {
      filters.push({
        field: key,
        operator: value.length > 0 ? "in" : "isNotNull",
        value: value.length > 0 ? value : [],
      });
    } else {
      filters.push({
        field: key,
        value: value,
      });
    }
  }
  filters.forEach((e) => {
    filterList.value = filterList.value.filter((p) => p.field != e.field);
    filterList.value.push(e);
  });
  reload();
  isAdvanceFilter.value = false;
};
const onCheckAllChange = () => {
  checkAll.value = !checkAll.value;
  if (checkAll.value == true) {
    indeterminate.value = false;
    itemSelected.value = data.value.map((e: any) => e.id);
  } else {
    itemSelected.value = [];
  }
};
const onChangeCheck = (id: number) => {
  if (itemSelected.value.includes(id) == true) {
    itemSelected.value = itemSelected.value.filter((e: number) => e !== id);
  } else {
    itemSelected.value.push(id);
  }
};
const getDetail = (record: any) => {
  detailData.value = record;
  if (detailData.value) {
    emit("recordDetail", detailData.value);
  }
};
const editRecord = () => {
  isLoadMore.value = false;
  emit("editRecord", detailData.value);
};
const duplicateRecord = () => {
  isLoadMore.value = false;
  emit("duplicateRecord", detailData.value);
};
const collapseActive = () => {
  collapse.value = !collapse.value;
};
const itemActive = (id: number) => {
  if (detailData?.value?.id == id) {
    return "active";
  } else {
    return "not-active";
  }
};
const loadMore = () => {
  pageIndex.value = pageIndex.value + 1;
  isLoadMore.value = true;
  fetch({
    subFilters: [],
    filters: filterList.value,
  });
};
const fetch = (params: any) => {
  const pa = JSON.parse(JSON.stringify(params));
  pa.pageSize = pageSize.value;
  pa.pageIndex = pageIndex.value;
  pa.columns = selectedColumns.value;
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
interface dataSource {
  value: number;
  text: string;
}
const renderList = (value: number, dataSource: any, key: string) => {
  let item = dataSource?.find((data: dataSource) => data.value == value);
  return item ? item[key] : "";
};
const reload = (filters?: any) => {
  if (filters) {
    if (Array.isArray(filters)) {
      filters.map((filter) => {
        let tmp_filter = filterList.value.find(
          (p: any) => p.field == filter.field
        );
        if (!tmp_filter) {
          filterList.value.push(filter);
        } else {
          tmp_filter.operator = filter.operator;
          tmp_filter.value = filter.value;
          tmp_filter.value1 = filter.value1;
        }
      });
    } else {
      let tmp_filter = filterList.value.find(
        (p: any) => p.field == filters.field
      );
      if (!tmp_filter) {
        filterList.value.push(filters);
      } else {
        tmp_filter.operator = filters.operator;
        tmp_filter.value = filters.value;
        tmp_filter.value1 = filters.value1;
      }
    }
  }
  pageIndex.value = 1;
  itemSelected.value = [];
  fetch({
    filters: filterList.value,
    // subFilters: subFilters,
  });
};
const handleSearch = () => {
  filterList.value = filterList.value.filter((e) => e.field !== "code");
  filterList.value.push({
    field: "code",
    value: searchText.value,
  });
  isLoadMore.value = false;
  searchText.value = "";
  reload();
};
const closeTag = (dataIndex) => {
  filterList.value = filterList.value.filter((p) => p.field !== dataIndex);
  console.log("filterTag", filterList.value);
  filterForm.value[dataIndex] = Array.isArray(filterForm.value[dataIndex])
    ? []
    : "";
  reload();
};
const mouseOver = () => {
  isAvatar.value = false;
};
const mouseLeave = () => {
  isAvatar.value = true;
};
const deleteRecord = () => {
  isLoadMore.value = false;
  emit("deleteConfirm", detailData.value);
};
defineExpose({ reload, data });
</script>
<style lang="scss" scoped>
$bgHeader: #e3e3e3;
.active {
  background: var(--itemActive);
  transition: 0.5s;
}
.not-active {
  background: none;
  transition: 0.5s;
}
.container {
  .list {
    // height: 68vh;
    overflow: hidden;
    .ant-input-search {
      :deep(.ant-input-search-button) {
        background: var(--mainColor);
        border-color: var(--mainColor);
      }
    }
    .data {
      .ant-col {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      font-weight: 600;
      color: black;
      a {
        color: var(--mainColor);
      }
    }
    .header-list {
      padding: 8px 24px;
      background: $bgHeader;
    }
    .pagination {
      position: sticky;
      bottom: 0px;
      z-index: 1;
      background: white;
      padding: 12px 24px;
    }
    .ant-list {
      height: 68vh;
      overflow-y: scroll;
      overflow-x: hidden;
      :deep(.ant-spin-container) {
        min-height: 52vh;
      }
      :deep(.ant-list-header) {
        padding: 8px 12px 8px 24px;
        position: sticky;
        top: 0px;
        z-index: 1;
        background: $bgHeader;
      }
      .ant-list-item-meta {
        margin-bottom: 0px;
        :deep(.ant-list-item-meta-title) {
          margin: 0px;
          span {
            position: absolute;
            right: 12px;
          }
        }
        :deep(.ant-list-item-meta-avatar) {
          margin-right: 8px;
          width: 24px;
        }
        :deep(.ant-list-item-meta-content) {
          margin-left: 2px;
        }
      }
      .ant-list-item:hover {
        background: var(--itemActive);
      }
      .ant-list-item {
        padding: 12px 12px 12px 24px;
        :deep(.ant-list-item-action) {
          margin-top: 0px;
        }
      }
    }
  }
  .detail-container {
    // height: 68vh;
    overflow: hidden;
    .detail-header {
      padding: 8px 24px 8px 0px;
      background: $bgHeader;
      position: sticky;
      top: 0px;
      z-index: 1;
      .anticon {
        font-size: 20px;
        color: var(--mainColor);
      }
    }
    .detail {
      height: 68vh;
      overflow-y: scroll;
      overflow-x: hidden;
      :deep(.ant-spin-nested-loading) {
        min-height: 52vh;
      }
    }
  }
}
.ant-calendar-picker {
  width: 100%;
}
</style>

