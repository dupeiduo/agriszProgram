<template>
  <div class="header-container">
    <div>
      <header class="index-header nav-zIndex"
      :class="showBlur ? 'bj-blur' : ''" 
      :style="{background: 'rgba(49,49,49,'+ headerOpacity +')'}">
        <div class="header-navbar-left ps">
          <router-link to="/index" @click.native="curIndex = -1">
            <img src="static/assets/img/common/logo.png" class="navbar-logo no-select"/>农业数据信息监测及应用平台
          </router-link>
        </div>
        <ul class="header-navbar-right pr" v-if="screenWidth >= 1170">
          <li v-for="(item,index) in leftMenu" @click="leftMenuClick(index)">
            <router-link
              :to="leftMenu[index].secondList[0].href" 
              :class="item.open ? 'active' : ''"
              >{{item.name}} 
              </router-link>
          </li>
        </ul>
          
        <div class="header-navbar-right-800-container"
          @mouseenter = "toggleDropDown = true"
          @mouseleave = "toggleDropDown = false"
         v-else>
          <h3 class="clear serviceList">
            产品列表
            <i class="iconfont" :class="toggleDropDown === true ? 'icon-top' : 'icon-bottom'" style="font-size:14px;margin-left:5px"></i>
          </h3>
          <ul class="header-navbar-right-800 ps" v-show="toggleDropDown">
            <li v-for="(item,index) in leftMenu" @click="leftMenuClick(index)" :class="curIndex === index ? 'activeLie800' : ''">
              <router-link
                :to="leftMenu[index].secondList[0].href" 
                >{{item.name}} 
                </router-link>
            </li>
          </ul>
        </div>

        <div class="header-login ps clear">
          <span  v-if="login" class="login-user animated" 
              :class="userNameAnimateClass">
              <i class="iconfont icon-yonghuming1"></i>
              {{userName}}
          </span>
          <span class="login-btn" @click="handleLogin">{{login ? '登出' : '登录'}}</span>
        </div>
      </header>
      <!-- leftHeader start-->
      <div class="left-header left-nav-zIndex"
          v-show="showLeftHeader"
          :class="(showHandleMenu ? 'animation-menuright' : 'animation-menuleft close-menu ' ) + (showBlur ? ' bj-blur' : ' ')">
        <h3 class="left-header-list iconfont icon-list" @click="handleMenu"></h3>
        <ul>
            <li v-for="(item,index) in leftMenu">
              <span class="pop-tooltip ps"><span class="tooltip-popper ps"></span>{{item.name}}</span>
              <h3 class="clear no-select" @click="leftMenuClick(index)">
                  <i class="iconfont" :class="item.icon"></i>
                  <em>{{item.name}}</em>
                <span class="iconfont icon-bottom" :class="item.open ? 'rote': ''"></span></h3>
                <ul class="sub-list"
                    :style="{height: item.open ? leftMenu[index].secondList.length * 36 + 'px' : '0px'}"
                >
                  <li v-for="(subItem, index) in leftMenu[index].secondList"
                  >
                    <router-link   
                    :to="subItem.href"
                    :class="(subItem.parent === curIndex && subIndex === index) ? 'second-active': ''"
                    @click.native="clickSubMenu(subItem, index)" 
                    >
                    {{subItem.name}}
                  </router-link>
                </li>
              </ul>
            </li>   
        </ul>
      </div>
      <!-- leftHeader stop-->
    </div>
    <login v-show="showLoginModal"></login>
    <div class="login-success-container login-zIndex" 
      v-if="loginSuccess"
      :style="{height: eHeight + 'px'}"
      @click="closeLoginSuccessModal">
      <div class="login-success" :class="fadeOutClass">
        <div class="login-bj">
          <div class="login-delete" @click="fadeOutLoginSuccessModal">
            <span class="login-close el-icon-close"></span>
          </div>
          <img src="/static/assets/img/common/login-success.png">
        </div>
      </div>
    </div>
    <div class="bj-blur" v-if="loginSuccess"></div>
    <div class="login-status login-zIndex"
      :class="loginStatusClass">
      <span>{{login ? '您已成功登录' : '您已成功登出'}}</span>
    </div>
  </div>
