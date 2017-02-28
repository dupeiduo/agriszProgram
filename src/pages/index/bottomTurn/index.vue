<template>
	<div class="crop-reports home-slide" style="opacity: 1;">
	      <div class="common-width">
	        <div class="home-p animated fadeInRight">
	          <h3>农情报告</h3>
	          <p>AGRICULTURE REPOTR</p> 
	        </div>
	        <div id="bottom-turn" class="pr animated fadeInRight">
	          <span class="bottom-prev iconfont icon-jiantou-copy"></span>
	          <span class="bottom-next iconfont icon-jiantou-copy1"></span>
	          <ul class="home-report-list pr">
	          	<li style="display: block; width: 285px; height: 240px; top: 61px; left: 234px; z-index: 1;" v-for="(item,key) in bottomReport">
	          		<a href="/report">
	          			<img :src="item.img_url">
	          			<p>{{item.title}}</p>
	          		</a>
	          	</li>
	          	</ul>
	        </div>
	      </div>
	</div>
</template>
<style 
   lang="less"
   rel="stylesheet/less"
   scoped>
   .crop-reports {
    height: 588px;
    background: url('/static//assets/img/home/bg-shading.png') repeat-x;
    .common-width {
      width: 800px;
      margin: 0 auto;
      .home-p {
        font-size: 20px;
        padding-top: 26px;
        text-align: center;
        h3 {
          font-size: 20px;
          line-height: 38px;
        }
      }
      #bottom-turn {
        width: 520px;
        height: 350px;
        margin: 0 auto;
        .bottom-prev {
          left: -60px;
          font-size: 24px;
          position: absolute;
          top: 50%;
          overflow: hidden;
          width: 27px;
          height: 27px;
          margin-top: -14px;
          cursor: pointer;
        }
        .bottom-next{
          right: -60px;
          font-size: 24px;
          position: absolute;
          top: 50%;
          overflow: hidden;
          width: 27px;
          height: 27px;
          margin-top: -14px;
          cursor: pointer;
        }
        ul {
          overflow: hidden;
          width: 520px;
          height: 352px;
          li {
            position: absolute;
            z-index: 0;
            top: 146px;
            left: 377px;
            overflow: hidden;
            width: 0;
            height: 0;
            cursor: pointer;
            box-shadow: 0 3px 5px #c3c2c2;
            a {
              color: #404342;
              img {
                width: 100%;
                height: 100%;
                vertical-align: top;
              }
              p {
                font-size: 16px;
                font-weight: normal;
                line-height: 50px;
                position: absolute;
                bottom: 0;
                width: 100%;
                text-indent: 12px;
                border-bottom: 12px solid #5d4e49;
                background: rgba(255,255,255,.4);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: inherit;
              }
            }
          }
        }
      }
    }
  }
