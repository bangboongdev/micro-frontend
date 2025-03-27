<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="true"
    :isAddSelect="true"
    :isImport="true"
    :isViewType="true"
    @emitDataTable="getFilterTable($event)"
    @emitDataList="getFilterList($event)"
    @openRecord="openRecord($event)"
    @recordDetail="setRecordDetail($event)"
    :dataTable="dataTable?.data?.data"
    :dataList="dataList?.data?.data"
    :tableLoading="dataTable?.isLoading"
    :listLoading="dataList?.isLoading"
  >
     <template #detailList>
      <a-spin :spinning="dataList?.isLoading">
        <detail :form="recordDetail"></detail>
      </a-spin>
    </template>
  </base-page>
    <a-modal
    v-model:visible="isShowModal"
    :title="$t('currency.name', { code: form.code })"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideModal"
    @ok="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="{
      overflowY: 'auto',
      overflowX: 'hidden',
    }"
    wrapClassName="dialog-class"
    target="current_tab"
    ref="modal"
  >
    <detail
      :entity="entity"
      :is-show-modal="isShowModal"
      :form="detail?.data?.data?.data"
    />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { useGetList, useDetail } from "@/hooks/currency";
import {ref} from "vue"
const entity = "currency";
const filterTable = ref<any>();
const filterList = ref<any>();
const itemId = ref<any>();
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
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
const detail = ref<{}>(
  useDetail(itemId, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
  })
);
const openRecord = (record: number) => {
  isShowModal.value = true;
  itemId.value = record;
};
const hideModal = () => {
  isShowModal.value = false;
};
const setRecordDetail = (record: number) => {
  recordDetail.value = record;
};
</script>

<style scoped>
</style>