</template>

<script>
  import configData from '../../config/data.js'
  import {mapGetters} from 'vuex'
  import {mapState} from 'vuex'
  import {cookieUtil} from 'plugins/utils.js'
  import login from '../../pages/login'
  export default {
    data() {
      return {
        toggleDropDown:false,
        leftMenu: [
          { open: false,
            id: 0, 
            name: '农业监控',
            icon: 'icon-jiankong',
            secondList: [{ parent: 0, name: '遥感监测', href: "/monitor?id=0"},
                         { parent: 0, name: '作物分布', href: "/classify?id=0"},
                         { parent: 0, name: '作物估产', href: "/cropvaluate?id=0"},
                         { parent: 0, name: '农情报告', href: "/report?id=0"}
                        ],
          },
          { open: false,
            id: 1, 
            name: '农业信息',
            icon: 'icon-nongyeshuili',
            secondList: [
                         { parent: 1, name: '数据会商', href: "/dataconsultation"},
                         { parent: 1, name: '市场信息', href: "/market?target=price"},
                         { parent: 1, name: '气象数据', href: "/weather"},
                         { parent: 1, name: '农情报告', href: "/report?id=1"},
                        ],
          },
          { open: false,
            id: 2, 
            name: '示范区监管',
            icon: 'icon-jianguanfuwujigou',
            secondList: [{ parent: 2, name: '精细农情', href: "/ndvi"},
                        ],
          },
          { open: false,
            id: 3, 
            name: '决策辅助',
            icon: 'icon-11000',
            secondList: [
                        { parent: 1, name: '数据会商', href: "/dataconsultation?id=1"},
                        { parent: 3, name: '种植规划', href: "/plant?id=3"},
                        { parent: 3, name: '数据分析', href: "/analyze"},
                        { parent: 3, name: '农情报告', href: "/report?id=3"},
                        { parent: 3, name: '作物估产', href: "/cropvaluate?id=3"},
                        { parent: 3, name: '土地评估', href: "/evaluation"},
                      ],
          },
          { open: false,
            id: 4, 
            name: '风险预警',
            icon: 'icon-fengxian',
            secondList: [{ parent: 4, name: '遥感监测', href: "/monitor?id=4"},
                         { parent: 4, name: '土壤监测', href: "/soil?id=4"},
                         { parent: 4, name: '作物估产', href: "/cropvaluate?id=4"},
                         { parent: 4, name: '作物分布', href: "/classify?id=4"},
                        ],
          },
          { open: false,
            id: 5, 
            name: '农业规划',
            icon: 'icon-guihua',
            secondList: [{ parent: 5, name: '种植规划', href: "/plant?id=5"},
                         { parent: 5, name: '作物分布', href: "/classify?id=5"},
                         { parent: 5, name: '耕地占用', href: "/occupation"},
                        ],
          },
        ],
        className: '',
        showHandleMenu: true,

        userNameAnimateClass: "",
        loginStatusClass: '',
        loginSuccess: false,
        curIndex: -1,
        subIndex: -1,
        clickClose: false,
        fadeOutClass: '',
      }
    },
    computed: {
      ...mapGetters({
        login: 'isLogin',
        userName: 'userName',
        headerOpacity: 'headerOpacity',
        menuWidth: 'menuWidth',
        screenWidth:'screenWidth',
      }),
      ...mapState({
        showLoginModal: function (state) {
          return state.user.showLoginModal
        },
        showBlur: function (state) {
          return state.showBlur
        },
        showLeftHeader: function(state){
          return state.showLeftHeader
        }
      })
    },
    mounted() {
      this.eHeight = document.documentElement.clientHeight || document.body.clientHeight;
    },
    methods: {
      leftMenuClick(index){
        for (var i = 0; i < this.leftMenu.length; i++) {
          if (i === index) {

            if (!this.showHandleMenu) {
              this.$store.commit('expandMenu')
              this.showHandleMenu = true
              this.leftMenu[i].open = true

            } else {
              this.leftMenu[i].open = !this.leftMenu[i].open
            }
            
          } else {
            this.leftMenu[i].open = false
          } 
        }
      },
      handleMenu(){
        this.showHandleMenu =! this.showHandleMenu 
        if (this.showHandleMenu) {
          this.$store.commit('expandMenu')
        } else {
          this.$store.commit('foldMenu')
        }
      },
      showUserName() {
        this.userNameAnimateClass = "hide"
        this.clearShowUserNameAnimate()
        this.addClassTimeHandler = setTimeout(()=> {
          this.userNameTimeHandler = null
          this.userNameAnimateClass = "fadeInRight"
        }, 1000)

        this.removeClassTimeHandler = setTimeout(() => {
          this.userNameAnimateClass = ""
          this.removeClassTimeHandler = null
        }, 3000)
      },
      clearShowUserNameAnimate() {
        if (this.addClassTimeHandler) {
          clearTimeout(this.addClassTimeHandler)
          this.addClassTimeHandler = null

          clearTimeout(this.removeClassTimeHandler)
          this.removeClassTimeHandler = null
        }
      },
      handleLogin() {
        if(this.login){
          this.$router.push('/index')
          this.$store.dispatch('logout')
        } else {
          cookieUtil.delCookie('url_router_front')
          this.$store.commit('showLogin', true)
        }
      },
      showLoginStatus() {
        this.loginStatusClass = this.login ? 'animation-login-tip' : 'animation-logout-tip'
        setTimeout(() => {
          this.loginStatusClass = ''
        }, 2100)
      },
      showLoginSuccessModal() {
        this.loginSuccess = true

        setTimeout(()=> {
          this.fadeOutLoginSuccessModal()
        }, 900)

        setTimeout(()=> {
          this.clickClose = true
        }, 500)
      },
      fadeOutLoginSuccessModal() {
        this.clickClose = false
        this.fadeOutClass = 'login-sucess-fadeout'
        
        setTimeout(()=> {
          this.loginSuccess = false
          this.showUserName()
        }, 200)

        setTimeout(()=> {
          this.fadeOutClass = ''
        }, 1100)
      },
      closeLoginSuccessModal() {
        if (this.clickClose) {
          this.fadeOutLoginSuccessModal()
        }
      },
      setLogoutStatus() {
        this.loginSuccess = false
        this.fadeOutClass = ''
        this.loginStatusClass = ''
      },
      clickSubMenu(item, index){
        this.curIndex = item.parent
        this.subIndex = index
      },
      setActiveBypath(path){
        for (var i = 0; i < this.leftMenu.length; i++) {
          for (var j = 0; j < this.leftMenu[i].secondList.length; j++) {
            var _path = this.leftMenu[i].secondList[j].href
            if (path.indexOf('weather')>=0 && _path == "/weather") {
              this.leftMenu[i].open = true
              this.curIndex = i
              this.subIndex = j
              
              return
            }
            if (_path == path) {
              this.leftMenu[i].open = true
              this.curIndex = i
              this.subIndex = j
              
              return
            }
          }
        }
      }
    },
    watch: {
      $route: {
        handler: function(router) {
          if (router.path === '/index') {
            this.curIndex = -1
            this.subIndex = -1
            this.$store.commit('showLeftHeader', false)
            for (var i = 0; i < this.leftMenu.length; i++) {
              if(this.leftMenu[i].open) {
                this.leftMenu[i].open = false
              }
            }
          } else {
            this.$nextTick(() => {
              this.setActiveBypath(router.fullPath);
              this.$store.commit('showLeftHeader', true)
            })
          }
        },
        immediate: true
      },
      login (login, oldV) {
        if (!login && this.curPath !== '/index') {
          this.$store.commit('showLogin', true)
        }

        if (login) {
          this.showLoginSuccessModal()
        } else {
          this.setLogoutStatus()
        }

        this.showLoginStatus()
        this.showUserName()
      },
      showLoginModal(show) {
        this.$store.commit('showBlurModal', show)
      },
      loginSuccess(show) {
        this.$store.commit('showBlurModal', show)
      }
    },
    components: {
      login
    }
  }