</style>
<script>
export default{
	props:{
		bottomReport : {
			type : Array,
			default : []
		}
	},
    data(){
      return {
      	el : '.crop-reports',
      }
    },
    mounted(){
      var _this = this;
      _this.reportSlider();
    },
    methods: {
      reportSlider() {
        function ImageSlider () {
          this.initialize.apply(this, arguments);  
        }
        ImageSlider.prototype = {
          initialize : function (id) {
            var _this = this;
            this.wrap = typeof id === "string" ? document.getElementById(id) : id;
            this.oUl = this.wrap.getElementsByTagName("ul")[0];
            this.aLi = this.wrap.getElementsByTagName("li");
            this.oP = this.wrap.getElementsByTagName("p");
            this.prev = this.wrap.getElementsByTagName("span")[0];
            this.next = this.wrap.getElementsByTagName("span")[1];
            this.oldMsg = [];
            this.timer = null;
            this.aSort = [];
            this.iCenter = 1;
            var oTxt = self.reportTitle;
            for(var i = 0; i < this.oP.length; i++){
              this.oP[i].innerHTML = this.oP[i].innerHTML;
            }
            this._doPrev = function () {return _this.doPrev.apply(_this)};
            this._doNext = function () {return _this.doNext.apply(_this)};
            this.options = [
            {width:285, height:240, top:61, left:234, zIndex:1},
            {width:285, height:240, top:61, left:0, zIndex:2},
            {width:285, height:308, top:37, left:110, zIndex:3},
            ]; 
            for (var i = 0; i < this.aLi.length; i++) this.aSort[i] = this.aLi[i];
            this.aSort.unshift(this.aSort.pop());
            this.setUp();
            this.addEvent(this.prev, "click", this._doPrev);
            this.addEvent(this.next, "click", this._doNext);
            this.doImgClick();    
            clearInterval(this.timer);
            this.timer = setInterval(function ()
            {
              _this.doNext()  
            }, 3000);   
            this.wrap.onmouseover = function ()
            {
              clearInterval(this.timer)  
            };
            this.wrap.onmouseout = function ()
            {
              clearInterval(this.timer);
              this.timer = setInterval(function ()
              {
                _this.doNext()  
              }, 3000); 
            }
          },
          doPrev : function () {
            this.aSort.unshift(this.aSort.pop());
            this.setUp()
          },
          doNext : function () {
            this.aSort.push(this.aSort.shift());
            this.setUp()
          },
          doImgClick : function () {
            var _this = this;
            for (var i = 0; i < this.aSort.length; i++)
            {
              this.aSort[i].onclick = function ()
              {
                if (this.index > _this.iCenter)
                {
                  for (var i = 0; i < this.index - _this.iCenter; i++) _this.aSort.push(_this.aSort.shift());
                    _this.setUp()
                }
                else if(this.index < _this.iCenter)
                {
                  for (var i = 0; i < _this.iCenter - this.index; i++) _this.aSort.unshift(_this.aSort.pop());
                    _this.setUp()
                }
              }
            }
          },
          // try{}catch(){}
          setUp : function () {
            var _this = this;
            var i = 0;
            for (i = 0; i < this.aSort.length; i++) {
              this.oUl.appendChild(this.aSort[i]);
            }
            for (i = 0; i < this.aSort.length; i++) {
              this.aSort[i].index = i;
              if (i < 7) {
                this.css(this.aSort[i], "display", "block");
                this.doMove(this.aSort[i], this.options[i], function ()
                {
                  _this.doMove(_this.aSort[_this.iCenter].getElementsByTagName("img")[0],function ()
                  {
                    _this.doMove(_this.aSort[_this.iCenter].getElementsByTagName("img")[0],function ()
                    {
                      _this.aSort[_this.iCenter].onmouseover = function ()
                      {
                        _this.doMove(this.getElementsByTagName("div")[0], {bottom:0})
                      };
                      _this.aSort[_this.iCenter].onmouseout = function ()
                      {
                        _this.doMove(this.getElementsByTagName("div")[0], {bottom:-100})
                      }
                    })
                  })
                });
              }
              else {
                this.css(this.aSort[i], "display", "none");
                this.css(this.aSort[i], "width", 0);
                this.css(this.aSort[i], "height", 0);
                this.css(this.aSort[i], "top", 37);
                this.css(this.aSort[i], "left", this.oUl.offsetWidth / 2)
              }
              if (i < this.iCenter || i > this.iCenter) {
                this.css(this.aSort[i].getElementsByTagName("img")[0], 100)
                this.aSort[i].onmouseover = function ()
                {
                  _this.doMove(this.getElementsByTagName("img")[0]) 
                };
                this.aSort[i].onmouseout = function ()
                {
                  _this.doMove(this.getElementsByTagName("img")[0])
                };
                this.aSort[i].onmouseout();
              }
              else {
                this.aSort[i].onmouseover = this.aSort[i].onmouseout = null
              }
            }   
          },
          addEvent : function (oElement, sEventType, fnHandler)
          {
            return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
          },
          css : function (oElement, attr, value)
          {
            if (arguments.length == 2)
            {
              return oElement.currentStyle ? oElement.currentStyle[attr] : getComputedStyle(oElement, null)[attr]
            }
            else if (arguments.length == 3)
            {
              switch (attr)
              {
                case "width":
                case "height":
                case "top":
                case "left":
                case "bottom":
                oElement.style[attr] = value + "px";
                break;
                case "opacity" :
                oElement.style.filter = "alpha(opacity=" + value + ")";
                oElement.style.opacity = value / 100;
                break;
                default :
                oElement.style[attr] = value;
                break
              } 
            }
          },
          doMove : function (oElement, oAttr, fnCallBack)
          {
            var _this = this;
            clearInterval(oElement.timer);
            oElement.timer = setInterval(function ()
            {
              var bStop = true;
              for (var property in oAttr)
              {
                var iCur = parseFloat(_this.css(oElement, property));
                property == "opacity" && (iCur = parseInt(iCur.toFixed(2) * 100));
                var iSpeed = (oAttr[property] - iCur) / 5;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                if (iCur != oAttr[property])
                {
                  bStop = false;
                  _this.css(oElement, property, iCur + iSpeed)
                }
              }
              if (bStop)
              {
                clearInterval(oElement.timer);
                fnCallBack && fnCallBack.apply(_this, arguments)  
              }
            }, 30)
          }
        };
        new ImageSlider("bottom-turn");
      }
      },
    components: {
    }
  }
 </script>