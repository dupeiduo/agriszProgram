<template>
  <div>
    <div class="banner pr" @mouseover="stopScroll" @mouseout="startScroll">
      <img class="banner-img" :src="carousel_img" alt="" width="100%" height="100%">
      <span class="pre iconfont icon-jiantou-copy" 
      @click="pre()"
      @mouseover="stopScroll"
      ></span>
      <span class="next iconfont icon-jiantou-copy1" 
      @click="next()"
      @mouseover="stopScroll"
      ></span>
      <ul class="banner-click ps">
        <li v-for="(item,key) in bannertitle" class="iconfont"
        :data-id="key"
        :class="key == current ? {'icon-yuandian': false,'active':false} : {'icon-yuandian': true,'active':true}"
        @click="changeText"
        @mouseover="stopScroll"
        ></li>
      </ul>
      <div class="banner-txt ps no-select">
        <h3>{{bannertitle[current].title}}</h3>
        <p>{{bannertitle[current].content}}</p>  
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props:{
      carousel_img : {
        type : String,
        default : ''
      },
      bannertitle:{
        type: Array,
        default:[]
      }
    },
    data(){
      return {
        current: 0,
        time : null
      }
    },
    computed: {

    },
    mounted(){
      var _this = this;
      _this.time = setInterval(function(){
        _this.current++;
        _this.doScroll();
      },1500);

    },
    methods: {
      doScroll(){
        if(this.current > this.bannertitle.length-1){
          this.current = 0;
        }
        if(this.current < 0){
          this.current = this.bannertitle.length-1
        }
      },
      next(){
        this.current++;
        this.doScroll();
      },
      pre(){
        this.current--;
        this.doScroll();
      },
      changeText(evt){
        this.current = evt.target.getAttribute('data-id')
      },
      stopScroll(){
        clearInterval(this.time);
      },
      startScroll() {
        var _this = this;
        _this.time = setInterval(function() {
          _this.current++;
          _this.doScroll();
        }, 2200);
      }
    },
    components: {}
  }
</script>
<style 
   lang="less"
   rel="stylesheet/less"
   scoped>
   .banner {
    overflow: hidden;
    width: 100%;
    margin-top: 100px;
    span {
      font-size: 50px;
      font-weight: bold;
      position: absolute;
      top: 50%;
      width: 50px;
      height: 55px;
      margin-top: -25px;
      cursor: pointer;
      opacity: .6;
      color: #fff;
    }
    .pre {
      left: 5%;
    }
    .next {
      right: 5%;
    }
    .banner .next {
      right: 5%;
    }
    .banner-click {
      bottom: 20px;
      left: 50%;
      margin-left: -45px;
      text-align: center;
      li {
        float: left;
        width: 12px;
        height: 12px;
        margin: 0 10px;
        cursor: pointer;
        border-radius: 50%;
        background: #fff;
      }
      .active {
        font-size: 14px;
        position: relative;
        top: -2px;
        width: 12px;
        height: 12px;
        color: #fff;
        background: none;
      }
    }
    .banner-txt {
      top: 50%;
      left: 50%;
      width: 462px;
      height: 140px;
      margin-top: -70px;
      margin-left: -212px;
      text-align: center;
      cursor: default;
      color: #fff;
      h3 {
        font-size: 32px;
        line-height: 76px;
      }
      p {
        font-size: 14px;
        line-height: 24px;
      }
    }
  }
</style>