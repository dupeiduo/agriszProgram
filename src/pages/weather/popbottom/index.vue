<template>
	<div class="pop-bottom pr bottom-pop-zIndex"
		 :style="{'left': menuWidth + 'px',width: screenWidth - menuWidth + 'px' }">
		 <span class="el-icon-close ps close-btn" @click="hideBottom"></span>
		 <slot name="pop-echart"></slot>
		 </div>
</template>

<script>
import {mapGetters} from 'vuex'
  export default{
    computed: {
     ...mapGetters({
        menuWidth: 'menuWidth',
        getScreenHeight: 'getScreenHeight',
        screenWidth: 'screenWidth'
    })},
    methods: {
    	hideBottom(){
    		this.$emit('hideBottom')
    	}
    },
    watch: {
    	
    },
    components: {
    }
  }
</script>
<style scoped 
lang="less">
@import '../../../assets/style/common';
.pop-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	background: @assistant-bg;
  height: 0;
	.close-btn {
    .adv-font-small();
    z-index: 2;
		cursor: pointer;
		right: 12px;
		top: 12px;
	}
}
@keyframes bottom-in {
    0% {
    	height: 0px;
    }
    100% {
       height: 212px;
    }
}
.we-bottom-in {
  .adv-animation(bottom-in;.5s;1;forwards)
}
@keyframes bottom-out {
    0% {
    	height: 212px;
    }
    100% {
      height: 0px;
    }
}
.we-bottom-out {
  .adv-animation(bottom-out;.5s;1;forwards)
}
</style>