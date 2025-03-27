<template>
  <div class="content dashboard-content">
    <div class="container-fluid">
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :routeLink="routeLink"
          @changePassword="changePassword()"
          @changeTab="changeTab($event)"
        />
      </router-view>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    routeLink: "",
  },
  methods: {
    changePassword() {
      this.$emit("changePassword");
    },
    changeTab($event) {
      this.$emit("changeTab", $event);
    },
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
    .fade-leave-to
        /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
