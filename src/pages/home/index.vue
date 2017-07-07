<template>
<div class="pr" :style="{height: eHeight + 'px',overflow: 'hidden'}">
  <div :style="{height: eHeight * 4 + 'px',top: bannerTop +'px'}" class="banner-all ps" id="banner">
    <div class="banner pr" 
    	v-for="(item, index) in bannerObject"
    	:style="{backgroundImage: 'url('+bannerObject[index].img +')',height: eHeight + 'px'}" >
        
        <div class="banner-txt ps no-select" 
      		:class="'banner-position'+ index">
	        <h3><img :src="item.titleImg" width="78%"/></h3>
	        <em class="banner-line"></em>
	        <p>{{item.content}}</p>
	    </div>
      <div class="banner-bottom-bg ps" :class="'banner-bottom-position'+ index">
        <ul class="banner-bottom">
        <li class="clear" v-for="(bottomItem,index) in bannerObject[currentIndex].children">
          <div class="banner-bottom-position">
            <span class="iconfont fl" :class="bottomItem.bottomIcon"></span>
            <div class="fl banner-bottom-content">
                <h3>{{bottomItem.bottomTitle}}</h3>
                <p>{{bottomItem.bottomSection}}</p>
            </div>
          </div>
         </li>
        </ul>
      </div>    
    </div>
    <ul class="banner-click">
        <li v-for="(item,key) in bannerObject" 
        :data-id="key"
        :class="key == currentIndex ? 'active' : ''"
        @click="changeText"
        >{{item.id}}</li>
    </ul> 
  </div>
  <p-footer  v-if="beforeAnimateIndex === bannerObject.length - 1" class="home-footer"></p-footer>
  </div>
