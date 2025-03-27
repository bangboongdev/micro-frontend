<template>
  <div class="editable-cell">
    <div class="editable-cell-input-wrapper">
      <a-input-number
        :min="1"
        :value="text"
        @change="handleChange"
        @pressEnter="check"
        @blur="handleChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: this.text,
    };
  },
  props: {
    text: String,
  },
  mounted() {
    console.log(this.text);
  },
  methods: {
    handleChange(e) {
      const value = e;
      this.value = value;
      this.$emit("change", this.value);
    },
    check(e) {
      const value = e;
      this.value = value;
      this.$emit("change", this.value);
    },
  },
};
</script>