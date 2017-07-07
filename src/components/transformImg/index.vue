<template>
	<div>
		<div class="img-wrap pr" v-loading.lock="imgLoading">
			<div class="img-container pr">
				<img 
				class="img-target ps" 
				alt="图片加载中…"
				draggable="false"
				ondragstart="return false"
				:src="photoSrc + '?x-oss-process=image/auto-orient,1'" 
				:style="{
					left: imgLeftValue + 'px',top: imgTopValue + 'px',
					width:sizeAccording ? 'auto' : imgTargetWidth + 'px',
					height: sizeAccording ? imgTargetHeight + 'px' : 'auto'}"
				@mousedown="mousedown"
				@mousemove="figureLength"
        @mouseup="clearDrag"
        @mousewheel="getWheelScale"
        @load="imgLoaded"
				>	
				<span class="iconfont icon-fangda ps zoom-big-btn" @click="zoomBig"></span>
				<span class="iconfont icon-minus ps zoom-small-btn" @click="zoomSmall"></span>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props:{
			photoSrc:{
				type: String,
				default: '../../../static/assets/img/home/banner3.jpg'
			}
			
		},
		data(){
			return {
				maxScale: 4,
				minScale: 0.3,
				imgLeftValue: 0,
				imgTopValue: 0,
				scaleTimes: 1,
				scaleChange: 0.2,

				disX: 0,
				disY: 0,
				draging: false,

				scaleLockX:false,
				scaleLockY:false,

				isImgLoad: false,

				imgTargetWidth: 1000,
				imgTargetHeight: 1000,
				imgTarget: null,

				imgWrap:null,
				sizeAccording: false,

				imgLoading: false,
				imgLoadComplete: false,

				ZOOM_STEP: 0.05,

				fixedHeight: 0,
				fixedWidth:0,

			}
		},
		mounted(){
    	this.imgTarget = document.getElementsByClassName("img-target")[0]
    	this.imgWrap = document.getElementsByClassName("img-wrap")[0]
			this.imgLoading = true
    	this.initImgSize()
		},
		methods:{
			zoomByWidth(){
				this.scaleTimes -= this.ZOOM_STEP
				this.imgTargetWidth = this.imgTargetWidth * this.scaleTimes
			},
			zoomByHeight(){
				this.scaleTimes -= this.ZOOM_STEP
				this.imgTargetHeight = this.imgTargetHeight * this.scaleTimes
			},
			setImgCenter(){
				this.$nextTick(() => {
					this.imgTopValue = (this.imgWrap.clientHeight - this.imgTarget.clientHeight - 20) / 2
					this.imgLeftValue = (this.imgWrap.clientWidth - this.imgTarget.clientWidth - 20) / 2
				})
			},
			zoomBig(){
				if (this.scaleTimes >= this.maxScale) {
					this.scaleTimes += 0 
				}else{
					this.accordingSizeZoomBig()
					this.scaleTimes += this.scaleChange
					this.setImgCenter()
				}
			},
			accordingSizeZoomBig(){
				if (this.sizeAccording) {
					this.imgTargetHeight = this.imgTargetHeight * (1 + this.scaleChange)
				}else{
					this.imgTargetWidth = this.imgTargetWidth * (1 + this.scaleChange)
				}
			},
			zoomSmall(){
				if (this.scaleTimes <= this.minScale) {
					this.scaleTimes -= 0
				}else{
					this.accordingSizeZoomSmall()
					this.scaleTimes -= this.scaleChange
					this.setImgCenter()
				}
			},
			accordingSizeZoomSmall(){
					if (this.sizeAccording) {
						this.imgTargetHeight = this.imgTargetHeight * (1 - this.scaleChange)
					}else{
						this.imgTargetWidth = this.imgTargetWidth * (1 - this.scaleChange)
					}
			},
			mousedown(event){
        event = event || window.event; 
        this.disX = event.clientX
        this.disY = event.clientY
        this.draging = true
      },
      figureLength(event) {
       	var event = event || window.event
        if (this.draging) {
      		this.getScaleLockStatus()
	        if (this.draging && this.scaleLockX && this.scaleLockY === false) {
	          this.moveHorizontal(event)
	        }else if (this.draging && this.scaleLockY && this.scaleLockX === false) {
	          this.moveVertical(event)
	        }else if (this.draging && this.scaleLockX && this.scaleLockY) {
	        	this.moveFree(event)
	        }else{
	        	this.setImgCenter()
	        	return
	        }
      	}
        
      },
      moveHorizontal(event){
      	var moveLeft = event.clientX - this.disX;  

	      this.imgLeftValue += moveLeft
        this.disX = event.clientX
				this.judgeDragBoundaryHorizontal()
      },
      moveVertical(event){
      	var moveTop = event.clientY - this.disY;

        this.imgTopValue += moveTop
        this.disY = event.clientY
				this.judgeDragBoundaryVertical()
      },
      moveFree(event){
      	var moveLeft = event.clientX - this.disX
        var moveTop = event.clientY - this.disY
  
        this.imgLeftValue += moveLeft
        this.imgTopValue += moveTop 
        this.disX = event.clientX
        this.disY = event.clientY
				this.judgeDragBoundaryVertical()
				this.judgeDragBoundaryHorizontal()
      },
      judgeDragBoundaryHorizontal(){
      		if (this.imgLeftValue > 0) {
	      		this.imgLeftValue = 0
	      	}
		      if (this.imgLeftValue < this.imgWrap.clientWidth - this.imgTarget.clientWidth) {
		      	this.imgLeftValue = this.imgWrap.clientWidth - this.imgTarget.clientWidth
		      }
      },
      judgeDragBoundaryVertical(){
      	if (this.imgTopValue > 0) {
      		this.imgTopValue = 0
	     	}
	     	if (this.imgTopValue < this.imgWrap.clientHeight - this.imgTarget.clientHeight - 10) {
	     		this.imgTopValue = this.imgWrap.clientHeight - this.imgTarget.clientHeight - 10
	     	}
      },
      clearDrag() {
        this.draging = false
      },
      getScaleLockStatus(){
      	var imgWrapHeight = this.imgWrap.clientHeight
      	var imgWrapWidth = this.imgWrap.clientWidth
      	
      	setTimeout(() => {
      		var imgWidth = this.imgTarget.clientWidth
      		var imgHeight = this.imgTarget.clientHeight

      		if (imgWidth <= imgWrapWidth && imgHeight >= imgWrapHeight) {
	      		this.scaleLockX = false
	      		this.scaleLockY = true
	      	}else if (imgWidth >= imgWrapWidth && imgHeight <= imgWrapHeight){
	      		this.scaleLockX = true
	      		this.scaleLockY = false
	      	}else if (imgWidth >= imgWrapWidth && imgHeight >= imgWrapHeight){
	      		this.scaleLockX = true
	      		this.scaleLockY = true
	      	}else{
	      		this.scaleLockX = false
	      		this.scaleLockY = false
	      	}

      	})
      },
      getWheelScale(event){
      	var ev = event || window.event;

      	if (ev.wheelDelta > 0 && this.scaleTimes <= this.maxScale || ev.wheelDelta < 0 && this.scaleTimes >= this.minScale) {
      		var changed = ev.wheelDelta * 0.002
      		if (this.scaleTimes + changed >= this.maxScale && changed > 0) {
      			this.setMaxSize()

      		} else if (this.scaleTimes + changed <= this.minScale && changed < 0) {
      			this.setMinSize()

      		} else {
      			this.scaleTimes += changed
      			this.scaleTimes = this.scaleTimes < this.minScale ? this.minScale : this.scaleTimes
      			this.scaleTimes = this.scaleTimes > this.maxScale ? this.maxScale : this.scaleTimes

      			if (this.sizeAccording) {
							this.imgTargetHeight = this.fixedHeight * this.scaleTimes

						} else{
							this.imgTargetWidth = this.fixedWidth * this.scaleTimes
						}
      			this.setImgCenter()
      		}
      	}
      
      },
      setMinSize(){
      	this.scaleTimes = this.minScale
				this.imgTargetHeight = this.fixedHeight * this.scaleTimes
      	this.setImgCenter()
      },
      setMaxSize(){
      	this.scaleTimes = this.maxScale
				this.imgTargetWidth = this.fixedWidth * this.scaleTimes
				this.setImgCenter()
      },
    	imgLoaded(){

    		this.setFixedSize()

    		this.sizeAccording = false
				var count = 0
				let CLIENT_WIDTH = this.imgWrap.clientWidth
				let CLIENT_HEIGHT = this.imgWrap.clientHeight

				var wrapRate = CLIENT_WIDTH / CLIENT_HEIGHT

				var imgRate = this.imgTargetWidth / this.imgTarget.clientHeight

				if (wrapRate < imgRate) {
					while ( CLIENT_WIDTH <= this.imgTargetWidth && count < 1000){
						this.zoomByWidth()
						count ++
					}
				} else {
					this.sizeAccording = true

					while ( CLIENT_HEIGHT <= this.imgTargetHeight && count < 1000){
						this.zoomByHeight()
						count ++
					}
				}
				this.setImgCenter()
				this.imgLoading = false
				
    	},
    	initImgSize() {
				this.imgTargetWidth = this.imgWrap.clientWidth
    	},
    	setFixedSize() {
    		this.fixedHeight = this.imgTarget.clientHeight
				this.fixedWidth = this.imgTarget.clientWidth
    	}
		},
		watch:{
			photoSrc(url){
				if (url) {
					this.isImgLoad = true
				}
			}
		}
	}
