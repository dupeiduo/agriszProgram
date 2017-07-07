<template>
  <div>
    <ul class="market-news pr">
        <li v-for="(item,index) in newsList" @click="newsContent(index)">
          <img class="ps" :src="item.news_img" :alt="item.title">
          <div class="new-container pr">
            <span class="market-news-title">{{item.title}}</span>
            <span class="market-news-time ps">{{item.publish_time}}</span>
            <p v-limitLine class="market-news-content" v-html="item.paragraph"></p>
          </div>
        </li>
    </ul>
  </div>
</template>

<script>
  export default{
    props: {
      newsList: {
        type: Array,
        default: []
      },
      newsContent: {
        type: Function,
      }
    },
    data(){
      return {
      }
    },
    mounted() {
      document.addEventListener('scroll', this.onScroll,false);
    },
    methods: {
      onScroll() {
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var scrollTop = document.body.scrollTop;
        var contentHeight = this.newsList.length * 122 + 400;
        if (contentHeight <= scrollTop + clientHeight) {
          this.$emit('scrollToBottom');
        }
      }
    },
    directives: {
      limitLine: {
        bind: function(el) {
          $clamp(el, {
            clamp: 3
          })
        }
      }
    },
    destroyed: function () {
      document.removeEventListener('scroll', this.onScroll, false)
    },
    components: {
    }
  }
</script>
<style 
  lang="less" 
  rel="stylesheet/less"
  scoped>
  @import '../../../assets/style/common';
  .market-news {
    min-height: 500px;
  }
  .market-news li:hover {
   background: #eefbf4;
  }
  .market-news li {
    position: relative;
    padding: 8px 0 8px 126px;
    box-sizing: border-box;
    height: 123px;
    margin: 16px 0;
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-bottom: 2px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    box-shadow: 0 1px 2px #e7e7e7;
    cursor: pointer;
    img {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 110px;
      height: 104px;
      margin-right: 8px;
      background: #eef3f0;
    }
    .new-container {
        height: 102px;
        overflow: hidden;
        cursor: pointer;
          .market-news-title {
            .adv-title-normal();
            .adv-height(32px);
            display: inline-block;
            font-weight: @font-weight-normal;
            color: #333;
            overflow: hidden;
        }
        .market-news-time {
            top: 0;
            right: 8px;
        }
        .market-news-content {
          .adv-text-line-height-big();
          overflow: hidden;
          height: 70px;
          margin-right: 8px;
          color: #333;
      }
    }
  }
</style>