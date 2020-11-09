<template>
  <div class="block" @mousedown="down" @mouseup="up">
    <el-slider class="jindu" v-model="value1" @change="toWhere" :max="500" :show-tooltip="false"></el-slider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: 0,
    };
  },
  mounted() {},
  methods: {
    toWhere() {
      this.$emit("putWhere", this.value1);
    },
    down() {
      this.$emit("md");
    },
    up() {
      this.$emit("mu");
    },
  },
};
</script>
<style>
.jindu .el-slider__button-wrapper .el-slider__button {
  width: 8px;
  height: 8px;
  background-color: rgb(255, 255, 255);
  border: 3px solid rgb(248, 115, 54);
}
.jindu .el-slider__runway .el-slider__bar {
  background-color: rgb(248, 115, 54);
}
.jindu .el-slider__button-wrapper{
  height: 18px;
  width: 18px;
  top: -10px;
}
</style>
