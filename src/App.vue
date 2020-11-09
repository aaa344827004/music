<template>
  <div id="app">
    <Tabbar></Tabbar>
    <LeftBar></LeftBar>
    <BottomBar></BottomBar>
    
    <router-view/>
    
    
  </div>
</template>
<script>
import Tabbar from './components/tabBar/TabBar'
import LeftBar from './components/leftbar/LeftBar'
import BottomBar from './components/tabBar/BottomBar'
export default {
  components:{
    Tabbar,
    LeftBar,
    BottomBar
  }
}
</script>
<style>
  html{
    min-width: 1200px;
    background-color: rgb(39, 39, 39);
    height: 100%;
  }
 
  *{
    margin: 0;
    padding: 0;
  }
  
</style>
