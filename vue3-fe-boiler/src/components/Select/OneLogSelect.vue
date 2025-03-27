<template>
  <div class="select">
    <a-select
      :show-search="showSearch"
      :label-in-value="labelInValue"
      :allowClear="true"
      :autoClearSearchValue="true"
      v-model:value="val"
      :disabled="disabled"
      :defaultActiveFirstOption="defaultActiveFirstOption"
      @input="changeModel()"
      :placeholder="placeholder"
      style="width: 100%; border-left: none; position: relative"
      :filter-option="false"
      :not-found-content="fetching ? undefined : null"
      @search="fetchData"
      @change="handleChange"
      @popupScroll="onScroll"
      @focus="onFocus"
      @deselect="handleDeselect"
      :pageSize="pageSize"
      :typeSearch="typeSearch"
      :fieldFilter="fieldFilter"
      :fieldSearch="fieldSearch"
      :mode="mode"
      :option-label-prop="optionLabelProp"
    >
      <!-- :options="data" -->
      <template #notFoundContent>
        <div v-if="fetching">
          <a-spin size="small" />
        </div>
      </template>
      <template #clearIcon>
        <div>
          <CloseOutlined @click="clearSearchValue" />
        </div>
      </template>

      <a-select-option
        v-for="item in data"
        :key="item.value ? item.value : item.id"
      >
        <span v-if="props.isLabel">{{ item.label }}</span>
        <span v-else>
          <slot name="customRender" :item="item"></slot>
        </span>
      </a-select-option>
    </a-select>

    <a-button
      :disabled="disabled"
      @click="show()"
      :style="`display:${isDisplay}`"
    >
      <template #icon>
        <component :is="icon"></component>
      </template>
    </a-button>

    <a-modal
      width="80%"
      v-model:visible="visible"
      :title="title"
      cancelText="Đóng"
      okText="Chọn"
      centered
      @ok="handleOk"
      :bodyStyle="{
        padding: '16px',
        height: '80vh',
        overflow: 'hidden',
      }"
    >
      <List
        :loadingProp="loading"
        :placeholder="placeholder"
        :textField="textField"
        :entity="entity"
        :isAddSelect="isAddSelect"
        :filters="filters"
        :mode="mode"
        :show="visible"
        :fill-field="fillField"
      ></List>
    </a-modal>
  </div>
</template> 
<script setup lang="ts">
import axios from "axios";
import List from "@/components/Select/List.vue";
import debounce from "lodash/debounce";
import { defineComponent, ref, watch, toRef, computed } from "vue";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons-vue";
import camelCase from "lodash/camelCase";
import { db } from "@/database/db";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import i18n from "@/lang";
import { filterByValue } from "@/utility";

const { t } = i18n.global;

interface FieldValue {}
interface Filter {
  field: string;
  operator: string;
  value: string;
}
interface Props {
  isAddSelect: boolean;
  showSearch: boolean;
  isLabel: boolean;
  optionLabelProp: string;
  labelInValue: boolean;
  mode?: string;
  placeholder?: string;
  value: any;
  valueField: string;
  textField: string;
  entity?: string;
  disabled: boolean;
  defaultActiveFirstOption: boolean;
  title: string;
  icon: string;
  isDisplay?: string;
  isDisplayAdd?: string;
  fieldValue: any;
  subFilters: [];
  filters: any;
  fillField: {};
  pageSize: number;
  typeSearch?: string;
  fieldFilter?: string;
  fieldSearch?: string[];
}
interface Params {
  pageSize: number;
  pageIndex: number;
  filters: Array<string> | any;
  subFilters?: [];
}
interface valueProp {
  key: string;
  label: string;
  data: Array<string>;
}
const props = withDefaults(defineProps<Props>(), {
  typeSearch: "typeSearch",
  fieldFilter: "",
  isDisplayAdd: "",
  entity: "",
  mode: "",
  isDisplay: "",
  placeholder: "",
  valueField: "id",
  value: undefined,
  textField: "name",
  title: "Danh sách",
  isAddSelect: false,
  disabled: false,
  showSearch: true,
  isLabel: true,
  defaultActiveFirstOption: true,
  fieldValue: () => [],
  filters: () => [],
  labelInValue: true,
  fieldSearch: () => ["name"],
  pageSize: 20,
});
const database = ref<any>(db);
const data = ref<any>([]);
const isHaveDatas = ref([]);
const items = ref([]);
const loading = ref<boolean>(false);
const visible = ref<boolean>(false);
const isDisabled = ref<boolean>(false);
const fetching = ref<boolean>(false);
const isKeepFilter = ref<boolean>(false);
const isFirstFocus = ref<boolean>(true);
const isEnd = ref<boolean>(false);
const params = ref<Params>({
  pageSize: props.pageSize,
  pageIndex: 1,
  filters: [],
});
const val = ref();
watch(
  () => props.value,
  (first) => {
    val.value = first;
  },
  { immediate: true }
);
const valueProp = ref<valueProp>({
  key: "",
  label: "",
  data: [],
});
const emit = defineEmits<{
  (e: "input", val: any): void;
  (e: "getData", val: any): void;
  (e: "changeDefaultFirstOption"): void;
}>();
const fetch = debounce(() => {
  fetchData();
}, 800);

