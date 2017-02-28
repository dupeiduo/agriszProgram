<template>
  <div id="loginContainer" class="login-container">
    <div class="login">
      <div class="login-bj">
        <h3>用户登录</h3>
        <form  id="loginForm" action="" ref="form" :model="form"  method="post" class="login-form" autocomplete="off">
          <ul>
            <li>
              <div>用户名:</div>
              <p>
                <span class="iconfont icon-yonghuming1">
                </span>
                <input type="text" name="account" class="u-account" 
                v-model="form.name"
                @keyup.13="onSubmit"  required="required" />
              </p>
            </li>
            <li>
              <div>密码:</div>
              <p>
                <span class="iconfont icon-mima">
                </span>
                <input type="password" name="password" class="u-pwd"  
                v-model="form.pwd"
                @keyup.13="onSubmit" required="required"/>
              </p>
            </li>
            <li class="clear mt20">
              <p class="fl login-error">{{errMsg}}</p>
              <p class="login-btn fr"><input type="button" class="btn btn-primary" value="登  录" @click="onSubmit"></p>
            </li>
          </ul>
        </form>
        <div class="login-delete" @click="loginDelete">
          <span class="login-close el-icon-close" ></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {cookieUtil} from 'plugins/utils.js'
  import {mapGetters} from 'vuex'
  export default{
    data() {
      return {
        form: {
          name: '',
          pwd: '',
        }
      }
    },
    computed: {
      ...mapGetters({
        login: 'isLogin',
        errMsg: 'errMsg'
      })
    },
    methods: {
      onSubmit() {
        this.$store.dispatch('login', this.form)
      },
      loginDelete(){
        this.$router.push('/index')
        this.$store.commit('showLogin', false)
      }
    },
    watch: {
      login: function (login) {
        if (login) {
          var path = cookieUtil.getCookie('url_router_front')
          path = path ? path : '/index'
          this.$router.push(path)
          window.location.reload()
        }
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
    .mt20 {
      margin-top: 20px;
    }
    .login-container {
      z-index: 10001;
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      .login {
        position: absolute;
        z-index: 100;
        top: 55%;
        left: 50%;
        display: block;
        width: 920px;
        height: 552px;
        transform: translate(-50%, -50%);
        border-radius: 14px;
      }
      .login-bj {
        width: 920px;
        height: 552px;
        margin: 12px auto;
        background: url(/static/assets/img/common/login.png) no-repeat;
        h3 {
          font-size: 22px;
          font-weight: 400;
          position: relative;
          top: 120px;
          text-align: center;
        }
        form {
          font-weight: normal;
          width: 336px;
          margin-top: 140px;
          margin-left: 296px;
          li {
            width: 336px;
            margin-right: 75px;
            margin-bottom: 16px;
            div {
              font-size: 14px;
              line-height: 30px;
              color: #262928;    
            }
            span {
              font-size: 16px;
              margin-left: 10px;
              color: #a9a8a8;
            }
            input[type='button']:hover {
              background: url(/static/assets/img/common/loginbtn-hover.png) repeat-x;
            }
            input[type='button'] {
              font-size: 16px;
              width: 126px;
              height: 46px;
              color: #fff;
              border-radius: 12px;
              background: url(/static/assets/img/common/loginbtn.png) repeat-x;
            }
            input {
              font-size: 12px;
              width: 300px;
              height: 40px;
              cursor: pointer;
              color: #000;
              background: none;
            }
            .login-error {
              line-height: 40px;
              color: #7e6139;
            }
            .login-btn {
              height: 40px;
              text-align: right;
            }
          }
        }
        .login-delete {
          line-height: 30px;
          position: absolute;
          top: 120px;
          right: 224px;
          width: 30px;
          height: 30px;
          cursor: pointer;
          .login-close {
            font-size: 14px;
          }
        }
      }
    }
</style>
