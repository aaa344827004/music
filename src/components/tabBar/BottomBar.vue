<template>
  <div class="bottom-bar" >
    <transition name="mbd">
      <div ref="mbar" class="music-bar" v-show="drawer">
        <div class="barmiddle">
          <div class="back-img">
            <div class="back-middle">
              <div class="cd-e" ref="cd">
                <!-- 唱片针外部div-->
                <div class="cd-e-long">
                  <img src="../../assets/img/play-bar.png" alt />
                </div>
                <div class="cd-e-circle">
                  <img src="../../assets/img/play-bar-support.png" alt />
                </div>
              </div>
              <div
                class="turn-bar"
                :class="{ turn: isPlayed, pause: isPaused2 }"
              >
                <div class="turn-bar-in">
                  <div class="turn-bar-pic">
                    <img :src="music[currMusic].pic" alt />
                  </div>
                </div>
              </div>
              <div class="lyric-board">
                <div class="board-title">
                  <div class="board-title-name">
                    {{ music[currMusic].title }}
                  </div>
                  <div class="board-title-artist">
                    歌手 : {{ music[currMusic].artist }}
                  </div>
                </div>
                <div class="lyric-content" ref="currli" @mousewheel="roll">
                  <li
                    class="lyric-li"
                    v-for="(item, index) in lyric"
                    :class="{ lyactive: currLyric === index }"
                    :key="index"
                  >
                    {{ item.lyric }}
                  </li>
                </div>
              </div>
            </div>
            <img :src="music[currMusic].pic" alt />
          </div>
        </div>
        <div class="comment">
          <div class="comment-title">精彩评论</div>
          <ul>
            <li
              class="comment-li"
              v-for="(item, index) in comments"
              :key="index"
            >
              <div class="comment-li-pic">
                <img :src="item.user.avatarUrl" alt />
              </div>
              <div class="comment-li-content">
                <div>
                  {{ item.user.nickname }} :
                  <span>{{ item.content }}</span>
                </div>
                <div class="li-time">{{ item.time | formatDate }}</div>
              </div>
            </li>
          </ul>
          <el-pagination
            class="pages"
            layout="prev, pager, next"
            :total="total"
            :current-page="commentPage + 1"
            :page-size="20"
            @current-change="pageChange"
            :background="true"
          ></el-pagination>
        </div>
        <transition name="cbd">
          <div
            v-show="showCloseBtn"
            class="closeBtn"
            @click="
              drawer = !drawer;
              showCloseBtn = false;
            "
          >
            <i class="el-icon-bottom-left"></i>
          </div>
        </transition>
      </div>
    </transition>

    <div class="detail" v-if="music[currMusic].pic != ''">
      <div
        style="cursor: pointer"
        class="detail-pic"
        :class="{ turn: isPlayed, pause: isPaused2 }"
        @click="openBar"
      >
        <!-- -->
        <img :src="music[currMusic].pic" alt />
      </div>
      <div class="text">
        <span class="song-name" :title="music[currMusic].title">{{
          music[currMusic].title
        }}</span>
        <span class="artist-name" :title="music[currMusic].artist">{{
          music[currMusic].artist
        }}</span>
      </div>
    </div>
    <div class="pre" @click="pre" style="cursor: pointer">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="play" @click="playClick" style="cursor: pointer">
      <div class="play-go" v-if="stop">
        <img src="../../assets/img/stop.png" alt />
      </div>
      <div class="play-stop" v-else>
        <img src="../../assets/img/play.png" alt />
      </div>
    </div>
    <div class="next" @click="next" style="cursor: pointer">
      <i class="el-icon-arrow-right"></i>
    </div>
    <div class="ntime">{{ nTime }}</div>
    <div class="time">
      <Slider @putWhere="putWhere" @md="md" @mu="mu" ref="slider"></Slider>
    </div>
    <div class="mtime">{{ mTime }}</div>
    <div class="voice"></div>
    <div class="now-list-button" @click="listOpen" style="cursor: pointer">
      <i class="el-icon-tickets"></i>
      <span class="list-length">{{ music.length }}</span>
    </div>

    <div v-show="listShow" class="el-icon-caret-bottom"></div>
    <div class="now-list" v-show="listShow">
      <span class="list-head">播放列表</span>
      <ul>
        <li
          :class="{ liActive: currMusic == index }"
          class="list-li"
          v-for="(item, index) in music"
          :key="index"
          @click="itemClick(index)"
          style="cursor: pointer"
        >
          <div>
            <span class="list-icon" v-if="currMusic == index">
              <i v-if="!stop" class="el-icon-video-pause"></i>
              <i v-else class="el-icon-video-play"></i>
            </span>
            <span v-else class="list-num">{{ index + 1 }}</span>
            <span class="item-name" title="item.title">{{ item.title }}</span>
            <span class="item-artist" title="item.artist">{{
              item.artist
            }}</span>
          </div>
        </li>
      </ul>
      <!-- <i class="el-icon-caret-bottom"></i> -->
    </div>
    <audio
      ref="na"
      :src="music[currMusic].url"
      :autoplay="isAutoPlay"
      @timeupdate="tupdate"
      @playing="isPlaying"
      @paused="isPausd"
    ></audio>
    <div class="volume">
      <div>
        <i
          style="cursor: pointer"
          class="el-icon-s-operation"
          @click="volClick"
        ></i>
      </div>
      <el-slider
        class="yinliang"
        v-model="value2"
        @input="changeVolume"
      ></el-slider>
    </div>
  </div>
