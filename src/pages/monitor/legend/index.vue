<template>
	<div class="common-legend map-zIndex">
    <div v-if="legendData.length > 0">
      <p class="length-name-top">{{legendData[0].words}}</p>
      <ul class="drought-ul">
        <li v-for="item in legendData" :style="{'background':item.bgcolor}">
          <el-tooltip class="item" effect="dark"  popper-class="tooltip-opacity" :content="item.words" placement="left">
            <div class="tooltip-legend">
              <span :style="{'color':item.fontColor}">{{item.words}}</span>
            </div>
        </el-tooltip>
        </li>
      </ul>
      <h3 class="none" v-if="legendData.length > 0"
         :style="{'background':legendData[-1].bgcolor}">
         <el-tooltip class="item" effect="dark"  popper-class="tooltip-opacity" :content="legendData[-1].words" placement="left">
          <span>{{legendData[-1].words}}</span>
        </el-tooltip>
      </h3>
      <p class="length-name-bottom">{{legendData[legendData.length -1].words}}</p>
    </div>
  		
		<h3 v-else class="none-data">无<br/>数<br/>据</h3>
		
  	</div>
</template>
<style
	lang="less"
   	rel="stylesheet/less"
   	scoped>
    @import '../../../assets/style/common';
	.common-legend {
   		position: fixed;
   		top: 210px;
   		right: 12px;
   		width: 32px;
   		height: 214px;
   		background: #fff;
   		border-radius: 4px;
   		overflow: hidden;
   		.adv-common-border-radius();
   		.adv-boxshadow();
   			p {
   				text-align: center;
   				height: 24px;
   				line-height: 24px;
   			}
   			.none {
   				line-height: 28px;
			    height: 28px;
			    width: 14px;
			    margin: 0 auto;
			    background: #9a9a9a;
			    cursor: default;
			    	span {
					    display: block;
					    width: 14px;
					    margin: 0 auto;
					    opacity: 0;
			    	}
			}
			li {
			    display: block;
			    width: 14px;
			    height: 28px;
			    line-height: 28px;
			    cursor: default;
			    margin: 0 auto;
			    span {
			    	font-size: 0px;
			    }
			}
   	}
   	.none-data {
   		text-align: center;
   	}
</style>
<script>
	export default{
		props:{
			legendData: {
				type : Array,
				default: []
			}
		},
		data(){
			return {

			}
		},
		methods:{},
		components: {}
	}
</script>