</template>
<script>
  import pFooter from 'components/footer/';
  import {mapGetters} from 'vuex'
  export default{
    data(){
      return {
      	bannerTop: 0,
      	scrollDirection: '', 
      	mouseWheelTimeHandler: null,
      	animateTimeInterval: null,
      	footerTimeHandler: null,
        beforeAnimateIndex: 0,
        currentIndex: 0,
        scrollSpeed: 10,
        eHeight: 0,
        eWidth: 0,
        bannerObject: [
  				{ id: 1,
            titleImg: 'static/assets/img/home/title1.png',
            content: '提供精确迅速的农业生产资料与环境监测数据和服务，让您全面并及时掌握辖区内的情况',
            img: 'static/assets/img/home/banner1.jpg',
            children: [{
              bottomIcon: 'icon-qixiangzhan',
              bottomTitle: '气象数据',
              bottomSection:'天气实况，气象预警'
            },{
              bottomIcon: 'icon-fenbu-',
              bottomTitle: '作物分布',
              bottomSection:'动态监测分析作物分布'
            },{
              bottomIcon: 'icon-renqunfenbu31',
              bottomTitle: '土壤监测',
              bottomSection:'定量监测土壤成分和质量'
            }]},
  				{ id: 2,
            titleImg: 'static/assets/img/home/title2.png',
            content: '通过科学手段，提升农产品质量和助力农业生产实际活动，促进产地与消费市场无缝对接',
            img: 'static/assets/img/home/banner2.jpg',
            children: [{
              bottomIcon: 'icon-zhongzhi',
              bottomTitle: '种植规划',
              bottomSection:'农作物种植科学规划'
            },{
              bottomIcon: 'icon-zixunzhuanhuan',
              bottomTitle: '市场资讯',
              bottomSection:'综合统计分析农产品价格情报'
            }]
          },
  				{ id: 3,
            titleImg: 'static/assets/img/home/title3.png',
            content: '围绕粮食生产功能区和农产品生产保护区建设工作，提供科学选址、定量评估、审核验收服务',img: 'static/assets/img/home/banner3.jpg',
              children: [{
                bottomIcon: 'icon-tudipinggu',
                bottomTitle: '土地评估',
                bottomSection:'定量评估土地资质'
              },{
                bottomIcon: 'icon-tongjitu',
                bottomTitle: '耕地占用',
                bottomSection:'动态智能分析耕地占用情况'
              },{
                bottomIcon: 'icon-baogao',
                bottomTitle: '农情报告',
                bottomSection:'专业农情评估指导报告'
              }]
          },
  				{ id: 4,
            titleImg: 'static/assets/img/home/title4.png',
            content: '通过集成全球定位系统、农田信息采集系统、农田遥感监测系统等十几个模块，打造现代化农业生产线',
            img: 'static/assets/img/home/banner4.jpg',
            children: [{
              bottomIcon: 'icon-changshi-',
              bottomTitle: '高清长势',
              bottomSection:'高分辨率作物长势监测'
            },{
              bottomIcon: 'icon-yuzhouxingqiu-12',
              bottomTitle: '遥感监测',
              bottomSection:'科学分析多项植被指数'
            },{
              bottomIcon: 'icon-dami',
              bottomTitle: '作物估产',
              bottomSection:'精准预测粮食产量增减趋势'
            }]
          }
  			],
        animationClassName: ''
      }
    },
    computed: {
      ...mapGetters({
        menuWidth: 'menuWidth',
        getScreenHeight: 'getScreenHeight',
    })},
    mounted(){
    	this.eHeight = document.documentElement.clientHeight || document.body.clientHeight;
      this.eWidth = document.documentElement.clientWidth || document.body.clientWidth
    	this.dispatchMouseWheelEvent()
    },
    methods: {
      dispatchMouseWheelEvent() {
        var banner = document.getElementById('banner')

        mouseWheel(banner, (bDown) => {
          this.scrollDirection = bDown ? 'down' : 'up'

          if (this.mouseWheelTimeHandler) {
            clearTimeout(this.mouseWheelTimeHandler)
            this.mouseWheelTimeHandler = null
            this.scrollDirection = ""
          }

          this.mouseWheelTimeHandler = setTimeout(()=> {
            this.scrollDirection = ""
            this.mouseWheelTimeHandler = null

          }, this.eHeight / 10 - 10)

        })
      },
      changeText(evt){
      	var index = parseInt(evt.target.getAttribute('data-id'))
      	this.doScroll(index)
      },
      doScroll(index) {
        if (!this.animateTimeInterval) {
          var direction = this.currentIndex < index
          
          this.showFooter(index, direction)

          this.animateTimeInterval = setInterval(()=> {
            if (direction) {
              this.bannerTop -= this.scrollSpeed
              if (this.bannerTop <= - this.eHeight * index) {
                this.bannerTop = - this.eHeight * index
                this.clearAnimate(index)
              }
            } else {
              this.bannerTop += this.scrollSpeed
              if (this.bannerTop >= -this.eHeight * index) {
                this.bannerTop = - this.eHeight * index
                this.clearAnimate(index)
              }
            }
          }, 1)
        }
      },
      clearAnimate(index) {
      	clearInterval(this.animateTimeInterval)
    		this.animateTimeInterval = null
    		this.currentIndex = index
      },
      showFooter(index, direction) {

      	if (this.footerTimeHandler) {
      		clearTimeout(this.footerTimeHandler)
      		this.footerTimeHandler = null
      	}

      	if (index !== this.bannerObject.length - 1) {
      		this.beforeAnimateIndex = index

      	} else {
      		this.footerTimeHandler = setTimeout(()=> {
    				this.beforeAnimateIndex = index
    				this.footerTimeHandler = null
      		}, this.eHeight / 10 + 200)
		    }
      }
    },
    watch: {
    	scrollDirection(dire) {
        if (dire !== "") {
          var index = dire === 'down' 
                      ? this.currentIndex + 1 
                      : this.currentIndex - 1
          
          if (dire === 'down' && index <= this.bannerObject.length - 1) {
            this.doScroll(index)

          } else if (dire === "up" && index >= 0) {
             this.doScroll(index)
          }
        }
    	},
      currentIndex(index) {
        if (index === 0) {
          this.$store.commit('changeHeaderOpacity', 1)
        } else {
          this.$store.commit('changeHeaderOpacity', .8)
        }
      }
    },
    components: {
    	pFooter
    }
  }