</script>
<style
lang="less"
rel="stylesheet/less"
scoped>
@import '../../assets/style/common';
@bg: #fafafa;
@activebg: #8fbe22;
@hoverbg: #e7f1d8;
@hovercolor: #fff;
@h3color: #eee;
@iconcolor: #929292;
@textcolor: #404040;
.index-header {
  .adv-font-normal();
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: @header-height;
  background: #313131;
  box-shadow: 0px 0px 4px #000;
  .header-navbar-left {
    .adv-height(@header-height);
    left: 3%;
    top: 2px;
    a {
      .adv-font-super();
      color: #fff;
      line-height: 46px;
    }
    .navbar-logo{
      margin-top: (@header-height - 48) / 2
    }
  }
  .header-login {
    top: 0;
    right: 22px;
    color: #fff;
    .adv-height(@header-height);
    span {
      cursor: default;
      float: left;
      i {
        color: #9ed431;
        margin-right: 8px;
      }
    }
    .login-btn {
      cursor: pointer;
    }
    .login-user:after {
      content: '|';
      height: 20px;
      width: 1px;
      margin: 0 8px;
      color: #7d7d7d;
      vertical-align: middle;
    }
    span:last-child {
      &:hover {
        color: rgb(165, 239, 2);
      }
    }
    .hide {
      display: none;
    }
  }
  .header-navbar-right {
    position: relative;
    padding-left: 380px;
    line-height: @header-height;
    a {
      .adv-font-big();
      height: @header-height - 4;
      position: relative;
      float: left;
      margin: 0 14px;
      color: #fff;
      font-weight: 400;
      cursor: pointer;
      border-bottom: 4px solid transparent;
      &:hover {
        color: #a5ef02;
      }
    }
    .active, .active:hover{
      border-bottom: 4px solid #9ad030;
    }
  }
  .header-navbar-right-800-container{
    width: 96px;
    height: @header-height - 2;
    border-bottom: 1px solid #dcdcdc;
    cursor: pointer;
    background: @bg;
    color: @textcolor;
    line-height: 46px;
    text-align: center;
    position: absolute;
    top: 0;
    right: 250px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
    .serviceList{
      .adv-font-normal();
      .adv-height(@header-height);
      color: #fff;
      background: #313131;
    }
    .header-navbar-right-800 {
      top: @header-height;
      left: 0;
      background: @bg;
      li {
        width: 96px;
        text-align: center; 
        &:hover{
          color: @hovercolor;
          background: @hoverbg;
        }
        a {
          .adv-font-normal();
          margin: 0 10px;
          border-bottom: 1px solid #dcdcdc;
          display: inline-block; 
          color: @textcolor;
          font-weight: 400;
          cursor: pointer;
        }
      }
      .activeLie800,.activeLie800:hover {
        background: @activebg;
        a{
          border-bottom: none;
          color: @hovercolor;
        }
      }
    }
  }
  


}
.header-container .close-menu {
  .left-header-list {
    text-align: right;
    padding-right: 10px;
  }
  ul {
    li {
      h3 {
        text-align: right;
        padding-right: 6px;
        i {
          font-size: 22px;
        }
        .icon-nongyeshuili {
          font-size: @font-large;
        }
      }
      &:hover {
        .pop-tooltip {
          display: block;
        }
        h3 {
          color: #fff;
          background: @activebg;
        }
      }
      h3 {
        em,span {
          display: none;
        }
      }
      ul {
        display: none;
      }
    }
  }
  }
