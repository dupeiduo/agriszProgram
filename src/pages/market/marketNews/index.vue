<template>
  <div>
    <ul class="market-news">
        <li v-for="(item,index) in newsList" @click="newsContent(index)">
          <img class="fl" :src="item.news_img" :alt="item.title">
          <div class="new-container fl pr">
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
  .market-news li:hover {
   background: #eef8f3;
  }
  .market-news li {
    height: 103px;
    margin: 16px 0;
    padding: 8px;
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    border-bottom: 2px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
    box-shadow: 0 1px 2px #e7e7e7;
      img {
        width: 110px;
        height: 104px;
        margin-right: 8px;
    }
    .new-container {
        cursor: pointer;
          .market-news-title {
            font-size: 14px;
            line-height: 32px;
            height: 32px;
            color: #333;
        }
        .market-news-time {
            right: 0px;
        }
        .market-news-content {
          line-height: 24px;
          font-size: 12px;
          overflow: hidden;
          width: 596px;
          height: 70px;
          margin-right: 8px;
          color: #333;
      }
    }
  }
</style>