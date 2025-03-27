<template>
  <a-result
    status="404"
    title="404"
    sub-title="Xin lỗi, trang bạn truy cập không tồn tại."
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