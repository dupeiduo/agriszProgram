<template>
    <div class="index-footer home-slide pr">
        <div class="common-width">
            <ul>
                <li>
                    <span class="iconfont icon-dizhi footer-icon"></span>
                    <span class="footer-address">地址：北京丰台区总部基地十八区</span>
                </li>
                <li>
                    <span class="footer-icon iconfont icon-dianhua"></span>
                    <span class="footer-address">农情监测客服热线<br>010-52918959</span>
                </li>
                <li>
                    <span class="footer-icon iconfont icon-youxiang"></span>
                    <span class="footer-address">客服邮箱<br>kefu@agrisz.com</span>
                </li>
            </ul>
        </div>
        <div class="home-footer ps">农业数据信息监测及应用平台&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备案信息：京ICP备16023747号-1</div>
    </div>
</template>
<style
    lang="less"
    rel="stylesheet/less"
    scoped>
        .index-footer {
            width: 100%;
            height: 156px;
            background: #d1c1a5;
            .common-width {
                width: 800px;
                margin: 0 auto;
                    ul {
                        height: 50px;
                        padding-top: 30px;
                            li {
                                float: left;
                                margin: 0 14px;
                                    .footer-icon {
                                        font-size: 30px;
                                        line-height: 46px;
                                        display: inline-block;
                                        width: 50px;
                                        height: 50px;
                                        color: #f7f4ed;
                                        border-radius: 50%;
                                        text-align: center;
                                        background: rgba(255,255,255,.4);
                                    }
                                    .footer-address {
                                        display: inline-block;
                                        width: 172px;
                                        margin-left: 10px;
                                        color: #453f38;
                                    }
                            }
                    }
            }
            .home-footer {
                line-height: 44px;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 44px;
                text-align: center;
                color: #fff;
                background: #453f38;
            }
        }   
</style>