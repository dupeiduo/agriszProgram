<template>
  <div>
    <header :class="className">
      <div class="header-top clear">
        <p class="fl header-top-left"><span class="iconfont icon-dianhua head-phone"></span><i>平台客服：010-52918959</i></p>
        <div class="fr">
          <ul class="navbar-right logout clear">
            <li class="login-person iconfont icon-yonghuming header-username">{{login ? userName : '用户名'}}</li>
            <li><span>|</span>
              <span  class="login-btn"
              @click="handleLogin">{{login ? '登出' : '登录'}}</span>
            </li>
          </ul>
        </div>
      </div>
      <nav class="navbar-default clear" role="navigation">
        <div class="header-navbar-left ps"> 
          <a class="navbar-logo no-select" href="#/">
            <img src="static/assets/img/common/logo.png">
          </a>
        </div>
        <span class=" iconfont icon-reorder header-navbar-icon"  id="header-navbar-icon" style="display: none;" @click="showList =! showList"></span>
        <div class="header-navbar-right ps" id="header-navbar-right">
          <ul class="order" id="order" v-show="showList">
            <li>
              <router-link to="/index">首页</router-link>
            </li>
            <li>
              <router-link to="/monitor">遥感监测</router-link>
            </li>
            <li>
              <router-link to="/classify">作物分布</router-link>
            </li>
            <li>
              <router-link to="/analyze">数据分析</router-link>
            </li>
            <li>
              <router-link to="/report">农情报告</router-link>
            </li>
            <li>
              <router-link to="/weather">气象数据</router-link>
            </li>
            <li>
              <router-link to="/soil">土壤监测</router-link>
            </li>
            <li>
              <router-link to="/market">市场信息</router-link>
            </li>
            <li >
              <router-link to="/plant">种植规划</router-link>
            </li>
            <li>
              <router-link to="/cropvaluate">作物估产</router-link>
            </li>
            <li>
              <router-link to="/evaluation">土地评估</router-link>
            </li>
            <li>
              <router-link to="/occupation">耕地占用</router-link>
            </li>
            <li>
              <router-link to="/services">农资服务</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <login v-show="showLoginModal"></login>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {mapState} from 'vuex'
  import {cookieUtil} from 'plugins/utils.js'
  import login from '../../pages/login'
  export default {
    data() {
      return {
        el: 'header',
        showList :true,
        className: 'common-height index-header',
        curPath: '/index'
      }
    },
    computed: {
      ...mapGetters({
        login: 'isLogin',
        userName: 'userName'
      }),
      ...mapState({
        showLoginModal: function (state) {
          return state.user.showLoginModal
        }
      })
    },
    mounted() {
      this.changeScreenSize();
      var siblings = document.getElementById('order').getElementsByTagName('li');
      this.setActiveBypath(siblings, this.curPath);
      
      this.bindEvents(siblings)
      window.onresize = () => {
        this.changeScreenSize()
      }
    },
    methods: {
      handleLogin() {
        if(this.login){
          this.$router.push('/index')
          this.$store.dispatch('logout')
        } else {
          cookieUtil.delCookie('url_router_front')
          this.$store.commit('showLogin', true)
        }
      },
      changeScreenSize() {
        var headerIcon = document.getElementById('header-navbar-icon');
        var headerRight = document.getElementById('header-navbar-right');
        var cW = document.documentElement.clientWidth;
        var isTrue = true;
        if (cW <= 910) {
          headerIcon.style.display = 'block';
          headerRight.className = 'header-navbar-right header-navbar-list';
        } else {
          headerIcon.style.display = 'none';
          headerRight.className = 'header-navbar-right';
        }
      },
      bindEvents(siblings) {
        for (let i = 0; i < siblings.length; i++) {
          siblings[i].onclick = () => {
            this.activeMe(siblings, i);
          }
        }
      },
      setActiveBypath(siblings, path){
        for (let i = 0; i < siblings.length; i++) {
          var href = siblings[i].childNodes[0].getAttribute('href')
          if (href === path) {
            return this.activeMe(siblings, i)
          }
        }
      },
      activeMe(target, index) {
        for (var i = 0; i < target.length; i++) {
          if (index === i) {
            target[i].className="active";
          } else {
            target[i].className=""
          }
        }
      }
    },
    watch: {
      $route: {
        handler: function(router) {
          if (router.path === '/index' || router.path === '/login') {
            this.className = 'common-height index-header';
          } else {
            this.className = 'common-height index-header change-header';
          }
          this.curPath = router.path
        },
        immediate: true
      },
      curPath(path) {
        var order = document.getElementById('order')
        if (order) {
          var siblings = order.getElementsByTagName('li')
          this.setActiveBypath(siblings, path);
        }
      },
      login (login) {
        if (!login && this.curPath !== '/index') {
          this.$store.commit('showLogin', true)
        }
      }
    },
    components: {
      login
    },
    beforeDestroy() {
      window.onresize = null
    }
  }
