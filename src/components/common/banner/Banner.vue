<template>
<div class="out-banner">
  <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="(item,index) in banners.length" :key="index">
      <img class="run-img" :src="banners[index]" alt="">
      <!-- <h3 class="medium">{{ item }}</h3> -->
    </el-carousel-item>
  </el-carousel>
</div>
  
</template>

<script>
import {getBanner} from '../../../network/banner'
export default {
  components:{

  },
  data() {
    return {
      banners:[]
    }
  },
  created() {
     getBanner(0).then(res=>{
      
      for (let i = 0; i < res.banners.length; i++) {
        this.banners.push(res.banners[i].imageUrl)
        
      }
      
    })
  },
  mounted() {
    
    
  },
}
</script>

<style>
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .run-img{
    width: 100%;
    height: 100%;
  }
  .el-carousel__indicator .el-carousel__button{
    height: 4px;
    border-radius: 2px;
    width: 40px;
  }
</style>