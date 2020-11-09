<template>
  <div class="home">
    <div class="home-all">
      <div class="home-top">
        <div class="out-title">
          <div
            style="cursor:pointer;"
            v-for="(item,index) in titles"
            :key="index"
            @click="itemClick(index)"
            :class="{activeH:currentIndex === index}"
          >{{item}}</div>
        </div>
      </div>
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      // , "最新音乐", "主播电台"
      titles: ["个性推荐", "歌单", "排行榜", "歌手"],
      routes: [
        "/home/tuijian",
        "/home/gedan",
        "/home/paihang",
        "/home/geshou",
        // "/home/zuixin",
        // "/home/diantai",
      ],
      currentIndex: 0,
    };
  },
  created() {
    // this.$router.push(this.routes[0])
    for (let i = 0; i < this.routes.length; i++) {
      if (this.$route.path == this.routes[i]) {
        this.currentIndex = i;
      }
    }
  },
  
  watch: {
    $route(to, from) {
      if (to.path == this.routes[0]) {
        this.currentIndex = 0;
      }
      if (to.path == this.routes[1]) {
        this.currentIndex = 1;
      }
      if (to.path == this.routes[2]) {
        this.currentIndex = 2;
      }
      if (to.path == this.routes[3]) {
        this.currentIndex = 3;
      }
      if (to.path == this.routes[4]) {
        this.currentIndex = 4;
      }
      if (to.path == this.routes[5]) {
        this.currentIndex = 5;
      }
    },
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      if (this.routes[index] !== this.$route.path) {
        this.$router.push(this.routes[index]);
      }
    },
  },
};
</script>
<style>
.home-all {
  display: flex;
  position: relative;
  height: calc(100vh - 112px);
  background-color: rgb(39, 39, 39);
  flex-flow: column;
  overflow-y: auto;
  min-width: 950px;
}
.home-top {
  margin: 0 40px;
  height: 50px;
  background-color: rgb(39, 39, 39);
  border-bottom: 2px solid rgb(58, 58, 58);
}
.out-title {
  min-width: 480px;
  left: 50%;
  transform: translateX(-50%);
  height: 50px;
  display: flex;
  position: absolute;
  color: rgb(168, 168, 168);
  font-size: 15px;
  text-align: center;
}
.out-title > div {
  line-height: 50px;
  flex: 1;
  width: 100px;
}
.activeH {
  color: #eee;
  border-bottom: 2px solid rgb(155, 155, 155);
}
.out-title > div:hover {
  color: #eee;
}
.home-all::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.home-all::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #5c5c5c;
}
.home-all::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #999999;
}

</style>