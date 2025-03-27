<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {
    
  },
};
</script>
<style>
/* width */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f5f5f5;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(113, 113, 113, 0.5);
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(113, 113, 113, 0.85);
}
</style>