</template>

<script>
import Slider from "../content/Slider";
import { myAxios } from "../../network/myaxios";
import { setInterval } from "timers";
import { log } from "util";
import Lyric from "lyric-parser";
import { lyricItem } from "./playList";
export default {
  components: {
    Slider,
  },
  data() {
    return {
      listShow: false,
      isAutoPlay: false,
      stop: true,
      isPaused2: false,
      isPlayed: false,
      mTime: "00:00",
      nTime: "00:00",
      when: 0,
      isDown: false,
      music: [
        {
          id: "",
          artist: "",
          pic: "",
          title: "",
          url: "",
        },
      ],
      lyric: [],
      isMove: false, //是否在拖动进度条
      currMusic: 0,
      value2: 70,
      drawer: false,
      showCloseBtn: false,
      currLyric: 0,
      //评论数据
      total: 0,
      commentPage: 0,
      comments: [],
      // commentTime: 0,
      onRoll: false,
      timer: Object,
    };
  },
  filters: {
    formatDate: function (value) {
      let newVal = new Date(value);
      let Y = newVal.getFullYear() + "年";
      let M =
        (newVal.getMonth() + 1 < 10
          ? "0" + (newVal.getMonth() + 1)
          : newVal.getMonth() + 1) + "月";
      var D =
        newVal.getDate() < 10
          ? "0" + newVal.getDate() + "日"
          : newVal.getDate() + "日";
      return Y + M + D;
    },
  },
  watch: {
    value2(){
      if(this.value2!==0){
        this.$store.commit('changeVol',this.value2)
      }
    },
    currMusic() {
      this.$bus.$emit("detailplay", this.music[this.currMusic].id); //title,this.music[this.currMusic].artist
      this.getLyric();
      this.getMusicComment();
      this.$refs.mbar.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      this.commentPage = 0;
    },
    drawer() {
      if (this.drawer == true) {
        setTimeout(() => {
          this.$refs.mbar.scrollTo({
            top: 0,
            // 平滑过渡
            behavior: "smooth",
          });
        }, 200);
      }
    },
  },
  computed: {},
  created() {
    myAxios({
      url: "http://localhost:3000/song/url", //192.168.0.199
      methods: "get",
      params: {
        id: 1462334414,
      },
    }).then((res) => {
      myAxios({
        url: "http://localhost:3000/song/detail",
        methods: "get",
        params: {
          ids: 1462334414,
        },
      }).then((res2) => {
        let detail = {};
        detail.id = res2.songs[0].id;
        detail.title = res2.songs[0].name;
        detail.pic = res2.songs[0].al.picUrl;
        detail.artist = res2.songs[0].ar[0].name;
        detail.url = res.data[0].url;
        this.music[0] = detail;
        this.$refs.na.load();
      });
    });
    if (this.music[0].url == "") {
      this.stop = false;
    }
    myAxios({
      url: "http://localhost:3000/lyric",
      methods: "get",
      params: {
        id: 1462334414,
      },
    }).then((res) => {
      this.parseLyric(res.lrc.lyric);
    });
    myAxios({
      url: "http://localhost:3000/comment/music",
      methods: "get",
      params: {
        id: 1462334414,
        limit: 20,
        offset: this.commentPage,
      },
    }).then((res) => {
      this.comments = res.comments;
      this.total = res.total;

      // console.log(res);
    });
    
    this.$store.commit('changeVol',this.value2)
  },
  mounted() {
    let interval1 = setInterval(() => {
      this.$bus.$emit("detailplay", this.music[this.currMusic].id);
    }, 1000);
    this.$bus.$on("mvPlay", () => {
      if ((this.stop = true)) {
        this.playClick();
      }
    });
    //接收Personalized组件传来的值
    this.$bus.$on("changeSong", (res) => {
      this.music.push(res);
      this.music = this.Es5duplicate(this.music, "url");
      this.currMusic = this.music.length - 1;
      this.stop = true;
      this.$refs.na.load();
      this.isAutoPlay = true;
      this.getLyric();
      this.getMusicComment();
      // console.log(this.music);
    });
    //接收歌单详情传来的所有音乐
    this.$bus.$on("gedanplay", (list, index) => {
      // if (this.music !== list) {
      this.music = list;
      // }
      this.currMusic = index;
      this.isAutoPlay = true;
      this.$refs.na.load();
      this.getLyric();
      this.getMusicComment();
    });
    this.$bus.$on("searchSong", (res) => {
      this.drawer = false;
    });
  },

  methods: {
    openBar() {
      this.drawer = true;
      setTimeout(() => {
        this.showCloseBtn = true;
      }, 400);
    },
    pageChange(i) {
      this.commentPage = i - 1;
      this.getMusicComment();
      this.$refs.mbar.scrollTo({
        top: 520,
        behavior: "smooth",
      });
    },
    parseLyric(lyric) {
      let RegExp = /\[(\d*:\d*\.\d*)\]/;
      let arr = [],
        timeArr = [],
        lyricArr = [],
        mergeArr = [];

      /**将歌词转换成数组 */
      arr = lyric.split("\n");
      console.log(arr);
      for (let i of arr) {
        /**获取歌词 */
        let lrc = i.split("]")[1];
        // console.log(lrc);
        if (lrc == "" || lrc == undefined) continue;
        lyricArr.push(lrc);

        /**处理时间 */
        if (RegExp.exec(i)) {
          let resTime = RegExp.exec(i)[1];
          let resTime2 = resTime.split(":");
          let min = parseInt(resTime2[0]) * 60;
          let sec = parseFloat(resTime2[1]);
          let time = parseFloat(Number(min + sec).toFixed(2)); //toFixed返回值是String
          timeArr.push(time);
        }
      }

      /**合并数组 */
      for (let i = 0, length = timeArr.length; i < length; i++) {
        let obj = new lyricItem(timeArr[i], lyricArr[i]);
        mergeArr.push(obj);
      }
      /**排序 */
      this.lyric = mergeArr.sort((a, b) => {
        return a.time - b.time;
      });
      // this.length = this.lyricArray.length;
      // console.log(this.lyricArray);
    },

    getLyric() {
      myAxios({
        url: "http://localhost:3000/lyric",
        methods: "get",
        params: {
          id: this.music[this.currMusic].id,
        },
      }).then((res) => {
        if (res.lrc) {
          this.parseLyric(res.lrc.lyric);
        } else {
          this.lyric = [{ lyric: "还没有歌词喔" }];
        }
      });
    },
    getMusicComment() {
      myAxios({
        url: "http://localhost:3000/comment/music",
        methods: "get",
        params: {
          id: this.music[this.currMusic].id,
          limit: 20,
          offset: this.commentPage * 20,
        },
      }).then((res) => {
        this.comments = res.comments;
        this.total = res.total;
      });
    },
    itemClick(index) {
      this.currMusic = index;
    },
    listOpen() {
      this.listShow = !this.listShow;
    },
    //加减音量
    changeVolume() {
      this.$refs.na.volume = this.value2 / 100;
    },
    //点击静音
    volClick() {
      if (this.value2 !== 0) {
        this.value2 = 0;
      } else {
        this.value2 = this.$store.state.vol;
      }
    },
    //监听是否正在播放
    isPlaying() {
      this.stop = true;
      this.isPlayed = true;
      this.isPaused2 = false;
      this.$refs.cd.style.transform = "rotate(-10deg)";
    },
    //监听是否暂停
    isPausd() {
      this.stop = false;
      this.isPaused2 = true;
      this.$refs.cd.style.transform = "rotate(-55deg)";
    },
    //数字前补零（数字，补到几位数）
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    md() {
      this.isMove = true;
    },
    mu() {
      this.isMove = false;
    },
    tupdate() {
      //只有在不拖拽进度条的时候才更新当前播放时间
      if (!this.isMove) {
        this.changeNTime();
        this.changeMTime();
      }
      if (this.$refs.na.ended) {
        this.next();
      }

      for (let i = 0; i < this.lyric.length; i++) {
        if (
          this.$refs.na.currentTime >= this.lyric[i].time && this.lyric[i + 1]
            ? this.$refs.na.currentTime < this.lyric[i + 1].time
            : ""
        ) {
          this.currLyric = i;
        } else if (this.$refs.na.currentTime <= 0.5) {
          this.currLyric = 0;
        } else if (
          this.$refs.na.currentTime > this.lyric[this.lyric.length - 1].time
        ) {
          this.currLyric = this.lyric.length - 1;
        }
      }
      if (this.currLyric > 4 && !this.onRoll) {
        this.$refs.currli.scrollTo({
          top:
            this.$refs.currli.scrollHeight *
              (this.currLyric / this.lyric.length) -
            140,
          behavior: "smooth",
        });
      } else if (this.currLyric <= 4 && !this.onRoll) {
        this.$refs.currli.scrollTo({ top: 0 });
      }
    },
    roll() {
      this.onRoll = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.onRoll = false;
      }, 4000);
    },
    next() {
      if (this.music.length > 1) {
        this.currMusic++;
        this.stop = true;
      }
      if (this.currMusic > this.music.length - 1) {
        this.currMusic = 0;
      }
    },
    pre() {
      if (this.music.length > 1) {
        this.currMusic--;
        this.stop = true;
      }
      if (this.currMusic < 0) {
        this.currMusic = this.music.length - 1;
      }
    },
    //子组件传来拖动进度条的位置（value1），改变当前播放的时间
    putWhere(value1) {
      if (this.$refs.na.currentTime) {
        this.$refs.na.currentTime = parseInt(
          (this.$refs.na.duration * value1) / 500
        );
      } else {
        alert("请选择音乐");
        this.$refs.slider.value1 = 0;
      }
    },
    //刷新duration
    changeMTime() {
      if (this.$refs.na) {
        let longS = parseInt(this.$refs.na.duration);
        let mm = parseInt(longS / 60);
        let ss = longS % 60;
        let longA = this.PrefixZero(mm, 2) + ":" + this.PrefixZero(ss, 2);
        this.mTime = longA;
      }
    },
    //刷新currentTime
    changeNTime() {
      if (this.$refs.na) {
        let longN = parseInt(this.$refs.na.currentTime);
        let mmN = parseInt(longN / 60);
        let ssN = longN % 60;
        let longB = this.PrefixZero(mmN, 2) + ":" + this.PrefixZero(ssN, 2);
        this.nTime = longB;
        this.when = parseInt(
          (this.$refs.na.currentTime / this.$refs.na.duration) * 500
        );
        this.$refs.slider.value1 = this.when;
      }
    },
    //点击播放
    playClick() {
      if (this.music[0].url == "") {
        alert("没有歌曲");
      } else {
        this.stop = !this.stop;
      }
      if (this.stop == true) {
        this.$refs.na.play();
      } else if (this.stop == false) {
        this.$refs.na.pause();
        this.isPaused2 = true;
        this.$refs.cd.style.transform = "rotate(-55deg)";
      }
    },
    //去掉重复音乐(倒叙遍历是去掉数组中靠前的重复元素，正序则是去掉靠后的重复元素)
    Es5duplicate(arr, type) {
      var newArr = [];
      var tArr = {};
      if (arr.length == 0) {
        return arr;
      } else {
        if (type) {
          for (var i = arr.length - 1; i >= 0; i--) {
            if (!tArr[arr[i][type]]) {
              newArr.unshift(arr[i]);
              tArr[arr[i][type]] = true;
            }
          }
          return newArr;
        } else {
          for (var i = arr.length - 1; i >= 0; i--) {
            if (!tArr[arr[i]]) {
              newArr.unshift(arr[i]);
              tArr[arr[i]] = true;
            }
          }
          return newArr;
        }
      }
    },
  },
};
</script>

