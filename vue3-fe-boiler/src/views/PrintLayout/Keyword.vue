<template >
  <a-card :title="$t('printLayout.keyword.add')" class="card-scroll">
    <div class="text-search">
      <a-input
        :placeholder="$t('printLayout.keyword.search')"
        v-model:value="textSearch"
        class="search-keyword"
      >
        <template #prefix>
          <search-outlined type="user" />
        </template>
      </a-input>
    </div>
    <div v-for="(items, index) in filteredList" :key="index">
      <p class="title">
        {{ $t(`printLayout.groupBy.${index}`) }}
      </p>
      <a-list size="small" bordered :data-source="items">
        <template #renderItem="{ item }">
          <a-list-item class="block-item">
            <a-row>
              <a-col span="10">{{ item.display_name }}</a-col>
              <a-col span="10">{{ item.merge_field }}</a-col>
              <a-col span="4">
                <a-button @click="handleChoose(item)">{{
                  $t("printLayout.keyword.select")
                }}</a-button></a-col
              >
            </a-row>
          </a-list-item>
        </template>
        <template #header>
          <a-row >
            <a-col class="text-bold" span="10">{{
              $t("printLayout.keyword.title")
            }}</a-col>
            <a-col class="text-bold" span="10">{{
              $t("printLayout.keyword.code")
            }}</a-col>
            <a-col span="4"></a-col>
          </a-row>
        </template>
      </a-list>
    </div>
  </a-card>
</template>
<script>
import { SearchOutlined } from "@ant-design/icons-vue";
export default {
  data() {
    return {
      textSearch: "",
    };
  },
  props: {
    printLayoutItems: {
      type: Object,
      default: {},
    },
  },
  components: {
    SearchOutlined,
  },
  watch: {},
  methods: {
    renderTitle(title) {
      return;
    },
    handleChoose(item){
      this.$emit('handleChoose',item)
  }
  },
  computed: {
    filteredList() {
      let printLayout = {};
      for (const obj in this.printLayoutItems) {
        printLayout[obj] = this.printLayoutItems[obj].filter((item) => {
          return item.display_name
            .toLowerCase()
            .includes(this.textSearch.toLowerCase());
        });
      }
      return printLayout;
    },
  },
  
};
</script>
<style lang="scss" scoped>
.card-scroll {
  :deep(.ant-card-body) {
    height: 73vh;
    overflow: auto;
    padding-top: 0;
  }
}
.card-scroll {
  .text-search {
    position: sticky;
    top: 0;
    z-index: 1;
    padding-top: 16px;
    background: #fff;
  }
  p.title {
    font-weight: 600;
    text-align: center;
    margin: 8px auto;
  }
}
</style>