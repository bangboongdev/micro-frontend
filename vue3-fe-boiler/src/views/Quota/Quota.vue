<template>
  <div class="container">
    <div class="ant-page-header ant-page-header-ghost">
      <div class="ant-page-header-heading">
        <span style="font-size: 20px; font-weight: 600">{{
          $t("quota.attribute.quota")
        }}</span>

        <a-button :size="size"
          ><QuestionCircleOutlined />{{
            $t("quota.attribute.support")
          }}</a-button
        >
      </div>
    </div>
    <br />
    <!-- <div class="search-tab">
      <a-input-search
        v-model:value="value"
        :placeholder="$t(`quota.event.search`)"
        style="width: 64%"
        @search="onSearch"
      />
    </div> -->
    <div
      class="category-wrap"
      v-for="(category, index) in categories"
      :key="index"
    >
      <p class="list-row_header">
        <strong>{{
          $t(`quota.categories.${category.title_type}.title`)
        }}</strong>
      </p>
      <a-row>
        <a-col
          :span="6"
          v-for="(item, index) in category.items"
          :key="index"
          class="list-row__col"
        >
          <a-row>
            <a-col :span="6" class="list-row__col-icon">
              <component :is="item.icon"></component>
            </a-col>
            <a-col :span="18">
              <router-link
                :to="item.path"
                v-permission:view="item.path.replaceAll('-', '_')"
                ><div class="list-row__coll-title">
                  {{
                    $t(
                      `quota.categories.${category.title_type}.${item.type}.title`
                    )
                  }}
                </div>
              </router-link>
              <div class="list-row__coll-subtitle">
                {{
                  $t(
                    `quota.categories.${category.title_type}.${item.type}.subTitle`
                  )
                }}
              </div>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  QuestionCircleOutlined,
  BranchesOutlined,
  AimOutlined,
  TeamOutlined,
  ClusterOutlined,
  FileDoneOutlined,
  PrinterOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  HomeOutlined,
  InsertRowBelowOutlined,
  LayoutOutlined,
  LoginOutlined,
  DingdingOutlined,
} from "@ant-design/icons-vue";
import { ref } from "vue";
interface Item {
  icon?: any;
  type: string;
  path: string;
}
interface Category {
  title_type: string;
  items: Item[];
}
const categories = ref<Category[]>([
  {
    title_type: "quota_info_title",
    items: [
      {
        icon: TeamOutlined,
        type: "airport_quota",
        path: "airport_quota",
      },
      {
        icon: HomeOutlined,
        type: "distance_quota",
        path: "distance_quota",
      },
      {
        icon: LayoutOutlined,
        type: "province_distance_quota",
        path: "province_distance_quota",
      },
        {
        icon: LayoutOutlined,
        type: "district_distance_quota",
        path: "district-distance-quota",
      },
      {
        icon: LayoutOutlined,
        type: "hotel_quota",
        path: "hotel_quota",
      },
      
    ],
  },
]);
</script>
<style scoped>
.container {
  background: #fff;
}
.ant-input-search:hover {
  border-color: green;
}
.ant-input-affix-wrapper-focused {
  border-color: green;
  box-shadow: 0 0 0 2px #3cb371;
}
.ant-page-header-heading .ant-btn {
  background: green;
  border-color: green;
  color: #fff;
}
.ant-page-header-heading {
  display: flex;
  justify-content: space-between;
}
.search-tab {
  text-align: center;
  margin-bottom: 24px;
}
.img-info_content {
  display: flex;
  flex-wrap: wrap;
}
.color {
  color: rgb(0, 136, 90);
}
.category-wrap {
  background: rgb(255, 255, 255);
  padding: 16px;
  margin: 24px;
  border: 1px solid #f0f0f0;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}
.list-row_header {
  font-size: 16px;
}
.list-row__col {
  /* display: flex; */
  padding-bottom: 24px;
}
.list-row__col-icon {
  padding: 8px 8px;
  text-align: center;
}
.list-row__col-icon span {
  font-size: 32px;
}
.list-row__coll-title {
  font-size: 16px;
  font-weight: 700;
  color: rgb(0 137 88);
}
.list-row__coll-subtitle {
  font-weight: 500;
}
</style>