<style>
.bottom-bar {
  min-width: 1400px;
  height: 60px;
  width: 100%;
  background-color: rgb(51, 51, 51);
  position: absolute;
  bottom: 0px;
  display: flex;
  z-index: 10;
}
.detail {
  position: absolute;
  width: 250px;
  height: 70px;
  bottom: 60px;
  padding-top: 5px;
  border-top: 1px solid rgb(56, 56, 56);
  background-color: rgb(34, 34, 34);
  display: flex;
  border-radius: 40px 40px 0 0;
  background: #343434;
  box-shadow: inset 20px 20px 60px #2c2c2c, inset -20px -20px 60px #3c3c3c;
}
.detail-pic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 10px;
}
.turn {
  /* animation: run 15s infinite linear; */
  animation: run 30s infinite linear;
}
.pause {
  animation-play-state: paused;
}
@keyframes run {
  from {
    transform: rotateZ(0);
  }

  to {
    transform: rotateZ(360deg);
  }
}
.detail-pic img {
  width: 100%;
}
.text {
  margin-left: 12px;
}
.text span {
  display: block;
  position: absolute;
}
.text .song-name {
  /* text-overflow: -o-ellipsis-lastline; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* line-clamp: 2; */
  -webkit-box-orient: vertical;
  /* white-space: nowrap;  */
  /* 禁止文字折行 */

  text-overflow: ellipsis;
  width: 150px;
  /* height: 40px; */
  color: rgb(218, 218, 218);
  top: 6px;
  font-size: 15px;
}
.text .artist-name {
  white-space: nowrap; /* 禁止文字折行 */
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  height: 20px;
  color: rgb(148, 148, 148);
  font-size: 15px;
  bottom: 6px;
}
.play {
  width: 40px;
  height: 40px;
  border: 1px solid rgb(150, 150, 150);
  border-radius: 50%;
  position: relative;
  top: 8px;
  left: 100px;
}
.play:hover {
  border: 1px solid #eee;
}
.pre {
  height: 30px;
  width: 30px;
  position: absolute;
  color: #eee;
  font-size: 24px;
  left: 50px;
  top: 14px;
  border: 1px solid rgb(150, 150, 150);
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
}
.pre:hover {
  border: 1px solid #eee;
}
.next {
  height: 30px;
  width: 30px;
  position: absolute;
  color: #eee;
  font-size: 24px;
  left: 162px;
  top: 14px;
  border: 1px solid rgb(150, 150, 150);
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
}
.next:hover {
  border: 1px solid #eee;
}
.play-go img {
  position: absolute;
  width: 34px;
  height: 34px;
  left: 3px;
  top: 3px;
}
.play-stop img {
  position: absolute;
  width: 32px;
  height: 32px;
  left: 6px;
  top: 4px;
}
.time {
  position: relative;
  width: 55%;
  left: 260px;
  height: 50px;
  top: 10px;
}
.ntime {
  position: relative;
  left: 249px;
  top: 18px;
  color: #eee;
  height: 40px;
}
.mtime {
  position: relative;
  left: 274px;
  top: 18px;
  color: #eee;
  height: 40px;
}
.volume {
  width: 120px;
  height: 50px;
  position: absolute;
  left: 88%;
  top: 5px;
  display: flex;
  align-items: center;
}
.el-icon-s-operation {
  font-size: 20px;
  color: rgb(175, 175, 175);
}
.el-icon-s-operation:hover {
  color: #eee;
}
.volume .el-slider {
  width: 80px;
  margin-left: 15px;
}
.yinliang .el-slider__button-wrapper {
  height: 18px;
  width: 18px;
  top: -10px;
}
.yinliang .el-slider__button-wrapper .el-slider__button {
  width: 6px;
  height: 6px;
  background-color: rgb(238, 128, 2);
  border: 3px solid rgb(238, 128, 2);
}
.yinliang .el-slider__runway .el-slider__bar {
  background-color: rgba(238, 128, 2, 0.712);
}
.now-list-button {
  /* background-color: #fff; */
  height: 24px;
  display: flex;
  top: 19px;
  position: absolute;
  left: 84%;
  align-items: center;
}
.now-list-button i {
  color: rgb(148, 147, 147);
  font-size: 22px;
}
.now-list-button span {
  display: block;
  width: 30px;
  height: 20px;
  color: rgb(179, 179, 179);
  /* padding-left: 18px; */
  padding-right: 3px;
  background-color: rgb(68, 68, 68);
  text-align: center;
  line-height: 20px;
  margin-left: -3px;
  /* margin-top: -2px; */
  border-radius: 0 10px 10px 0;
}
.now-list {
  text-align: center;
  position: absolute;
  width: 400px;
  height: 300px;
  bottom: 60px;
  left: 72%;
  background-color: rgba(104, 104, 104, 0.95);
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  z-index: 20;
}
.now-list ul {
  height: 270px;
  overflow: auto;
}
.now-list li:hover {
  background-color: rgb(94, 92, 92);
}
.now-list ul::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.now-list ul::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

  background-color: #5c5c5c;
}
.now-list ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #999999;
}
/* .now-list ul */
.now-list-button:hover .el-icon-tickets {
  color: rgb(235, 235, 235);
}
.now-list .list-head {
  position: relative;
  color: rgba(255, 255, 255, 0.829);
  line-height: 28px;
  margin: 0;
  display: block;
  font-size: 17px;
  width: 100%;
  height: 30px;
  background-color: rgb(133, 133, 133);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
.list-li {
  list-style: none;
}
/* .list-li:nth-child(2n){
  background-color: rgb(56, 56, 56);
} */
.list-li div {
  align-items: center;
  height: 30px;
  display: flex;
}

.list-li .list-num {
  display: block;
  width: 40px;
  color: #fff;
}
.list-li .item-name {
  text-align: start;
  display: block;
  white-space: nowrap; /* 禁止文字折行 */
  overflow: hidden;
  text-overflow: ellipsis;
  width: 170px;
  font-size: 14px;
}
.list-li .item-artist {
  text-align: start;
  display: block;
  white-space: nowrap; /* 禁止文字折行 */
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  margin-left: 10px;
  color: rgb(177, 177, 177);
  font-size: 12px;
}
.list-icon {
  display: block;
  width: 40px;
}
.liActive {
  background-color: rgb(80, 80, 80) !important;
}
.bottom-bar .el-icon-caret-bottom {
  position: absolute;
  left: 84%;
  top: -11px;
  font-size: 30px;
  color: rgb(104, 104, 104);
}
.el-icon-video-play {
  color: rgb(172, 1, 1);
  font-size: 18px;
}
.el-icon-video-pause {
  color: rgb(155, 3, 3);
  font-size: 18px;
  font-weight: 700;
}

.music-bar {
  position: fixed;
  width: 100vw;
  background-color: rgb(20, 20, 20);
  /* top: 5.6vh; */
  top: 52px;
  /* top: 0; */
  bottom: 60px;
  overflow-y: auto;
  z-index: 7;
  /* box-shadow:0 0 500px 500px #161616 inset; */
}

.music-bar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.music-bar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #5c5c5c;
}
.music-bar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #999999;
}
/*动画 */
.mbd-enter-active,
.mbd-leave-active {
  transition: all 0.3s;
}
.mbd-enter,
.mbd-leave-to {
  transform: translateX(-500px) translatey(500px);
  opacity: 0;
}