.left-header {
  .adv-boxshadow();
  width: 132px;
  position: fixed;
  left: 0;
  top: @header-height - 1;
  height: 100%;
  background: @bg;
  cursor: pointer;
  .left-header-list {
    font-size: @font-super;
    color: @iconcolor;
    line-height: 32px;
    padding-left: 10px;
    border-bottom: 1px solid #b9b9b9;
    cursor: pointer;
  }
  ul {
    li {
      position: relative;
      color: @textcolor;
      line-height: 36px;
      cursor: pointer;
      .pop-tooltip {
        color: #000;
        right: -96px;
        width: 80px;
        top: 4px;
        border: 1px solid #959da0;
        background: @assistant-bg;
        text-align: center;
        .adv-height(24px);
        .adv-common-border-radius();
        display: none;
        .tooltip-popper {
            width: 0px;
            height: 0px;
            top: 8px;
            left: -4px;
            margin-bottom: 2px;
            border: 4px solid transparent;
            border-right-color: #959da0;
            border-left-width: 0;
              &:after {
                position: absolute;
                content: '';
                width: 0px;
                height: 0px;
                left: 1px;
                bottom: -4px;
                border: 4px solid transparent;
                border-right-color: #fff;
                border-left-width: 0;
              }
          }
      }
      h3 {
        .adv-font-small();
        font-weight: @font-weight-normal;
        padding-left: 10px;
        background: @h3color;
        border-bottom: 1px solid #dcdcdc;
        &,i,span {
          vertical-align: middle;
        }
        em {
          color: #000;
        }
        i {
          font-size: @font-large;
          font-weight: @font-weight-normal;
          margin-right: 3px;
        }
        .icon-nongyeshuili {
          .adv-font-big();
          margin-left: -2px;
        }
        span {
          .adv-font-small();
          float: right;
          margin-right: 10px;
          transition: all  ease-out .34s;
        }
        .rote {
          transform: rotate(180deg);
        }
      }
      .sub-list {
        overflow: hidden;
        transition: all ease-out .34s;
        li {
          &:hover {
            background: @hoverbg;
          }
        }
        .second-active {
            color: @hovercolor;
            background: @activebg;
        }
        a {
          padding-left: 34px;
          display: block;
        }
      }
      .sub-list-close {
        height: 0;
        overflow: hidden;
      }
    }
  }
}
@keyframes menuleft {
    0% {
     left: 0;
    }
    100% {
      left: -92px;
    }
  }
  .animation-menuleft {
    .adv-animation(menuleft;.25s;1;forwards)
  }
