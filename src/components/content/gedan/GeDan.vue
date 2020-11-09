<template>
  <div class="gedan">
    <div class="biaoqian">
      <span>热门标签:</span>
      <ul>
        <li
          style="cursor:pointer;"
          v-for="(item,index) in biaoqian"
          :key="index"
          :class="{active:index===currentIndex}"
          @click="tagClick(index)"
        >{{item}}</li>
      </ul>
    </div>
    <div class="play-list">
      <div
        style="cursor:pointer;"
        class="play-list-item"
        v-for="(item,index) in gedanList"
        :key="index"
        @click="listClick(index)"
      >
        <div class="item-image">
          <img :src="item.coverImgUrl" alt />
          <div class="item-counts">
            <span>{{item.playCount | wan}}</span>
          </div>
          <div class="item-username">
            <span>{{item.creator.nickname}}</span>
          </div>
        </div>
        <div class="item-name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlayList } from "../../../network/banner";
export default {
  data() {
    return {
      currentIndex: 0,
      biaoqian: [
        "华语",
        "流行",
        "摇滚",
        "韩语",
        "民谣",
        "说唱",
        "日语",
        "轻音乐",
        "运动",
      ],
      gedanList: [],
    };
  },
  created() {
    getPlayList("华语").then((res) => {
      // console.log(res);
      this.gedanList = res.playlists;
    });
  },
  components: {},
  filters: {
    wan: function (num) {
      return parseInt(num / 10000) + "万";
    },
  },
  methods: {
    tagClick(index) {
      this.currentIndex = index;
      getPlayList(this.biaoqian[index]).then((res) => {
        this.gedanList = res.playlists;
      });
    },
    listClick(index) {
      this.$router.push("/listdetail/" + this.gedanList[index].id);
    },
  },
};
</script>

<style>
.gedan {
  width: 950px;
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  
}
.biaoqian {
  color: rgb(119, 118, 118);
  display: flex;
  font-size: 15px;
  margin-bottom: 25px;
}
.biaoqian ul {
  margin-left: 10px;
  display: flex;
}
.biaoqian li {
  list-style: none;
  width: 70px;
  text-align: center;
  font-size: 14px;
}
.active {
  color: rgb(163, 2, 2);
}
.play-list {
  display: flex;
  flex-flow: wrap;
  
}

.play-list-item {
  margin-right: 27px;
  margin-bottom: 15px;
  perspective: 800px;
}
.item-image {
  width: 210px;
  height: 210px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.4s;
}
.item-image:hover {
  /* translateY(-4px) */
  transform: rotateX(10deg) translateZ(35px) ;
  box-shadow: 5px 10px 10px rgba(0, 0, 0, 0.5);
 
  /* transform: rotateY(-20deg) rotateX(5deg); */
  
}
.item-image img {
  width: 100%;
  height: 100%;
}
.item-counts {
  position: absolute;
  top: 0;
  width: 100%;
  /* right: 3px; */
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
.item-counts span {
  margin-right: 5px;
}
.item-username {
  position: absolute;
  bottom: 0px;
  font-size: 14px;
  color: #eee;
  width: 100%;
  padding: 5px 0;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    180deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(3, 2, 51, 1) 0%,
    rgba(57, 57, 57, 0.8015581232492998) 0%,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.29175420168067223) 45%,
    rgba(0, 0, 0, 0.5298494397759104) 100%
  );
}
.item-username span {
  margin-left: 5px;
}
.item-name {
  width: 210px;
  color: #eee;
  font-size: 14px;
}
</style>