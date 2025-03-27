<template>
  <a-button
    @click="showModal"
    class="export"
    v-permission:export="entity.replaceAll('-', '_')"
  >
    <CloudDownloadOutlined />
    {{ $t("common.excel.export") }}
  </a-button>
  <a-modal
    v-model:visible="visible"
    closable
    width="600px"
    :title="$t('common.excel.export')"
    @ok="handleOk"
    :ok-text="$t('common.excel.export')"
    :ok-button-props="{
      style: {
        background: '#00885a',
        borderColor: '#00885a',
        width: '120px',
      },
    }"
    :confirm-loading="confirmLoading"
    :cancel-text="$t('common.back')"
  >
    <span v-if="selected.length == 0">{{ $t("common.excel.export_all") }}</span>
    <span v-else
      >{{ $t("common.excel.export_selected") }} {{ selected.length }}
      {{ $t("common.excel.export_count") }}</span
    >
  </a-modal>
</template>
<script>
import { CloudDownloadOutlined } from "@ant-design/icons-vue";
import { mapState, mapActions } from "vuex";
import camelCase from "lodash/camelCase";
import FileSaver from 'file-saver';

export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
    };
  },
  props: {
    entity: String,
    selected: {
      type: Array,
      default: [],
    },
  },
  components: {
    CloudDownloadOutlined,
  },
  computed: {
    ...mapState({
      service(state, getters) {
        return state[camelCase(this.entity)].service;
      },
    }),
  },
  methods: {
    ...mapActions({
      export(dispatch, payload) {
        dispatch(camelCase(this.entity) + "/export", payload).then(
          (response) => {
            let fileName = `Danh_sach_${payload.title}.xlsx`;
            FileSaver.saveAs(new Blob([response.data]), fileName);
          }
        );
      },
    }),
    showModal() {
      this.visible = true;
    },
    handleOk() {
      let payload = {
        action: "update",
        ids: this.selected,
        title: this.$t(camelCase(this.entity) + ".name"),
      };
      this.export(payload);
    },
  },
};
</script>
<style lang="scss" scoped>
.export {
  color: rgb(0, 136, 90);
  border-color: rgb(0, 136, 90);
}
</style>