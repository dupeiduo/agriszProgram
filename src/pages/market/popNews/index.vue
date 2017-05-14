<template>
    <div class="news-popup" :style="{'min-height':client - 150 + 'px'}">
          <div class="news-popup-container" :style="{'min-height':client - 170 + 'px'}">
            <hr class="hr-con">
            <h4 class="news-popup-title clear">
              <p class="news-popup-title-p fl">{{popNewsData.title}}</p>
              <p class="fl news-popup-crop clear">
                <span v-for="item in label">{{item}}</span>
              </p>
            </h4>
            <p class="news-popup-time clear">
              <span class="fl news-source">来源 :{{popNewsData.source}}</span>
              <span class="fl">{{popNewsData.publish_time}}</span>
            </p>
            <hr class="hr-con">
            <div class="news-popup-wrap">
              <div class="news-popup-img fl">
                <img class="news-popup-img1" :src="popNewsData.news_img" :alt="popNewsData.title">
              </div>
              <div class="news-popup-content">
                <p v-html="popNewsData.main_body" style="font-size:14px;line-height:24px;margin:0px 0px 25px;padding:0px;text-align:justify;color:#2B2B2B;text-transform:none;text-indent:28px;letter-spacing:normal;word-spacing:0px;white-space:normal;-ms-word-break:normal;-ms-word-wrap:break-word;widows:1;background-color:#FFFFFF;-webkit-text-stroke-width:0px;"></p>
               </div>
            </div>
          </div>
    </div>
</template>

<script>
  export default{
    props: {
      backNews: {
        type: Function
      },
      popNewsData: {
        type: Object,
        default: {}
      }
    },
    data(){
      return {
        label: [],
        main_body: '',
        client: null
      }
    },
    mounted(){
      this.client = document.documentElement.clientHeight || document.body.clientHeight;
    },
    computed: {

    },
    methods: {
    },
    watch: {
      popNewsData(data) {
        if (data.label && data.label != '') {
          this.label = data.label.split(',')
        }
        // data.main_body = data.main_body.replace(/<\/?.+?>/g,"");
      }
    },
    components: {
    }
  }
</script>
<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  .news-popup {
      z-index: 2;
      overflow-x: hidden;
      min-height: 500px;
      background: #e6e6e6;
        .news-popup-container {
          width: 800px;
          min-height: 500px;
          margin: 25px auto;
          background: #fff;
           .container-title {
              line-height: 44px;
              height: 44px;
              padding-left: 20px;
              color: #9b9b9b;
           }
              .container-title a {
                display: inline-block;
                cursor: pointer;
                color: #9b9b9b;
               }
               .container-title a:last-child {
                color: #10ad33;
               }
           .hr-con {
              border: 1px solid #e5e5e5;
           }
           .news-popup-title {
              font-size: 20px;
              margin-left: 50px;

              .news-popup-title-p {
                margin-top: 5px;
              }

                span {
                  font-size: 12px;
                  float: left;
                  margin-bottom: 5px;
                  margin-left: 5px;
                  padding: 4px 6px;
                  color: #f29d9e;
                  border: 1px solid #f29d9e;
                  border-radius: 4px;
              }
          }
          .news-popup-time {
            margin-top: 8px;

            span {
              display: inline-block;
              margin-left: 50px;
            }
          }
          .news-popup-wrap {
              margin: 40px 0 0;
              padding: 0 52px 10px;
                .news-popup-img {
                  min-width: 164px;
                  margin: 10px 10px 10px 0;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                }
          }
      }
  }
</style>