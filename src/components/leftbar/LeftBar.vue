<template>
  <div class="left-bar">
    <ul class="left-bar-ul">
      <span>推荐</span>
      <li
        style="cursor:pointer;"
        v-for="(item,index) in tuijian"
        :key="index"
        :class="{active:currentIndex==index}"
        @click="itemClick(index)"
      >
        <h3 :class="item.pic"></h3>
        {{item.title}}
      </li>
    </ul>
    <ul class="collect" v-if="isLogin">
      <span>创建的歌单</span>
      <li
        @click="createClick(item.id,index)"
        style="cursor:pointer;"
        v-for="(item,index) in userCreate"
        :key="item.id"
        :class="{careteAct:createIndex==index}"
        :title="item.name"
      >
        <i class="el-icon-shopping-bag-1"></i>
        {{item.name}}
      </li>
      <!-- :class="{careteAct:createIndex==index}" -->
      <!--  :class="{countAct:countIndex==index}"-->
      <span>收藏的歌单</span>
      <li
        @click="countClick(item.id,index)"
        style="cursor:pointer;"
        v-for="(item,index) in userCount"
        :key="item.id"
        :class="{countAct:countIndex==index}"
        :title="item.name"
      >
        <i class="el-icon-shopping-bag-1"></i>
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
import { myAxios } from "../../network/myaxios";
import { log } from "util";
export default {
  data() {
    return {
      tuijian: [
        { title: "发现音乐", pic: "el-icon-discover" },
        // {title:'私人FM',pic:'el-icon-cold-drink'},
        // {title:'LOOK直播',pic:'el-icon-microphone'},
        { title: "MV", pic: "el-icon-data-line" },
        // {title:'朋友',pic:'el-icon-male'}
      ],

      routes: ["/home", "/video"],
      currentIndex: -1,
      isLogin: false,
      userCreate: [],
      userCount: [],
      createIndex: -1,
      countIndex: -1,
    };
  },
  watch: {
    $route() {
      if (this.$route.path.includes("/home")) {
        this.currentIndex = 0;
        this.createIndex = -1;
        this.counttIndex = -1;
      } else if (this.$route.path.includes("/video")) {
        this.currentIndex = 1;
        this.createIndex = -1;
        this.counttIndex = -1;
      } else if (this.$route.path.includes("/listdetail")) {
        this.createIndex = this.userCreate.findIndex((item) => {
          return item.id == this.$route.params.iid;
        });
        this.countIndex = this.userCount.findIndex((item) => {
          return item.id == this.$route.params.iid;
        });

        // console.log(this.$route);
        this.currentIndex = -1;
      }
    },
  },
  created() {
    if (this.$route.path.includes("/home")) {
        this.currentIndex = 0;
        this.createIndex = -1;
        this.counttIndex = -1;
      } else if (this.$route.path.includes("/video")) {
        this.currentIndex = 1;
        this.createIndex = -1;
        this.counttIndex = -1;
      }
    if (localStorage.user_id) {
      myAxios({
        url: "http://localhost:3000/user/playlist",
        methods: "get",
        params: {
          uid: localStorage.user_id,
        },
      }).then((res) => {
        let create = [];
        let count = [];

        for (var i = 0; i < res.playlist.length; i++) {
          if (res.playlist[i].userId == localStorage.user_id) {
            create.push(res.playlist[i]);
          } else {
            count.push(res.playlist[i]);
          }
        }
        this.userCreate = create;
        this.userCount = count;
        // console.log(this.userCreate, this.userCount);
        this.isLogin = true;

        if (this.$route.path.includes("/home")) {
          this.currentIndex = 0;
          this.createIndex = -1;
          this.counttIndex = -1;
        } else if (this.$route.path.includes("/video")) {
          this.currentIndex = 1;
          this.createIndex = -1;
          this.counttIndex = -1;
        } else if (this.$route.path.includes("/listdetail")) {
          this.createIndex = this.userCreate.findIndex((item) => {
            return item.id == this.$route.params.iid;
          });
          // console.log(this.createIndex);
          this.countIndex = this.userCount.findIndex((item) => {
            return item.id == this.$route.params.iid;
          });
          // console.log(this.countIndex);
          this.currentIndex = -1;
        }
      });
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      if (this.routes[index] !== this.$route.path) {
        this.$router.push(this.routes[index]);
      }
      this.countIndex = -1;
      this.createIndex = -1;
    },
    createClick(id, index) {
      this.createIndex = index;
      if (this.$route.path !== "/listdetail/" + id) {
        this.$router.push("/listdetail/" + id);
        // console.log(this.$route.path);
        // location.reload()
      }
      this.countIndex = -1;
      this.currentIndex = -1;
    },
    countClick(id, index) {
      this.countIndex = index;
      if (this.$route.path !== "/listdetail/" + id) {
        this.$router.replace("/listdetail/" + id);
        // console.log(this.$route.path);
        // location.reload()
      }
      this.createIndex = -1;
      this.currentIndex = -1;
    },
  },
};
</script>

<style>
.left-bar {
  float: left;
  overflow: auto;
  width: 250px;
  height: calc(100vh - 112px);
  background-color: rgb(34, 34, 34);
  color: #eee;
}
.collect {
  margin-top: 50px;
  margin-bottom: 100px;
}
.collect i {
  font-size: 17px;
  line-height: 40px;
  margin-right: 5px;
  color: rgb(221, 135, 135);
}
.collect span {
  margin-top: 15px;
}
.collect li {
  /* font-size: 13px !important; */
  color: rgb(179, 179, 179);
  height: 40px;
  width: 228px;
  line-height: 40px;
  padding-left: 15px;
  font-size: 14px;
  list-style: none;
  /* display: flex; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* line-clamp: 1; */
  -webkit-box-orient: vertical;
  /* white-space: nowrap;  */
  /* 禁止文字折行 */

  /* text-overflow: ellipsis; */
  /* height: 40px; */
  border-radius: 5px;
}
.left-bar-ul span,
.collect span {
  display: block;
  font-size: 14px;
  color: rgb(196, 196, 196);
  margin-left: 10px;
  height: 30px;
  line-height: 30px;
}

.left-bar-ul li {
  color: rgb(190, 190, 190);
  height: 40px;
  line-height: 40px;
  padding-left: 15px;
  font-size: 15px;
  list-style: none;
  display: flex;
}
.left-bar-ul li h3 {
  width: 25px;
  font-size: 20px;
  text-align: center;
  margin-right: 15px;
}
.left-bar-ul li img {
  width: 20px;
  height: 20px;
}
.left-bar-ul li:hover {
  color: #fff;
  background-color: rgb(78, 78, 78);
}
.collect li:hover {
  color: #fff;
  background-color: rgb(78, 78, 78);
}
.left-bar::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
.left-bar::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  background: rgba(223, 223, 223, 0.2);
}
.left-bar::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
.left-bar-ul .active {
  background-color: rgb(63, 63, 63);
  border-left: 3px red solid;
  color: #fff;
  padding-left: 12px;
}
.careteAct {
  background-color: rgb(63, 63, 63);
  border-left: 3px red solid;
  color: #fff !important;
  padding-left: 12px;
}
.countAct {
  background-color: rgb(63, 63, 63);
  border-left: 3px red solid;
  color: #fff !important;
  padding-left: 12px;
}
.left-bar h3 {
  margin-top: 11px;
}
</style>