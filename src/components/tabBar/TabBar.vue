<template>
  <div class="tab-bar">
    <div class="wyyyy">
      <i class="el-icon-s-help"></i> BOOM 音乐
    </div>
    <div class="tb-btn">
      <div class="btn-left" style="cursor:pointer;" @click="back">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="btn-right" style="cursor:pointer;" @click="forward">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="serch-inp">
      <input @focus="iptFocus" @blur="iptblur" size="mini" v-model="input" @keyup.enter="searchClick" placeholder="搜索音乐" />
      <i class="el-icon-search" style="cursor:pointer;"  @click="searchClick"></i>
    </div>
    <div v-if="showFocus===true&&input&&nameReal " class="search-res">
      <li
        class="search-li"
        v-for="(item,index) in searchArr"
        :key="index"
        @click="liClick(item.id)"
        style="cursor:pointer;"
      >
        <div class="el-icon-video-play"></div>
        <span>{{item.name}}-{{item.artists[0].name}}</span>
      </li>
    </div>

    <div
      v-if="isLogin===false"
      class="no-login"
      style="cursor:pointer;"
      @click="centerDialogVisible = true"
    >
      <i class="el-icon-s-custom"></i>未登录
    </div>
    <div v-else class="login">
      <img :src="userInfo.profile.avatarUrl" alt />
      <div>{{userInfo.profile.nickname}}</div>
      <span @click="logout" style="cursor:pointer;">退出</span>
    </div>
    <el-dialog title="登录" :visible.sync="centerDialogVisible" :modal="false" width="30%" center>
      <el-input placeholder="请输入手机" type="tel" v-model="tel" clearable></el-input>
      <el-input class="psw" placeholder="请输入密码" v-model="password" show-password></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="login">登 录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { myAxios } from "../../network/myaxios";
import { log } from "util";
import md5 from "js-md5";
export default {
  data() {
    return {
      input: "",
      showFocus: false,
      nameReal: false,
      searchArr: [],
      centerDialogVisible: false,
      tel: "",
      password: "",
      isLogin: false,
      userInfo: {},
    };
  },
  created() {},
  mounted() {
    if (localStorage.user_token && localStorage.user_id) {
      // console.log(this.isLogin);
      myAxios({
        url: "http://localhost:3000/user/detail",
        methods: "get",
        params: {
          uid: localStorage.user_id,
        },
      }).then((res) => {
        this.userInfo = res;
        this.isLogin = true;
      });
    }
  },
  watch: {
    input() {
      if (this.input.replace(/^\s*|\s*$/g, "")) {
        myAxios({
          url: "http://localhost:3000/search",
          methods: "get",
          params: {
            keywords: this.input,
            limit: 6,
            type: 1,
          },
        }).then((res) => {
          this.nameReal = res.result.hasMore;
          this.searchArr = res.result.songs;
          // console.log(res);
        });
      }
    },
  },
  methods: {
    back() {
      // console.log(this.$route);
      if (this.$route.path.includes("search")) {
        this.$router.push("/home/tuijian");
      } else {
        history.go(-1);
      }
    },
    forward() {
      history.go(1);
    },
    iptFocus() {
      this.showFocus = true;
    },
    iptblur() {
      setTimeout(() => {
        this.showFocus = false;
      }, 100);
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

          if (detail.url) {
            this.$bus.$emit("changeSong", detail);
          }
        });
      });
    },
    searchClick() {
      if (
        this.input &&
        this.input !== " " &&
        this.$route.params.name !== this.input
      ) {
        this.$router.push("/search/" + this.input);
        
      }
      // this.input = ""
      this.showFocus = false;
      // console.log(this.$route.params);
      this.$bus.$emit("searchSong", this.input);
    },

    login() {
      myAxios({
        url: "http://localhost:3000/login/cellphone",
        methods: "get",
        params: {
          phone: parseInt(this.tel),
          md5_password: md5(this.password),
        },
      })
        .then((res) => {
          if (res.code == 200) {
            localStorage.setItem("user_token", res.token);
            localStorage.setItem("user_id", res.account.id);
            localStorage.setItem("user_cookie", res.cookie);
            this.centerDialogVisible = false;
            this.$message({
              message: "登陆成功",
              type: "success",
            });
            location.reload();
          }
        })
        .catch((err) => {
          this.$message.error("登陆失败，请检查登录信息是否正确");
        });
    },
    logout() {
      localStorage.removeItem("user_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_cookie");
      location.reload();
    },
  },
};
</script>

<style>
.tab-bar {
  position: relative;
  min-width: 1000px;
  height: 50px;
  background-color: #333;
  display: flex;
  align-items: center;
  border-bottom: 2px solid rgb(192, 7, 7);
  z-index: 800;
}
.wyyyy {
  margin-left: 15px;
  font-size: 17px;
  font-weight: 600;
  color: #eee;
}
.tb-btn {
  display: flex;
  margin-left: 60px;
  margin-right: 40px;
}
.tb-btn > div {
  color: #eee;
  background-color: #333;
  width: 25px;
  /* border: 1px solid rgb(27, 27, 27); */
  text-align: center;
}
.btn-left {
  border: 1px solid rgb(27, 27, 27);
  border-right: none;
  border-radius: 3px 0 0 3px;
}
.btn-right {
  border: 1px solid rgb(27, 27, 27);
  border-radius: 0 3px 3px 0;
}
.serch-inp {
  position: relative;
}
input {
  width: 180px;
  height: 12px;
  background-color: rgb(27, 27, 27);
  border: 0;
  border-radius: 15px;
  padding: 5px 15px;
  color: rgb(207, 207, 207);

  font-size: 13px;
}
input:focus {
  outline: none;
}
.el-icon-search {
  position: absolute;
  color: #eee;
  font-size: 13px;
  right: 8px;
  top: 5px;
}
.search-res {
  background-color: rgb(75, 75, 75);
  color: rgb(204, 204, 204);
  position: absolute;
  width: 216px;
  height: 200px;
  top: 52px;
  left: 290px;
  z-index: 100;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.5);
}
.search-li {
  height: calc(100% / 6);
  padding-top: 7px;
  list-style: none;
  font-size: 13px;
  white-space: nowrap; /* 禁止文字折行 */
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
}
.search-li div {
  margin-left: 5px;
}
.search-li .el-icon-video-play {
  color: rgb(243, 74, 74);
  font-size: 15px;
}
.search-li:hover {
  background-color: rgb(109, 108, 108);
}
.no-login {
  position: absolute;
  color: rgb(189, 189, 189);
  font-size: 14px;
  right: 20%;
  align-items: center;
}
.no-login .el-icon-s-custom {
  font-size: 20px;
  margin: 5px;
}
.psw {
  margin-top: 20px;
}
.login {
  position: absolute;

  font-size: 15px;
  right: 20%;
  align-items: center;
  display: flex;
}
.login img {
  width: 25px;
  border-radius: 50%;
}
.login div {
  color: rgb(136, 176, 250);
  margin-left: 10px;
}
.login span {
  color: rgb(182, 182, 182);
  font-size: 12px;
  margin-left: 10px;
}
</style>