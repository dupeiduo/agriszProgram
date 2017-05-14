<template>
  <div class="header-container">
    <header class="index-header" @mouseleave="mouseLeaveHeader" @mouseenter="mouseEnterHeader" :style="{background: 'rgba(49,49,49,'+ headerOpacity +')'}"
    :class="showBlur ? 'bj-blur' : ''">
      <div class="header-navbar-left ps"> 
        <router-link to="/index" @click.native="curIndex = -1">
          <img class="navbar-logo no-select" src="static/assets/img/common/logo.png"/>
          农业数据信息监测及应用平台
         </router-link> 
      </div>
      <ul v-show="showList" class="first-menu">
        <li v-for="(menuItem, menuIndex) in menuList" 
          :class="curIndex == menuIndex ? 'active' : ''">
          
          <h3 class="menu-title" :style="{color: (animatIndex == menuIndex && hovered) ? '#a5ef02' : '#fff'}"
            @mouseenter="mouseEnterMenu(menuIndex)" 
            @mouseleave="mouseLeaveMenu"
            @click="switchMenu(menuIndex)">{{menuItem.name}}</h3>
          
          <p class="seond-bg" v-if="showMenu"></p>
          
          <ul v-if="showMenu" class="sub-menu"
            :style="{display: animatIndex == menuIndex ? 'block' : 'none'}"
            :class="(animatIndex == menuIndex ? className : '') + (' nav-ul' + (menuIndex+1))" >
           
            <li @mouseenter="clearAnimate"
              v-for="(subItem, index) in menuList[menuIndex].value" 
              :class="(subItem.parent -1 === curIndex && subIndex === index) ? 'second-active' : ''" 
              >
              <router-link @click.native="clickSubMenu(subItem, index)" :to="subItem.href">{{subItem.name}}</router-link>
            </li>

          </ul>
        </li>
      </ul>
      <div class="header-navbar-right ps clear">
        <span  v-if="login" class="login-user animated" 
          :class="userNameAnimateClass">
          <i class="iconfont icon-yonghuming1"></i>
          {{userName}}
        </span>
        <span class="login-btn" @click="handleLogin">{{login ? '登出' : '登录'}}</span>
      </div>
    </header>
    <login v-show="showLoginModal"></login>

    <div class="login-success-container" 
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
    
    <div class="login-status"
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
        el: 'header',
        showList: true,
        curPath: '/index',
        animatIndex: -1,
        showMenu: false,
        secondCurrnt: -1,
        className: '',
        showActive: '',
        menuList: [
          {
            name: "数据管理",
            id: 1,
            value: [
              {
                name: "气象数据",
                href: "/weather",
                parent: 1
              },
              {
                name: "数据分析",
                href: "/analyze",
                parent: 1
              }
            ]
          },
          {
            name: "动态监测",
            id: 2,
            value: [
              {
                name: "土壤监测",
                href: "/soil",
                parent: 2
              },
              {
                name: "遥感监测",
                href: "/monitor",
                parent: 2
              },
              {
                name: "作物分布",
                href: "/classify",
                parent: 2
              },
              {
                name: "高清长势",
                href: "/ndvi",
                parent: 2
              }
            ]
          },
          {
            name: "信息报告",
            id: 3,
            value: [
              {
                name: "市场信息",
                href: "/market?target=price",
                parent: 3
              },
              {
                name: "农情报告",
                href: "/report",
                parent: 3
              },
              {
                name: "农资服务",
                href: "/services",
                parent: 3
              }
            ]
          },
          {
            name: "评估规划",
            id: 4,
            value: [
              {
                name: "作物估产",
                href: "/cropvaluate",
                parent: 4
              },
              {
                name: "种植规划",
                href: "/plant",
                parent: 4
              },
              {
                name: "土地评估",
                href: "/evaluation",
                parent: 4
              }
            ]
          }
        ],
        curIndex: -1,
        subIndex: -1,
        leaveTimeHandler: null,
        leaveSubTimeHanlder: null,
        inTimeHan: null,
        outTimeHan: null,
        hovered: false,
        openedDely: configData.headerAnimate.openeDely,
        closedDelay: configData.headerAnimate.closeDelay,
        leaveDelay: configData.headerAnimate.leaveDelay,

        loginSuccess: false,
        fadeOutClass: '',
        clickClose: false,
        eHeight: 0,

        loginStatusClass: '',
        userNameAnimateClass: ""
      }
    },
    computed: {
      ...mapGetters({
        login: 'isLogin',
        userName: 'userName',
        headerOpacity: 'headerOpacity'
      }),
      ...mapState({
        showLoginModal: function (state) {
          return state.user.showLoginModal
        },
        showBlur: function (state) {
          return state.showBlur
        },
      })
    },
    mounted() {
      this.eHeight = document.documentElement.clientHeight || document.body.clientHeight;
    },
    methods: {
      mouseLeaveHeader(){
        this.clearLeaveHeader()

        this.leaveTimeHandler = setTimeout(() => {
          this.leaveTimeHandler = null
          this.className = ''
          this.showMenu = false

          this.clearAnimate()

        },this.leaveDelay)
      },
      mouseEnterHeader(){
        this.clearLeaveHeader()
        if(this.className === 'header-fadein-right') {
          this.showMenu = true
        }
      },
      clearLeaveHeader() {
        if (this.leaveTimeHandler) {
          clearTimeout(this.leaveTimeHandler)
          this.leaveTimeHandler = null
        }
      },
      switchMenu(index) {
        this.hovered = true
        this.clearAnimate()
        
        this.doAnimate(index)
      },
      mouseEnterMenu(index){
        this.inTimeHan = setTimeout(()=> {
          this.hovered = true
          this.doAnimate(index)
        }, this.showMenu ? this.openedDely : this.closedDelay)
      },
      mouseLeaveMenu() {
        this.clearAnimate()
        this.hovered = false
      },
      doAnimate(index) {
        if (this.animatIndex === index) {
          this.className = 'header-fadein-right'
          this.showMenu = true
          console.log("doAnimate")
        }
        this.animatIndex = index
      },
      clearAnimate() {
        clearTimeout(this.inTimeHan)
      },
      clickSubMenu(item, index){
        console.log(item, index)
        this.curIndex = item.parent - 1
        this.subIndex = index
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
      setActiveBypath(path){
        for (var i = 0; i < this.menuList.length; i++) {
          for (var j = 0; j < this.menuList[i].value.length; j++) {
            var _path = this.menuList[i].value[j].href
            if (_path.indexOf(path) >= 0) {
              this.curIndex = i
              this.subIndex = j
              break
            }
          }
        }
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
      showLoginStatus() {
        this.loginStatusClass = this.login ? 'animation-login-tip' : 'animation-logout-tip'
        setTimeout(() => {
          this.loginStatusClass = ''
        }, 2100)
      },
      setLogoutStatus() {
        this.loginSuccess = false
        this.fadeOutClass = ''
        this.loginStatusClass = ''
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
      }
    },
    watch: {
      $route: {
        handler: function(router) {
          if (router.path === '/index') {
            this.curIndex = -1
            this.subIndex = -1

          } else {
            this.setActiveBypath(router.path);
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
      animatIndex(index, oldV) {
        this.showMenu = true
        
        if (index > oldV) {
          this.className = 'header-fadeout-right'
        } else {
          this.className = 'header-fadein-right'
        }
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
@import '../../assets/style/reset';

.index-header {
  z-index: 10000;
  position: fixed;
  left: 0;
  top: 0;
  font-size: 14px;
  width: 100%;
  height: 48px;
  background: #313131;
  box-shadow: 0px 0px 4px #000;
  .header-navbar-left {
    left: 3%;
    top: 2px;
    a {
      font-size: 20px;
      color: #fff;
      line-height: 46px;
    }
  }
  .first-menu {
    li {
      .sub-menu {
        li {
          cursor: default;
        }
      }
    }
  }
  ul {
    position: relative;
    z-index: 4;
    padding-left: 380px;
    .active {
        h3 {
          border-bottom: 4px solid #9ad030;
        }
    }
    li {
      position: relative;
      float: left;
      height: 48px;
      h3 {
        font-size: 16px;
        margin: 0 14px;
        padding: 12px 0;
        color: #fff;
        font-weight: normal;
        cursor: pointer;
        border-bottom: 4px solid transparent;
      }
      .menu-title {
        padding: 11px 0;
      }
      ul {
        display: none;
        opacity: 0;
        padding-left: 0px;
        position: absolute;
        .second-active,.second-active:hover {
          border-bottom: 4px solid #9ad030;
          a {
            color: #6b9800;
          }
        }
        li {
          color: #373737;
          margin: 0 14px;
          border-bottom: 4px solid #fff;
          height: 32px;
          line-height: 36px;
          a {
            width: 56px;
            height: 36px;
            display: block;
          }
          &:hover {
            color: #6d9e01;
            border-bottom: 4px solid #fff;
            a {
              color: #6b9800;
            }
          }
        }
      }
    }
  }
  .header-navbar-right {
    right: 22px;
    color: #fff;
    .mixin-height(48px);
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
  .seond-bg {
    position: fixed;
    top: 48px;
    left: 0;
    width: 100%;
    height: 36px;
    background: #fff;
    box-shadow: 0px 0px 4px rgba(0,0,0,.1);
  }
  .nav-ul1 {
    width: 168px;
  }
  .nav-ul2 {
    width: 336px;
  }
  .nav-ul3, .nav-ul4 {
    width: 252px;
  }
  @keyframes headerFadeInRight {
    0% {
      display: none;
      left: -50%;
      transform: translate(-50%, 0);
      opacity: 0;
    }
    100% {
      left: 50%;
      transform: translate(-50%, 0);
      opacity: 1;
      display: block;
    }
  }
  .header-fadein-right {
    .mixin-animation(headerFadeInRight;.5s;1;forwards);
    animation-delay: .1s;
  }


  @keyframes fadeOutRight {
    0% {
      left: 0%;
      transform: translate(0%, 0);
      opacity: 0;
      display: none;
    }
    100% {
      left: 50%;
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  .header-fadeout-right {
    .mixin-animation(fadeOutRight;.5s;1;forwards);
    animation-delay: .1s;
  }
}

.login-status {
  position: fixed;
  width: 168px;
  right: 0;
  margin-right: -168px;
  z-index: 100001;
  height: 48px;
  background: #566931;
  text-align: center;

  span {
    color: #fff;
    padding: 12px 36px;
    font-size: 16px;
    display: block;
  }
}

.login-success-container {
  position: absolute;
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  z-index: 100001;

  .login-success {
    position: fixed;
    z-index: 100;
    top: 55%;
    left: 50%;
    display: block;
    width: 410px;
    height: 417px;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 10px 10px 5px rgba(0,0,0,.2);

    .login-bj {
      img {
        width: 120px;
        .mixin-position(50%;50%);
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
      .mixin-width(25px);
      &:hover {
        border: 1px solid #8ec421;
        .login-close { 
          color: #8ec421;
        }
      }
      .login-close {
        font-size: 14px;
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
    .mixin-animation(loginSucessFadeout;.2s;1;forwards)
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
    .mixin-animation(loginTip;2.05s;1;forwards)
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
    .mixin-animation(logoutTip;1.6s;1;forwards)
  }
</style>
