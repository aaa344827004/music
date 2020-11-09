<template>
  <div class="list-detail">
    <div class="detail-top">
      <div class="detail-img">
        <img :src="gedanDetail.coverImgUrl" />
      </div>
      <div class="list-context">
        <div class="list-title">{{ gedanDetail.name }}</div>
        <div class="uesr"></div>
        <div class="list-control">
          <div class="play-all" style="cursor: pointer" @click="listPlay(0)">
            全部播放
          </div>
          <div>收藏 ({{ gedanDetail.subscribedCount }})</div>
          <div>分享 ({{ gedanDetail.shareCount }})</div>
        </div>
      </div>
    </div>
    <div>
      <div class="list-head">歌曲列表</div>
      <table>
        <!-- v-if="musicList.length===listLength"  -->
        <tr>
          <th class="xh">#</th>
          <th>歌名</th>
          <th>歌手</th>
          <th>专辑</th>
        </tr>
        <tr
          v-show="listShow"
          class="detail-tr"
          style="cursor: pointer"
          @click="listPlay(index)"
          v-for="(item, index) in musicList"
          :key="index"
          :class="{ high: currIndex == index }"
        >
          <!-- currIndex==index -->
          <td v-if="nowId == item.id">
            <i class="el-icon-headset"></i>
          </td>
          <td v-else>{{ index + 1 }}</td>
          <td class="song-name">{{ item.title }}</td>
          <td>{{ item.artist }}</td>
          <td>{{ item.alname }}</td>
        </tr>

        <div class="loading" v-show="!listShow">
          加载中
          <i class="el-icon-loading"></i>
        </div>
      </table>
    </div>
  </div>
</template>

<script>
import { getListDetail } from "../network/banner";
import { myAxios } from "../network/myaxios";
import { log } from "util";
export default {
  data() {
    return {
      gedanDetail: {},
      musicList: [],
      currIndex: Number,
      listShow: false,
      nowId: Number,
    };
  },
  watch: {
    $route() {
      this._getListDetail();
    },
  },
  created() {
    this._getListDetail();
  },
  methods: {
    _getListDetail() {
      //请求歌单id
      getListDetail(this.$route.params.iid)
        .then((res) => {
          this.listShow = false;
          this.gedanDetail = res.playlist; //
        })
        .then(() => {
          this.musicList = [];
          let all = this.gedanDetail.trackIds;
          for (let i = 0; i < all.length; i++) {
            myAxios({
              url: "http://localhost:3000/song/url",
              methods: "get",
              params: {
                id: all[i].id,
              },
            }).then((res) => {
              myAxios({
                url: "http://localhost:3000/song/detail",
                methods: "get",
                params: {
                  ids: all[i].id,
                },
              }).then((res2) => {
                let detail = {};
                detail.id = res2.songs[0].id;
                detail.title = res2.songs[0].name;
                detail.artist = res2.songs[0].ar[0].name;
                detail.pic = res2.songs[0].al.picUrl;
                detail.alname = res2.songs[0].al.name;
                detail.url = res.data[0].url;
                if (detail.url !== null) {
                  this.musicList.push(detail);
                  //通过id将歌单列表排序
                  this.musicList.sort(this.compare("id"));
                }
                if (all.length > 60) {
                  if (this.musicList.length > 40) {
                    this.listShow = true;
                  }
                } else {
                  setTimeout(() => {
                    this.listShow = true;
                  }, 300);
                }
              });
            });
          }
        });
    },
    listPlay(index) {
      this.$bus.$emit("gedanplay", this.musicList, index);
      this.currIndex = index;
    },
    compare(prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      };
    },
  },
  mounted() {
    this.$bus.$on("detailplay", (res1, res2) => {
      for (let i = 0; i < this.musicList.length; i++) {
        // if (this.musicList[i].id == res1) {
        //   this.currIndex = i;
        // }
        this.nowId = res1;
      }
    });
  },
};
</script>

<style>
.list-detail {
  height: calc(100vh - 112px);
  overflow-y: auto;
}
.list-detail::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.list-detail::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #5c5c5c;
}
.list-detail::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #999999;
}
.detail-top {
  position: relative;
  display: flex;
}
.detail-img {
  margin: 30px;
  width: 210px;
  height: 210px;
  border-radius: 10px;
  overflow: hidden;
}
.detail-img img {
  width: 100%;
}
.list-context {
  margin-top: 30px;
  color: #eee;
}
.list-control {
  margin-top: 20px;
}
.list-control div {
  line-height: 40px;
  height: 40px;
  margin: 20px 0;
}
.list-control .play-all {
  background-color: rgb(165, 3, 3);
  width: 100px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 10px;
  font-size: 15px;
}
.list-head {
  color: #eee;
  font-size: 18px;
  margin-bottom: 10px;
  margin-left: 15px;
}
table {
  margin-bottom: 15px;
  border: 1px solid #333;
  margin-left: 15px;
  border-collapse: collapse;
}
.xh {
  width: 50px;
}
table th {
  height: 40px;
  font-size: 18px;
  color: rgb(170, 170, 170);
  border: 1px solid #333333;
}
.el-icon-headset {
  color: red;
}
table td {
  height: 30px;
  color: rgb(170, 170, 170);
  font-size: 12px;
  border-bottom: 1px solid #333;
}
table tr:nth-child(2n + 3) {
  background-color: rgb(46, 46, 46);
}
.detail-tr:hover {
  background-color: rgb(58, 58, 58);
}
table .high {
  background-color: rgb(87, 87, 87) !important;
}
table .detail-tr {
  height: 35px;
}
th {
  width: 400px;
  text-align: start;
  padding-left: 10px;
}
td {
  padding-left: 10px;
}
.song-name {
  font-size: 15px;
  color: #eee;
}
.loading {
  position: absolute;
  left: 50%;
  color: #eee;
  margin-top: 30px;
}
</style>