</script>
<style 
   lang="less"
   rel="stylesheet/less"
   scoped>
   @import '../../assets/style/common';
   .banner {
   	position: relative;
   	top: 0;
   	width: 100%;
   	height: 100%;
   	background-repeat: no-repeat;
   	background-position: center center;
   	background-size: cover;
    .banner-position0 {
      .adv-position-center();
    }
    .banner-position1 {
      left: 10%;
      top: 50%;
      transform: translate(0,-50%);
    }
    .banner-position2 {
      right: 10%;
      top: 50%;
      transform: translate(0,-50%);
    }
    .banner-position3 {
      left: 10%;
      top: 40%;
      transform: translate(0,-50%);
    }
  }
  .banner-txt {
      width: 740px;
      text-align: center;
      cursor: default;
      color: #fff;
      background: rgba(0,0,0,.5);
      .banner-line {
      	position: relative;
      	display: block;
      	width: 90%;
      	margin: 0 auto 3%;
      	height: 1px;
      	background: @assistant-bg;
      	&:before {
      		left: 0;
      	}
      	&:after {
      		right: 0;
      	}
      	&:before,&:after {
      		position: absolute;		
      		top: -3px;
      		content: '';
      		display: inline-block;
      		vertical-align: middle;
      		width: 7px;
      		height: 7px;
      		border-radius: 50%;
      		background: @assistant-bg;
      	}
      }
      h3 {
      	margin: 5%;
      	img {
      		display: block;
      		margin: 5% auto;
      	}
      }
      p {
        font-size: 20px;
        line-height: 30px;
        padding-bottom: 5%;
        margin: 0 10%;
      }
    }
  .banner-click {
      font-size: 16px; 
  	  position: fixed;
      top: 50%;
      right: 5%;
      height: 240px;
      transform: translate(0,-50%);
      margin: 78px 0;
      li {
        margin: 16px 0;
        cursor: pointer;
        border-radius: 50%;
        background: none;
        border: 1px solid #fff;
        color: #fff;
        .adv-horizontal-center(24px);
        .adv-height(24px);
      }
      .active {
        background: #fff;
        color: #000;
      }
    }
   .banner-all {
   	width: 100%;
   	left: 0;
   	top: 0;
   }
   .home-footer {
   	width: 100%;
   	position: fixed;
   	bottom: 0;
    left: 0;
   }
   .banner-bottom-position0, .banner-bottom-position2,.banner-bottom-position3 {
    .banner-bottom {
      margin: 0 0 0 13%;
    }
   }
   .banner-bottom-position1 {
    .banner-bottom {
       margin: 0 22%;
       li {
          width: 50% !important;
        }
    }
   }
   .banner-bottom-position3 {
    bottom: 96px !important;
   }
   .banner-bottom-bg {
      width: 100%;
      height: 80px;
      bottom: 0;
      left: 0;
      background: rgba(0,0,0,.5);
      .icon-yuzhouxingqiu-12 {
        transform: scale(1.4);
      }
    .banner-bottom {
      color: #fff;
      overflow: hidden;
      li {
        width: 33%;
        float: left;
        margin-top: 18px;
        span {
          font-size: 30px;
          margin-top: 8px;
        }
        .banner-bottom-content {
          border-left: 1px solid #fff;
          margin-left: 12px;
          padding-left: 12px;
          h3 {
            .adv-font-large();
          }
          p {
            .adv-font-big();
          }
        }
      }
   }
   }
</style>