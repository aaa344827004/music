<template>
  <div class="tuijian">
    <Banner></Banner>
    <Personalized></Personalized>
  </div>
</template>

<script>
import Banner from '../../../components/common/banner/Banner'
import Personalized from '../../../components/common/banner/Personalized'

export default {
  components: {
    Banner,
    Personalized
  }
}
</script>

<style>
.tuijian{
  width: 950px;
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
}
</style>