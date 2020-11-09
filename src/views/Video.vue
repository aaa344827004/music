<template>
  <div class="mv-page">
    <div class="mv-page-middle">
      <div class="newMV">
        <h3>最新MV</h3>
        <div class="mvTags">
          <span class="tagItem" style="cursor:pointer;" :class="{tagActive:currentTag==index}" @click="tagClick(index)" v-for="(item,index) in tags" :key="index">{{item}}</span>
        </div>
        <div class="mv-list">
          <li class="mv-list-item" v-for="(item,index) in newMVList" :key="index">
            <div class="mv-list-item-pic">
              <img :src="item.cover" alt="">
              <div class="mv-play"  @click="mvClick(item.id)" style="cursor:pointer;"><div class="el-icon-video-play"></div></div>
            </div>
            <div class="mv-list-item-name">{{item.name}}</div>
            <div class="mv-list-item-artist">{{item.artistName}}</div>
          </li>
        </div>
        <h3>网易出品MV</h3>
        
        <div class="mv-list">
          <li class="mv-list-item" v-for="(item,index) in wyMVList" :key="index">
            <div class="mv-list-item-pic">
              <img :src="item.cover" alt="">
              <div class="mv-play" @click="mvClick(item.id)" style="cursor:pointer;"><div class="el-icon-video-play"></div></div>
            </div>
            <div class="mv-list-item-name">{{item.name}}</div>
            <div class="mv-list-item-artist">{{item.artistName}}</div>
          </li>
        </div>
        <h3>推荐MV</h3>
        
        <div class="mv-list">
          <li class="mv-list-item" v-for="(item,index) in tuijianMVList" :key="index">
            <div class="mv-list-item-pic">
              <img :src="item.picUrl" alt="">
              <div class="mv-play" @click="mvClick(item.id)" style="cursor:pointer;"><div class="el-icon-video-play"></div></div>
            </div>
            <div class="mv-list-item-name">{{item.name}}</div>
            <div class="mv-list-item-artist">{{item.artistName}}</div>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { myAxios } from "../network/myaxios";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      tags:["内地","港台","欧美","日本","韩国"],
      currentTag:0,
      newMVList:[],
      wyMVList:[],
      tuijianMVList:[]
    };
  },
  created() {
    this.getNewMV(this.tags[this.currentTag],8)
    this.getwyMV(8)
    this.gettuijianMV()
  },

  watch: {},
  methods: {
    tagClick(index){
      this.currentTag = index
      this.getNewMV(this.tags[this.currentTag],8)
    },
    getNewMV(area,limit){
      myAxios({
        url: "http://localhost:3000/mv/first",
        methods: "get",
        params: {
          area,
          limit
        },
      }).then((res)=>{
        // console.log(res);
        if(res.code==200){
          this.newMVList = res.data
        }
        
      })
    },
    getwyMV(limit){
      myAxios({
        url: "http://localhost:3000/mv/exclusive/rcmd",
        methods: "get",
        params: {
          limit
        },
      }).then((res)=>{
        // console.log(res);
        if(res.code==200){
          this.wyMVList = res.data
        }
        
      })
    },
    gettuijianMV(){
      myAxios({
        url: "http://localhost:3000/personalized/mv",
        methods: "get",
        
      }).then((res)=>{
        // console.log(res);
        if(res.code==200){
          this.tuijianMVList = res.result
        }
        
      })
    },
    mvClick(id){
      this.$router.push("/MVDetail/"+id)
      this.$bus.$emit("mvPlay")
    }
  },
};
</script>
<style>
.mv-page {
  position: relative;
  width: calc(100% - 250px);
  height: calc(100vh - 112px);
  /* left: 250px; */
  overflow: auto;
  /* background-color: #bfa; */
}
.mv-page::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.mv-page::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #5c5c5c;
}
.mv-page::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #999999;
}
.mv-page-middle {
  width: 950px;
  
  position: absolute;
  top: 40px;
  left: calc(50%);
  transform: translateX(-50%);
  /* background-color: red; */
}
.newMV h3{
  color: rgb(199, 199, 199);
  font-size: 18px;
}
.mvTags{
  padding: 8px 0;
  border-bottom: 1px solid rgb(66, 66, 66);
  
}
.tagItem{
  display: inline-block;
  width: 50px;
  color: rgb(122, 122, 122);
  font-size: 14px;
  margin: 0 5px;
  /* background-color: #bfa; */
  text-align: center;
}
.tagItem:hover{
  color: rgb(167, 167, 167);
}
.tagActive{
  color: #eee !important;
}
.mv-list{
  display: flex;
  flex-flow: wrap;
  justify-content: start;
  /* justify-content: space-between; */
  margin-bottom: 30px;
  
}
.mv-list-item{
  /* flex: 1; */
  list-style: none;
  margin: 15px 8px;
}
.mv-list-item-pic{
  width: 220px;
  height: 130px;
  overflow: hidden;
  position: relative;
  
}
.mv-list-item-pic img{
  height: 100%;
  width: 100%;
  
}
.mv-list-item-name{
  color: rgb(206, 205, 205);
  width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* line-clamp: 1; */
  -webkit-box-orient: vertical;
}
.mv-list-item-artist{
  color: rgb(109, 109, 109);
  font-size: 14px;
}
.mv-play{
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0, 0, 0, .5);
}
.mv-play .el-icon-video-play{
  
  font-size: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: rgb(161, 161, 161);
}
.mv-list-item-pic:hover .mv-play{
  display: block;
}
</style>