.cbd-enter-active,
.cbd-leave-active {
  transition: all 0.6s;
}
.cbd-enter,
.cbd-leave-to {
  /* transform: translateX(-500px) translatey(500px); */
  opacity: 0;
}

.barmiddle {
  width: 100%;
  height: 520px;
  overflow: hidden;
  background-color: rgb(20, 20, 20);
}
.back-img {
  min-width: 1000px;
  height: 520px;
  overflow: hidden;
  /* box-shadow: 0 0 200px 200px rgb(2, 2, 2) inset; */
  box-shadow: 0 -100px 80px 60px rgb(7, 7, 7) inset;
}

.back-img > img {
  position: relative;
  width: 100%;
  top: -40%;
  opacity: 0.1;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(10px);
}
.back-middle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  min-width: 900px;
  /* width: 900px; */
  height: 520px;
  z-index: 10;
}
.turn-bar {
  position: absolute;
  /* float: left; */
  top: 20px;
  width: 300px;
  height: 300px;
  background-color: rgba(66, 66, 66, 0.5);
  margin: 30px 30px;
  border-radius: 50%;
}
.turn-bar-in {
  position: absolute;
  width: 290px;
  height: 290px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 50%;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    159deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(3, 2, 51, 0.5298494397759104) 0%,
    rgba(0, 0, 0, 1) 0%,
    rgba(74, 74, 74, 0.3337710084033614) 36%,
    rgba(255, 255, 255, 0.5886729691876751) 50%,
    rgba(74, 74, 74, 0.3309698879551821) 64%,
    rgba(0, 0, 0, 1) 100%
  );
}
.turn-bar-pic {
  position: absolute;
  width: 210px;
  height: 210px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 50%;
  overflow: hidden;
}
.turn-bar-pic img {
  width: 100%;
  height: 100%;
}
.lyric-board {
  position: absolute;
  right: 70px;
  width: 460px;
  height: 100%;
  /* background-color: #bfa; */
}
.lyric-content {
  text-align: center;
  position: absolute;
  height: 360px;
  width: 460px;
  margin-top: 10px;
  overflow-y: auto;
  /* bottom:80px; */
}