</script>
<style
lang="less"
rel="stylesheet/less"
scoped>
header {
  position: fixed;
  z-index: 10002;
  top: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 1px 6px #acacac;
  .header-top {
    line-height: 40px;
    width: 100%;
    height: 40px;
    color: #dab76e;
    background: #434343;
    .header-top-left {
      margin-left: 102px;
      .head-phone {
        font-size: 14px;
        i {
          padding-left: 8px;
        }
      }
    }
    .login-btn {
      cursor: pointer;
    }
    .navbar-right {
      margin-right: 10px;
      li {
        float: left;
        a {
          color: #dab76e;
        }
      }
      .login-person {
        font-size: 12px;
        margin-right: 4px;
      }
      .login-person:before {
        margin-right: 4px;
      }
    }
  }
  .navbar-default {
    position: relative;
    background: #fff;
    height: 60px;
    .header-navbar-left {
      top: 10px;
      left: 5%;
      .navbar-logo {
        display: block;
        width: 320px;
      }
    }
    .header-navbar-icon {
      font-size: 20px;
      line-height: 30px;
      position: absolute;
      top: 50%;
      right: 20px;
      display: none;
      width: 36px;
      height: 30px;
      margin-top: -15px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .header-navbar-right {
      position: absolute;
      top: 0;
      right: 5%;
      ul {
        width: 504px;
        margin: 0 auto;
        li {
          position: relative;
          float: left;
          margin-top: 10px;
          a {
            display: inline-block;
            width: 60px;
            margin: 0 6px;
            text-align: center;
            border-radius: 20px;
          }
          .header-two-list {
            display: none;
            z-index: 1;
            position: absolute;
            left: -1px;
            width: 74px;
            padding-top: 5px;
            border-left: 1px solid #ededee;
            border-right: 1px solid #ededee;
            border-bottom: 1px solid #ededee;
            border-radius: 0px 0px 4px;
            background: rgba(255,255,255,.6);
            span {
              display: block;
              a {
                margin: 6px;
              }
            }
          }
        }
        .active {
          a {
            color: #fff;
            background: #55b101;
          }
        }
        li:hover {
          a {
            color: #fff;
            background: #55b101;
          }
          .header-two-list {
            display: block;
            a {
              background: none;
              color: #000;
            }
          }
          .active {
            a {
              color: #55b101;
            }
          }
        }
      }
    }
    .header-navbar-list {
      position: absolute;
      top: 60px;
      right: 0;
      width: 76px;
      background: rgba(255,255,255,.8);
      box-shadow: 0 1px 6px #acacac;
      .order {
        width: 100%;
        margin: 0;
        li {
          float: none;
          margin: 10px 0;
          .header-two-list {
            position: static;
          }
        }
        .active {
          a {
            color: #fff;
            background: #55b101;
          }
        }
      }
    }
  }
}
.change-header {
  .header-top {
    line-height: 26px;
    height: 26px;
  }
  .navbar-default {
    height: 42px;
    .header-navbar-left {
      position: absolute;
      top: 2px;
    }
    .header-navbar-right {
      margin-top: 2px;
      ul {
        margin: 3px auto;
        li {
          margin-top: 0;
        }
      }
    }
    .header-navbar-list {
      top: 36px;
    }
  }
}
</style>
