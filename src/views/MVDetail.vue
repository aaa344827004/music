<template>
  <div class="mv-detail" ref="mvPage">
    <div class="mv-detail-middle" >
      <div>
        <div class="mv-title">
          <h3>{{mvDetail.name}} <span>{{mvDetail.artistName}}</span></h3>
        </div>
        <video autoplay controls :volume="0.5" :src="mvUrl.url"></video> <!--  v-if="mvUrl.url"-->
        <!-- <div v-else>{{mvUrl.msg}}</div> -->
        <div class="mv-desc">
          <h3>MV简介</h3>
          <p v-if="mvDetail.desc!==''">{{mvDetail.desc}}</p>
          <p v-else>暂无简介</p>
        </div>
        <div class="comment">
          <div class="comment-title">精彩评论</div>
          <ul>
            <li class="comment-li" v-for="(item,index) in comments" :key="index">
              <div class="comment-li-pic">
                <img :src="item.user.avatarUrl" alt />
              </div>
              <div class="comment-li-content">
                <div>
                  {{item.user.nickname}} :
                  <span>{{item.content}}</span>
                </div>
                <div class="li-time">{{item.time | formatDate}}</div>
              </div>
            </li>
          </ul>
          <el-pagination
            class="pages"
            layout="prev, pager, next"
            :total="total"
            :current-page="commentPage+1"
            :page-size="20"
            @current-change="pageChange"
            :background="true"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { myAxios } from "../network/myaxios";
export default {
  data() {
    return {
      mvDetail:{},
      mvUrl:{},
      total: 0,
      commentPage: 0,
      comments: [],
    };
  },
  created() {
    this.getMVDetail(parseInt(this.$route.params.id))
    this.getMVUrl(parseInt(this.$route.params.id))
    this.getMVComment(parseInt(this.$route.params.id))
    
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
  methods: {
    pageChange(i) {
      this.commentPage = i - 1;
      this.getMVComment(parseInt(this.$route.params.id))
      this.$refs.mvPage.scrollTo({
        top: 620,
        behavior: "smooth",
      });
      // this.getMusicComment();
      // this.$refs.mbar.scrollTo({
      //   top: 520,
      //   behavior: "smooth",
      // });
    },
    getMVDetail(id) {
      myAxios({
        url: "http://localhost:3000/mv/detail",
        methods: "get",
        params: {
          mvid:id
        },
      }).then((res)=>{
        if(res.code==200){
          this.mvDetail = res.data
        }
        // console.log(res);
      })
    },
    getMVUrl(id) {
      myAxios({
        url: "http://localhost:3000/mv/url",
        methods: "get",
        params: {
          id,
        },
      }).then((res)=>{
        if(res.code==200){
          this.mvUrl = res.data
        }
        if(!res.data.url){
          this.$message({
            message:res.data.msg,
            offset:80,
            showClose:true,
            duration:5000
          });
          // alert(res.data.msg)
        }
        // console.log(res);
      })
    },
    getMVComment(id){
      myAxios({
        url: "http://localhost:3000/comment/mv",
        methods: "get",
        params: {
          id,
          limit: 20,
          offset: this.commentPage * 20
        },
      }).then((res)=>{
        this.comments = res.comments
        this.total = res.total
        // console.log(res);
      })
    }
  },
};
</script>

<style>
.mv-detail{
  position: absolute;
  min-width: 950px;
  width: 100%;
  height:calc(100% - 52px) ;
  background-color: rgb(39, 39, 39);
  overflow-y: auto;
  z-index: 999;
}
.mv-detail::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.mv-detail::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #5c5c5c;
}
.mv-detail::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #999999;
}
.mv-detail-middle{
  position: absolute;
  width: 950px;
  /* background-color: rgb(223, 153, 153); */
  left: 50%;
  transform: translateX(-50%);
}
video{
  width: 100%;
  max-height: 550px;
  background-color: #000;
}
.mv-title{
  color: rgb(199, 199, 199);
  margin: 10px 0;
  padding: 5px;
}
.mv-title span{
  font-size: 15px;
  margin-left: 10px;
  color: rgb(138, 138, 138);
}
.mv-desc{
  margin-bottom: 30px;
}
.mv-desc h3{
  color: rgb(199, 199, 199);
  margin: 10px 0;
  padding: 10px;
  border-bottom: 1px solid rgb(90, 90, 90);
}
.mv-desc p{
  color: rgb(155, 155, 155);
  font-size: 15px;
  
}
</style>