.lyric-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.lyric-content::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);

  /* background-color: #5c5c5c; */
}
.lyric-content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(71, 71, 71, 0.2);
}
/* .now-list ul */
/* .now-list-button:hover .el-icon-tickets {
  color: rgb(235, 235, 235);
} */

.board-title {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
  height: 100px;
  /* background-color: yellow; */
}
.board-title-name {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* line-clamp: 2; */
  -webkit-box-orient: vertical;
  font-size: 26px;
  color: rgb(184, 184, 184);
}
.board-title-artist {
  margin-bottom: 4px;
  text-align: center;
  color: rgb(168, 168, 168);
  font-size: 16px;
}
.lyric-li {
  list-style: none;
  color: rgb(124, 124, 124);
  margin-bottom: 15px;
  /* text-align: center; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* line-clamp: 2; */
  -webkit-box-orient: vertical;
}

.closeBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 100px;
  right: 14%;
  width: 65px;
  height: 65px;
  z-index: 50;
  border-radius: 24px;
  background: linear-gradient(145deg, #404040, #363636);
  box-shadow: 5px 5px 12px #2e2e2e, -5px -5px 12px #4a4a4a;
}
.el-icon-bottom-left {
  font-size: 42px;
  margin-bottom: 4px;
  color: rgb(138, 138, 138);
}
.closeBtn:hover .el-icon-bottom-left {
  color: rgb(168, 168, 168);
}
.closeBtn:hover {
  border-radius: 24px;
  background: linear-gradient(145deg, #363636, #404040);
  box-shadow: 5px 5px 12px #2e2e2e, -5px -5px 12px #4a4a4a;
}
.closeBtn:active {
  border-radius: 24px;
  background: #3c3c3c;
  box-shadow: inset 5px 5px 12px #2e2e2e, inset -5px -5px 12px #4a4a4a;
}
.lyactive {
  color: rgb(2, 172, 163);
  font-weight: 700;
  font-size: 18px;
  transition: 0.4s;
  /* font-size: 20px; */
}
.cd-e {
  position: absolute;
  /* background-color: yellow; */
  width: 80px;
  height: 100px;
  left: 140px;
  top: -40px;
  z-index: 18;
  transition: 0.3s;
  transform: rotate(-55deg); /*-55,-10 */
  /* overflow: hidden; */
}
.cd-e-long {
  position: absolute;
  left: 46%;
  top: 50%;
}
.cd-e-circle {
  position: absolute;
  left: 39%;
  top: 40%;
}
.cd-e-circle img {
  width: 20px;
}

.cd-e-long img {
  width: 80px;
}
.comment {
  width: 950px;
  /* background-color: #bfa; */
  margin: 0 auto;
}
.comment-li-pic {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.comment-li-pic img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.comment li {
  border-bottom: 1px solid rgba(51, 51, 51, 0.5);
  /* margin-bottom: 10px; */
  list-style: none;
  padding-top: 10px;
  padding-bottom: 5px;
  display: flex;
  font-size: 14px;
}
.comment-li-content {
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}
.comment-li-content div {
  color: rgb(86, 139, 255);
}
.comment-li-content div span {
  display: block;
  /* margin-left: 30px; */
  color: rgb(173, 173, 173);
}
.comment-li-content .li-time {
  /* position: absolute;
  bottom: 0; */
  margin-left: 690px;
  margin-top: 10px;
  color: rgb(80, 80, 80);
}
.pages {
  margin: 20px 240px;
}
.comment .comment-title {
  color: rgb(184, 184, 184);
  margin: 20px 0;
  font-size: 20px;
}
</style>