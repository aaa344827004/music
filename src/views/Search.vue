<template>
  <div class="search-outer">
    <div class="search-xx">
      <span>搜索</span>
      <span class="blue">"{{searchName}}"</span>
      <span>找到{{songCount}}例{{tbar[currli]}}</span>
    </div>
    <div class="search-tab-bar">
      <li
        :class="{stbactive:currli===index}"
        @click="stbClick(index)"
        class="stb-li"
        v-for="(item,index) in tbar"
        :key="index"
      >{{item}}</li>
    </div>
    <div v-show="currli===0">
      <table class="danqu">
        <tr>
          <th class="li-num">#</th>
          <th>歌名</th>
          <th>歌手</th>
          <th>专辑</th>
        </tr>
        <tr
          style="cursor:pointer;"
          v-for="(item,index) in songs"
          :key="index"
          @click="liClick(item.id)"
          v-show="item.url!==null"
        >
          <!-- v-show="item.id!==''" -->
          <td>{{index+1}}</td>
          <td>{{item.name}}</td>
          <td>{{item.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
        </tr>
      </table>
    </div>
    <div v-show="currli===1"></div>
    <div class="search-mv" v-show="currli===2">
      <div class="mv-list">
        <li class="mv-list-item" v-for="(item,index) in mvlists" :key="index">
          <div class="mv-list-item-pic">
            <img :src="item.cover" alt />
            <div class="mv-play" @click="mvClick(item.id)" style="cursor:pointer;">
              <div class="el-icon-video-play"></div>
            </div>
          </div>
          <div class="mv-list-item-name">{{item.name}}</div>
          <div class="mv-list-item-artist">{{item.artistName}}</div>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { myAxios } from "../network/myaxios";
import { log } from "util";
export default {
  data() {
    return {
      tbar: ["单曲", "歌单", "视频"],
      currli: 0,
      searchName: "",
      type: [1, 1000, 1004],
      songCount: 0,
      songs: [],
      playlists: [],
      mvlists: [],
      
    };
  },

  created() {
    // console.log(this.$route.params.name);
    this.searchName = this.$route.params.name;
    this.getSearch();
  },
  mounted() {
    this.$bus.$on("searchSong", (res) => {
      // console.log(res);
      // if(this.searchName!==res){
      this.searchName = res;
      this.getSearch();
      // }
    });

  },
  
  methods: {
    
    stbClick(index) {
      this.currli = index;
      // console.log( this.currli);
      this.getSearch();
    },
    liClick(id) {
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
          // console.log(res.data[0].url);
          if (detail.url !== null) {
            this.$bus.$emit("changeSong", detail);
          } else {
            alert("要冲会员哦~");
          }
        });
      });
    },

    getSearch() {
      myAxios({
        url: "http://localhost:3000/search",
        methods: "get",
        params: {
          keywords: this.searchName,
          type: this.type[this.currli],
          limit: 30,
        },
      }).then((res) => {
        // console.log(res);
        if (res.result.songCount) {
          this.songs = res.result.songs;
          this.songCount = res.result.songCount;
        } else if (res.result.playlistCount) {
          this.songCount = res.result.playlistCount;
          this.playlists = res.result.playlists;
        } else if (res.result.mvCount) {
          this.songCount = res.result.mvCount;
          this.mvlists = res.result.mvs;
        }
      });
    },
    mvClick(id) {
      this.$router.push("/MVDetail/" + id);
      this.$bus.$emit("mvPlay");
    },
  
    
  },
};
</script>

<style>
.search-outer {
  display: flex;
  position: relative;
  height: calc(100vh - 112px);
  flex-flow: column;
  overflow-y: auto;
}
.search-xx {
  color: #eee;
  font-size: 13px;
  height: 60px;
  /* background-color: rgb(62, 75, 59); */
  line-height: 60px;
  margin: 0px 20px;
}
.search-xx .blue {
  color: rgb(104, 151, 252);
}
.search-tab-bar {
  height: 40px;
  /* display: flex; */
  text-align: center;
  line-height: 40px;
  margin-left: 30px;
}
.stb-li {
  padding: 0 2px;
  margin: 0 10px;
  float: left;
  list-style: none;
  color: #eee;
}
.stbactive {
  border-bottom: 4px solid rgb(199, 35, 35);
}
.danqu {
  margin: 20px 30px;
}
.li-num {
  width: 50px;
}
.search-mv {
  position: relative;
  width: 1200px;
  left: 40px;
  /* transform: translateX(-50%); */
}

</style>