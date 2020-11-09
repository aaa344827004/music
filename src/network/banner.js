import {myAxios} from './myaxios'
//获取轮播图
export function getBanner(type) {
  return myAxios({
    url: '/banner',
    params:{
      type
    }
  })
}
//获取推荐歌单
export function getPersonalized(limit) {
  return myAxios({
    url: '/personalized',
    params:{
      limit
    }
  })
}
//最新音乐
export function getPersonalizedNew() {
  return myAxios({
    url: '/personalized/newsong',
    
  })
}
//推荐MV
export function getPersonalizedMV() {
  return myAxios({
    url: '/personalized/mv',
    
  })
}
//歌单分类
export function getPlayList(cat) {
  return myAxios({
    url: '/top/playlist/highquality',
    params:{
      cat
    }
  })
}
//歌单详情
export function getListDetail(id) {
  return myAxios({
    url: '/playlist/detail',
    params:{
      id
    }
  })
}