<template>
  <a-result
    status="403"
    title="403"
    sub-title="Xin lỗi, bạn không có quyền truy cập trang này"
  >
    <template #extra>
      <a-button type="primary" @click="this.$router.push('/')">
        Quay lại Trang chủ
      </a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>