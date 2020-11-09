<template>
  <div class="personalized">
    <span class="tuijian-test">推荐新歌</span>
    <div class="song-list">
      <div class="list-item" v-for="(item,index) in list" :key="index">
        <img style="cursor:pointer;" :src="item.picUrl" alt @click="zxClick(item.id)" />
        <div class="text">
          <div class="aa" :title="item.name">{{item.name}}</div>
          <div class="bb" :title="item.song.artists[0].name">{{item.song.artists[0].name}}</div>
        </div>
      </div>
    </div>
    <span class="gedan-text">推荐歌单</span>
    <div class="music-list">
      <div
        style="cursor:pointer;"
        class="music-item"
        @click="gedanClick(index)"
        v-for="(item,index) in musicList "
        :key="index"
      >
        <div class="img-wrap">
          <img :src="item.picUrl" alt />
          <div class="gedan-title">
            <span>{{item.copywriter}}</span>
          </div>
        </div>
        <div class="gedan-name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPersonalizedNew } from "../../../network/banner";
import { myAxios } from "../../../network/myaxios";
import { getPersonalized } from "../../../network/banner";
import { getPersonalizedMV } from "../../../network/banner";
import Lyric from "lyric-parser";
export default {
  data() {
    return {
      list: [],
      musicList: [],
      mvList: [],
    };
  },
  created() {
    //获取最新推荐
    getPersonalizedNew().then((res1) => {
      this.list = res1.result;
      // console.log(res1);
    });
    //获取推荐歌单
    getPersonalized(8).then((res2) => {
      this.musicList = res2.result;
    });
    getPersonalizedMV().then((res3) => {
      // console.log(res3);
      this.mvList = res3.result;
    });
  },
  methods: {
    zxClick(id) {
      myAxios({
        url: "http://localhost:3000/song/url",
        methods: "get",
        params: {
          id,
        },
      }).then((res) => {
        let ids = id;
        myAxios({
          url: "http://localhost:3000/song/detail",
          methods: "get",
          params: {
            ids,
          },
        }).then((res2) => {
          let detail = {};
          detail.id = res2.songs[0].id;
          detail.title = res2.songs[0].name;
          detail.pic = res2.songs[0].al.picUrl;
          detail.artist = res2.songs[0].ar[0].name;
          detail.url = res.data[0].url;
          this.$bus.$emit("changeSong", detail);
        });
      });
    },
    gedanClick(index) {
      this.$router.push("/listdetail/" + this.musicList[index].id);
    },
  },
};
</script>

<style>
.personalized {
  margin-top: 20px;
}
.tuijian-test {
  color: #eee;
  display: block;
  margin-bottom: 10px;
}
.song-list {
  flex-wrap: wrap;
  display: flex;
  border: 1px solid rgb(54, 54, 54);
  background-color: rgb(32, 32, 32);
}
.list-item {
  padding: 15px 0;
  padding-left: 37px;
  width: 46%;
  height: 50px;
  color: #eee;
  display: flex;
}
.list-item img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  margin-right: 14px;
  transition: 0.25s;
  position: relative;
  left: 0;
  top: 0;
}
.list-item img:hover {
  transform: scale(1.1);
  /* width: 56px;
  height: 56px; */
  /* left: -3px;
  top: -3px; */
}
.list-item .text {
  flex-flow: column;
}
.list-item:nth-child(2n) {
  border-left: 1px solid rgb(54, 54, 54);
}
.list-item:nth-child(1) {
  background-color: rgb(39, 39, 39);
}
.list-item:nth-child(4) {
  background-color: rgb(39, 39, 39);
}
.list-item:nth-child(5) {
  background-color: rgb(39, 39, 39);
}
.list-item:nth-child(8) {
  background-color: rgb(39, 39, 39);
}
.list-item:nth-child(9) {
  background-color: rgb(39, 39, 39);
}
.aa{
  width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* line-clamp: 1; */
  -webkit-box-orient: vertical;
}
.bb {
  margin-top: 8px;
  font-size: 14px;
  color: rgb(146, 146, 146);
}

.music-list {
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
}
.music-item {
  width: 210px;
  margin-bottom: 15px;
}
.music-list img {
  width: 100%;
}
.gedan-text {
  display: block;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #eee;
}
.img-wrap {
  width: 210px;
  height: 210px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.gedan-title {
  position: absolute;
  top: 0;
  width: 100%;
  font-size: 12px;
  height: 0;
  overflow: hidden;
  transition: 0.6s;
}
.gedan-title span {
  display: block;
  color: #eee;
  padding: 6px;
  background-color: rgba(0, 0, 0, 0.5);
}
.img-wrap:hover .gedan-title {
  height: 60px;
}
.gedan-name {
  color: #eee;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>