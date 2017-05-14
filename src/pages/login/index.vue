<template>
  <div id="loginContainer" class="login-container">
    <div class="login">
      <div class="login-bj">
        <h3>用户登录</h3>
        <form  id="loginForm" action="" ref="form" :model="form"  method="post" class="login-form" autocomplete="off">
          <ul>
            <li class="login-li">
             <b></b>
              <p class="clear">
                <span class="iconfont icon-yonghuming1 fl"></span>
                <input type="text" name="account" class="u-account" 
                v-model="form.name"
                @keyup.13="onSubmit"  required="required" />
              </p>
            </li>
            <li class="login-li">
              <el-popover ref="popover5" class="pwd-login-caps fl" placement="top-start" width="60" v-model="pwdCaps">
                <i class="caps-tip">已开启大写锁定</i>
              </el-popover>

              <b></b>
              <p class="clear">
                <span class="iconfont icon-mima fl" v-popover:popover5></span>                
                <input type="password" name="password" class="u-pwd"  
                v-model="form.pwd"
                @keydown.caps="pwdCapsSwitch($event)"
                @keyup.caps="pwdCapsSwitch($event)"
                @keyup.13="onSubmit" required="required"/>
              </p>
            </li>
            <li>
                <p class="login-error">{{errMessage}}</p>
            </li>
            <li class="login-btn">
              <div class="login-loading" v-loading.lock="(validLoading && !errMessage)">
                <input type="button" class="btn btn-primary" :value="(validLoading && !errMessage) ? '登录中' : '登  录'" @click="onSubmit">
              </div>
            </li>
          </ul>
        </form>
        <ul class="login-footer">
          <li>
            <span class="iconfont icon-youxiang"></span>
            <div>
              <p>企业邮箱</p>
              <p>kefu@agrisz.com</p>
            </div>
          </li>
          <li>
            <span class="iconfont icon-dianhua"></span>
            <div>
              <p>联系电话</p>
              <p>010-52918959</p>
            </div>
          </li>
        </ul>
        <div class="login-delete" @click="loginDelete">
          <span class="login-close el-icon-close"></span>
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
        },
        errMessage: '',
        pwdCaps: false,
        validLoading: false
      }
    },
    computed: {
      ...mapGetters({
        login: 'isLogin',
        errMsg: 'errMsg'
      })
    },
    methods: {
      pwdCapsSwitch(event) {
        this.pwdCaps = this.getCaps(event.type)
      },
      getCaps(type) {
        var capslock = false
        if(event.type === "keydown") {
          capslock = true
        } else {
          capslock = false
        }

        return capslock
      },
      onSubmit() {
        if (!this.form.name) {
          if (!this.form.pwd) {
            this.errMessage = "请先输入账号"
            console.log("请先输入账号",this.errMessage)
          } else {
            this.errMessage = "请输入账号"
            console.log("请输入账号", this.errMessage)
          }
        } else if (!this.form.pwd) {
          this.errMessage = "请输入密码"
          console.log("请输入密码", this.errMessage)
        } else {
          this.validLoading = true
          this.$store.dispatch('login', this.form)
        }
        
      },
      loginDelete(){
        this.$router.push('/index')
        this.$store.commit('showLogin', false)
      }
    },
    watch: {
      login: function (login) {
        if (login) {
          this.validLoading = false
          var path = cookieUtil.getCookie('url_router_front')
          path = path ? path : '/index'
          this.$router.push(path)
          if (path !== '/index') {
            window.location.reload()
          }
        } else {
          this.validLoading = false
        }
      },
      errMsg(msg) {
        this.errMessage = msg
        this.validLoading = false
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
    @import '../../assets/style/reset';
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
        width: 410px;
        transform: translate(-50%, -50%);
        background: #fff;
        box-shadow: 10px 10px 5px rgba(0,0,0,.2);
        h3 {
          font-size: 22px;
          font-weight: 400;
          margin: 30px 0;
          text-align: center;
          color: #4f5a37;
        }
        form {
          font-weight: normal;
          .login-btn {
            background: #8ec421;
            margin: 8px 38px 24px;
            cursor: pointer;
            font-weight: bold;
            &:hover {
              background: #7cab1e;
              input {
                background: #7cab1e;  
              }
            }
            input {
              width: 100%;
              color: #fff;
              font-size: 18px;
              cursor: pointer;
              background: #8ec421;
            }
          }
          .login-li {
            padding: 20px 38px;
            p {
              border: 1px solid #e4e7e7;
              background: #fff;
              .mixin-boxshadow();
            }
            b {
              opacity: 0;
              position: absolute;
              left: 0;
              top: 0;
              width: 8px;
              height: 80px;
              background: #81ba08;
            }
            &:hover {
              background: #eff4f5;
              b {
                opacity: 1;
              }
            }
          }
          li {
            position: relative;
            padding: 0px 38px;
            span {
              line-height: 40px;
              font-size: 18px;
              margin: 0 10px;
              color: #abbd96;
            }
            input {
              font-size: 14px;
              width: 284px;
              height: 40px;
              padding-left: 10px;
              vertical-align: middle;
            }
            .login-error {
              font-size: 14px;
              line-height: 40px;
              color: #e08302;
            }
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
        .login-footer {
          background: #f3fafd;
          border-top: 1px solid #dfe2e2;
          overflow: hidden;
            li {
              float: left;
              padding: 24px 30px;
              width: 144px;
              position: relative;
              &:first-child {
                border-right: 1px solid #dfe2e2;
              }
              span {
                font-size: 24px;
                line-height: 36px;
                display: inline-block;
                height: 40px;
                color: #accf4a;
                .mixin-width(40px);
                .mixin-border(#accf4a;50%);
              }
              div {
                position: absolute;
                left: 72px;
                top: 24px;
                width: 172px;
                margin-left: 10px;
                p {
                  font-size: 12px;
                  line-height: 20px;
                }
              }
            }
           } 
      }
    }
</style>
