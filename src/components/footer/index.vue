<template>
  <div>
    <div class="footer">
      <ul>
        <li>
          <span class="iconfont icon-youxiang"></span>
          <p>
            <em>企业邮箱: <a href="Mailto:kefu@agrisz.com"><b>kefu@agrisz.com</b></a></em>
          </p>
        </li>
        <li>
          <span class="iconfont icon-dianhua"></span>
          <p>
            <em>联系电话: <i>010-52918959</i></em>
          </p>
        </li>
        <li class="special-width">
          <span class="iconfont icon-2"></span>
          <p>
            <em>企业地址: <i>北京丰台区总部基地十八区</i></em>
          </p>
        </li>
      </ul>
    </div>
    <footer>尚正(北京)信息技术有限公司备案号:京ICP备16023747号-1</footer>
  </div>
</template>
<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
    },
    mounted() {
    },
    components: {

    }
  }
</script>
<style lang="less" scoped>
@import '../../assets/style/reset';
.footer {
      background: #333333;
      color: #fff;
      padding: 14px 128px 14px 128px;
      font-weight: lighter;
      .about-us-title {
        font-size: 16px;
        padding: 20px 0;
      }
      ul {
        width: 100%;
        overflow: hidden;
        display: table;
        .footer-link {
          position: relative;
          a {
            display: inline-block;
            color: #fff;
            &:hover {
                text-decoration: underline;
                color: #abe254;
              }
          }
        }
        li {
          width: 25%;
          display: table-cell;
           b {
              line-height: 22px;
              font-weight: lighter;
            }
          span {
            color: #9d9d9d;
            display: inline-block;
            border-radius: 50%;
            border: 1px solid #9d9d9d;
            font-size: 18px;
            .mixin-width(32px);
            .mixin-height(32px);
          }
          p {
            font-size: 14px;
            display: inline-block;
            padding-left: 12px;
            em,i,a {
              color: #fff;
              line-height: 22px;
            }
            a:hover {
              text-decoration: underline;
              color: #abe254;
            }
          }
        }
      }
    }
    footer {
      color: #9b9b9b;
      background: #606060;
     .mixin-height(34px);
     .mixin-width(100%);
      }
@media screen and (max-width:1280px) {
    .footer ul li {
      width: 20%;
    }
    .footer ul .special-width {
      width: 30%;
    }
    .footer {
      padding-left: 5%;
      padding-right: 0;
    }
  }
@media screen and (max-width:910px) { 
  .footer ul .special-width {
      width: 22%;
      p {
        width: 62%;
      }
    }
}
</style>