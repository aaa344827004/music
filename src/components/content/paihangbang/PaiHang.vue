<template>
  <div class="ph-outer">
    <div
      style="cursor:pointer;"
      class="ph-item"
      @click="phClick(index)"
      v-for="(item,index) in phList "
      :key="index"
    >
      <div class="ph-img-wrap">
        
        <img :src="item.coverImgUrl" alt />
        <div class="ph-li-title">
          <span>{{item.playCount}}</span>
        </div>
      </div>
      <div class="ph-li-name">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import { myAxios } from "../../../network/myaxios.js";
import { log } from 'util';

export default {
  data() {
    return {
      phList: [],
    };
  },
  created() {
    myAxios({
      url: "http://localhost:3000/toplist",
      methods: "get",
    }).then((res) => {
      this.phList = res.list;
      console.log(res);
    });
  },
  methods:{
    phClick(index){
      console.log(1);
      this.$router.push("/listdetail/" + this.phList[index].id)
    }
  }
};
</script>

<style>
.ph-outer {
  position: absolute;
  width: 1000px;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-flow: wrap;
  justify-content: start;
}
.ph-item {
  color: #eee;
  width: 210px;
  margin-left: 32px;
  margin-bottom: 20px;
  position: relative;
  perspective: 800px;
}
.ph-img-wrap {
  width: 210px;
  height: 210px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  transition: 0.4s;
}
.ph-img-wrap:hover{
  transform: rotateX(10deg) rotateY(-10deg) translateZ(35px) ;
  box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.5);
}
.ph-li-title {
  position: absolute;
  top: 0;
  
  width: 100%;
  text-align: end;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  color: #eee;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(3, 2, 51, 1) 0%,
    rgba(57, 57, 57, 0.8015581232492998) 0%,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 44%,
    rgba(0, 0, 0, 0.4962359943977591) 100%
  );
}
.ph-li-title span {
  margin-right: 10px;
}
.ph-li-name {
  padding: 5px ;
}
.ph-item img {
  width: 100%;
  height: 100%;
}
</style>