const clearSearchValue = () => {
  params.value.pageIndex = 1;
  params.value.filters = [];
  data.value = [];
};
const onSelectChange = (record: any) => {
  if (record.data.length != 0) {
    valueProp.value = {
      label: record.data[0][props.textField],
      key: record.data[0][props.valueField],
      data: record.data[0],
    };
    isHaveDatas.value = record.data;
    isDisabled.value = record.disabled;
  } else {
    isDisabled.value = true;
  }
};
const store = useStore();
const data_selected: any = computed(
  () => store.getters["onelogselect/data_selected"]
);
const handleOk = () => {
  if (data_selected.value.length != 0) {
    let valueProp = {
      label: data_selected[0][props.textField],
      key: data_selected[0][props.valueField],
      data: data_selected[0],
    };
    let val = data_selected.value.map((item: any) => ({
      label: item[props.textField],
      value: item[props.valueField],
      data: item,
    }));
    val = props.mode == "multiple" ? val : valueProp;
    emit("input", val);
    visible.value = false;
  } else {
    message.error(t("common.no_selected"));
  }
};
const show = () => {
  visible.value = true;
  loading.value = true;
};
const onFocus = () => {
  if (Object.keys(props.fieldValue).length == 0) {
    if (params.value.filters.length == 0) {
      if (isFirstFocus.value) {
        isFirstFocus.value = false;
        fetchData();
      } else {
        isFirstFocus.value = true;
        if (data.value.length == 0) {
          fetchData();
        }
      }
    } else {
      fetchData();
    }
  } else {
    onLoad(props.fieldValue);
  }
};
const onLoad = ({ field, value }: any) => {
  data.value = [];
  isKeepFilter.value = true;
  isFirstFocus.value = false;
  isEnd.value = false;
  params.value.pageIndex = 1;
  if (typeof value == "undefined") {
    params.value.filters = params.value.filters.filter(
      (p: any) => p.field != field
    );
  } else {
    params.value.filters = params.value.filters.filter(
      (p: any) => p.field != field
    );

    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.value.filters.push({
          field: field,
          operator: "in",
          value: value,
        });
      } else {
        params.value.filters.push({
          field: field,
          operator: "like",
          value: value,
        });
      }
    } else {
      params.value.filters.push({
        field: field,
        operator: "=",
        value: value,
      });
    }
    console.log(params.value.filters);

    fetchData();
  }
};
const changeModel = () => {
  emit("input", val.value);
};

const onScroll = async (e: any) => {
  if (!fetching.value) {
    var target = e.target;
    if (isEnd.value) return;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      params.value.pageIndex += 1;
      console.log(params.value);
      isKeepFilter.value = true;
      await fetchData();
    }
  }
};

const fetchData = (value?: string) => {
  if (!isKeepFilter.value) {
    data.value = [];
  }
  fetching.value = true;
  if (!isKeepFilter.value) {
    params.value.filters = [];
    if (value) {
      params.value.filters = props.filters;
      params.value.filters.push({
        field: props.textField,
        value: value,
      });
    }
  }
  // Nếu lọc theo filters
  if (props.filters.length != 0) {
    params.value.filters = props.filters;
  }

  params.value.subFilters = props.subFilters;
  // thay đổi cơ chế lọc
  let pa = {
    params: params.value,
  };
  console.log(props.isLabel);

  if (props.typeSearch === "client" && typeof props.typeSearch === "string") {
    if (value) {
      emit("changeDefaultFirstOption");
      fetching.value = true;
      // param 1 : array , param 2 :value , param 3: fieldSearch
      data.value = filterByValue(data.value, value, props.fieldSearch);
      fetching.value = false;
    } else {
      const fieldFilter = props.fieldFilter;
      // (function () {
      let camelCaseEntity = camelCase(props.entity);
      let val =
        params.value.filters.find((item: any) => item.field == fieldFilter)
          ?.value || "";
      // Nếu có lọc theo điều kiện thì get index
      if (val != "" && fieldFilter != "") {
        database.value[camelCaseEntity]
          .where(fieldFilter)
          .equals(val)
          .toArray(function (e: any) {
            data.value = e;
            emit("getData", e);
          });
      } else {
        // Nếu ko thì lấy tất cả giá trị
        database.value[camelCaseEntity].toArray(function (e: any) {
          data.value = e;
          emit("getData", e);
        });
      }
    }
  } else {
    axios
      .get(`${props.entity}`, pa)
      .then((response) => {
        if (params.value.pageIndex == response.data.data.totalPage) {
          isEnd.value = true;
        }
        if (props.isLabel) {
          items.value = response.data.data.items;
          const results: any = items.value.map((item: any) => ({
            label: item[props.textField],
            value: item[props.valueField],
          }));
          data.value = data.value.concat(results);
        } else {
          data.value = response.data.data.items;
        }
        fetching.value = false;
        isKeepFilter.value = false;
      })
      .catch((error) => {
        isKeepFilter.value = false;
        fetching.value = false;
        message.error(error.message);
      });
  }
};

const handleChange = (value: any, option: any) => {
  // Object.assign({
  //   val: value,
  // });
  (fetching.value = false), (val.value = value);
  emit("input", val);
};
const handleDeselect = (value: any, option: any) => {
  Object.assign({
    val: value,
  });
  emit("input", val);
};

defineExpose({
  onLoad,
});
</script>
<style lang="scss">
.select {
  display: flex;
  position: relative;
}
</style>