@keyframes menuright {
   0% {
      left: -92px;
    }
    100% {
      left: 0px;
    }
  }
  .animation-menuright {
    .adv-animation(menuright;.25s;1;forwards)
  }
.login-status {
  position: fixed;
  width: 168px;
  right: 0;
  margin-right: -168px;
  height: @header-height;
  background: #566931;
  text-align: center;

  span {
    .adv-font-big();
    color: #fff;
    padding: 12px 36px;
    display: block;
  }
}

.login-success-container {
  position: absolute;
  width: 100%;
  background: rgba(255, 255, 255, 0.06);

  .login-success {
    position: fixed;
    top: 55%;
    left: 50%;
    display: block;
    width: 410px;
    height: 417px;
    transform: translate(-50%, -50%);
    background: @assistant-bg;
    box-shadow: 10px 10px 5px rgba(0,0,0,.2);

    .login-bj {
      img {
        .adv-position-center();
        width: 120px;
      }
    }

    .login-delete {
      position: absolute;
      top: 14px;
      right: 14px;
      cursor: pointer;
      border: 1px solid #e2e2e2;
      border-radius: 2px;
      height: 25px;
      line-height: 27px;
      .adv-horizontal-center(25px);
      &:hover {
        border: 1px solid #8ec421;
        .login-close { 
          color: #8ec421;
        }
      }
      .login-close {
        .adv-font-normal();
        cursor: pointer;
      }
    }
  }
}
  @keyframes loginSucessFadeout {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  .login-sucess-fadeout {
    .adv-animation(loginSucessFadeout;.2s;1;forwards)
  }

  @keyframes loginTip {
    0% {
      margin-right: -168px;
    }
    15% {
      margin-right: 0px;
    }
    95% {
      margin-right: 0px;
    }
    100% {
      margin-right: -168px;
    }
  }
  .animation-login-tip {
    .adv-animation(loginTip;2.05s;1;forwards)
  }
  @keyframes logoutTip {
    0% {
      margin-right: -168px;
    }
    12% {
      margin-right: 0px;
    }
    88% {
      margin-right: 0px;
    }
    100% {
      margin-right: -168px;
    }
  }
  .animation-logout-tip {
    .adv-animation(logoutTip;1.6s;1;forwards)
  }
</style>
