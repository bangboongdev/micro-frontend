import OneLogGrid from "@/components/Grid/OneLogGrid.vue";
import OneLogList from "@/components/Grid/OneLogList.vue"
import OneLogSelect from "@/components/Select/OneLogSelect.vue";

const GlobalComponents = {
  install(Vue:any) {
    Vue.component("o-grid", OneLogGrid);
    Vue.component("o-list", OneLogList);
    Vue.component("o-select", OneLogSelect);
  },
};

export default GlobalComponents;
