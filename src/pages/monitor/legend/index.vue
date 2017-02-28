<template>
	<div class="common-legend">
		<ul class="drought-ul" v-if="legendData.length > 0">
			<li v-for="item in legendData" :style="{'background':item.bgcolor}">
				<span :style="{'color':item.fontColor}">{{item.words}}</span>
				<div class="tooltip-legend">
					<p class="drought-top">{{item.topTitle}}</p>
					<em class="legend-to">至</em>
					<p class="drought-bottom">{{item.bottomTitle}}</p>
				</div>
			</li>
		</ul>
		<h3 class="none" v-if="legendData.length > 0"
			 :style="{'background':legendData[-1].bgcolor}">
			<span>{{legendData[-1].words}}</span>
		</h3>
		<h3 v-else>无数据</h3>
  	</div>
</template>
<style
	lang="less"
   	rel="stylesheet/less"
   	scoped>
	.common-legend {
		z-index: 1;
   		position: fixed;
   		top: 257px;
   		right: 20px;
   		width: 30px;
   		height: 336px;
   			.none {
   				line-height: 54px;
			    height: 54px;
			    color: #fff;
			    background: #9a9a9a;
			    	span {
			    		font-size: 12px;
					    display: block;
					    width: 14px;
					    margin: 0 auto;
			    	}
			}
			li {
			    font-size: 10px;
			    position: relative;
			    display: block;
			    height: 54px;
			    cursor: pointer;
			    text-align: center;
			    text-decoration: none;
			    color: #ba632f;
			    	span {
					    line-height: 56px;
					}
					.tooltip-legend {
						display: none;
					    position: absolute;
					    top: -4px;
					    left: -50px;
					    width: 50px;
					    height: 64px;
					    background: rgba(255,255,255,.8);
					    	p {
							    width: 50px;
							    text-align: center;
							}
							.drought-top {
							    position: absolute;
							    top: 0;
							}
							.legend-to {
							    font-size: 12px;
							    line-height: 64px;
							    display: block;
							    text-align: center;
							}
							.drought-bottom {
							    position: absolute;
							    bottom: 0;
							}
					}
			}
			li:hover {
				.tooltip-legend {
				    display: block;
				}
			}
   	}
   	@media screen and ( max-height: 800px) {
	    .common-legend {
	        height: 236px;
	        .none {
	        	height: 36px;
	        	line-height: 36px;
	        }
	        li {
	        	height: 36px;
	        		span {
				        line-height: 36px;
				    }
				    .tooltip-legend {
				        top: -12px;
				    }
	    	}
	    }
    
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