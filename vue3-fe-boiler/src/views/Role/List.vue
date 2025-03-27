
<template>
  <base-page
    :entity="entity"
    :isAdd="true"
    :isAction="true"
    :widthModal="width"
     :isImport="true"
    :isCustomColumn="true"
    :isAddSelect="true"
    :isViewType="true"
    @emitDataTable="getFilterTable($event)"
    @emitDataList="getFilterList($event)"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    :dataTable="dataTable?.data?.data"
    :dataList="dataList?.data?.data"
    :tableLoading="dataTable?.isLoading"
    :listLoading="dataList?.isLoading"
  ></base-page>
</template>
<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useGetList, useDetail } from "@/hooks/role";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "role";
const width = "80%";
const filterTable = ref<any>();
const filterList = ref<any>();
const getFilterTable = (params: any) => {
  filterTable.value = params;
};
const getFilterList = (params: any) => {
  filterList.value = params;
};
const dataTable = ref<any>(
  useGetList(filterTable, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
  })
);
const dataList = ref<any>(
  useGetList(filterList, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 1000,
  })
);
</script>