</script>
<style
 lang="less" scoped>
	@import '../../assets/style/common';
	.img-wrap {
		padding: 10px;
		box-sizing: border-box;
		border-top: 1px solid #cbcbcb;
		background: @assistant-bg;
  	user-select: none;
  	overflow: hidden;
  		.img-target {
	  		top: 0;
	  		left: 0;
	  		cursor: move;
	  		width: 100%;
	  	}
  	
  	
		.zoom-big-btn {
			.adv-height(30px);
			.adv-font-large();
			.adv-border-left-radius();
			display: inline-block;
			width: 36px;
			text-align: center;
			top: 10px;
			right: 68px;
			color: #8f8d8b;
			cursor: pointer;
			background: hsla(0,0%,100%,.7);
			&:after{
				position: absolute;
		    right: 0;
		    content: "";
		    width: 1px;
		    height: 29px;
		    background: #a6a699;
		    vertical-align: middle;
		    display: inline-block;
			};
		}
		.zoom-small-btn {
			.adv-height(30px);
			.adv-font-large();
			.adv-border-right-radius();
			display: inline-block;
			width: 36px;
			text-align: center;
			top: 10px;
			right: 32px;
			color: #8f8d8b;
			cursor: pointer;
			background: hsla(0,0%,100%,.7);
		}
	}
</style>