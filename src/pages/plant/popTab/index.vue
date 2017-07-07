<template>
	<div class="pop-tab" v-show="showTab">
		<my-dialog
		  :width="'782'"
		  @close="closeTab"
		>
	      <div slot="title" class="pr">
		      <em class="pop-title ps">种植适宜性分级面积统计表</em>
		      <div class="pop-right ps">
		      	<span class="export-tab fr" 
			          :class="tableData.length === 0 ? 'no-data' : ''"
			          @click="dlSuitArea">导出表格
			    </span>
			    <div class="unit-change fr">
			    	<el-select class="hm-selector"
				    	popper-class="select-dropdown"
				    	size="small"
				    	v-model="value"
				    	@change="changeUnit">
				    	<el-option
					    	v-for="item in areaOption"
					    	:label="item.label"
					    	:value="item.value">
				    	</el-option>
					</el-select>
			    </div>
			    <p class="area-unit fr">面积单位</p>
		      </div>	
	      </div>
	      <div slot="content" class="table-content pr">
	      	<table v-if="tableData && tableData.length > 0">
	      		<thead style="border-bottom: 1px solid #7d7d7d">
	      			<tr>
	      				<th width="130">行政区</th>
	      				<th width="110" class="pr no-select common-cursor" @click="sortArea">总面积 
	      					<span>
	      						<i class="iconfont icon-xiangshangjiantou" :class="orderByArea ? 'active' : ''"></i>
	      						<i class="iconfont icon-xiangshangjiantou1" :class="orderByArea ? '' : 'active'"></i>
	      					</span>
	      				</th>
	      				<th width="120" class="pr no-select common-cursor" @click="sortSuit">
	      					<em class="iconfont icon-zixunyuanjiaozhengfang suit-color"></em>
	      					适宜 
	      					<span>
	      						<i class="iconfont icon-xiangshangjiantou" :class="orderBySuit ? 'active' : ''"></i>
	      						<i class="iconfont icon-xiangshangjiantou1" :class="orderBySuit ? '' : 'active'"></i>
	      					</span>
	      				</th>
	      				<th width="120" class="pr no-select common-cursor" @click="sortGenSuit">
	      					<em class="iconfont icon-zixunyuanjiaozhengfang gensuit-color"></em>
	      					一般适宜 
	      					<span>
	      						<i class="iconfont icon-xiangshangjiantou" :class="orderByGenSuit ? 'active' : ''"></i>
	      						<i class="iconfont icon-xiangshangjiantou1" :class="orderByGenSuit ? '' : 'active'"></i>
	      					</span>
	      				</th>
	      				<th width="120" class="pr no-select common-cursor" @click="sortUnSuit">
	      					<em class="iconfont icon-zixunyuanjiaozhengfang unsuit-color"></em>
	      					不适宜 
	      					<span>
	      						<i class="iconfont icon-xiangshangjiantou" :class="orderByUnSuit ? 'active' : ''"></i>
	      						<i class="iconfont icon-xiangshangjiantou1" :class="orderByUnSuit ? '' : 'active'"></i>
	      					</span>
	      				</th>
                		<th width="140" class="pr no-select">专题图下载</th>
	      			</tr>
	      		</thead>
	      		<tbody>
	      			<tr v-for="(item,index) in tableData"
	      			    :id="item.id"
	      				:class="(currentIndex.includes(index) ? 'index ': ' ') + 
	      				        (item.isParent ? 'active ' : ' ') + 
	      				        (currentIndex.includes(index) && item.isParent ? 'active-index ': ' ')"
	      				>
	      				<td width="130">{{item.name}}</td>
	      				<td width="110">{{item[unit.key] + unit.name}}</td>
	      				<td width="120">{{item.suit[unit.key] + unit.name}} {{item.suit.percent}}%</td>
	      				<td width="120">{{item.geSuit[unit.key] + unit.name}} {{item.geSuit.percent}}%</td>
	      				<td width="120">{{item.unSuit[unit.key] + unit.name}} {{item.unSuit.percent}}%</td>
                		<td width="140" @click="downloadImage(item.id)" class="download-image">
                			<i class="iconfont icon-xiazai1"></i>
                  			<span class="download-hover animated fadeInRight fade-animation">{{imageUrlList && imageUrlList[item.id] ? '点击下载': '暂无'}}</span>
                		</td>
	      			</tr>
	      		</tbody>	
	      	</table>
	      <expect-data v-else :showSectionData="true"></expect-data>
	      </div>
		</my-dialog>
	</div>
</template>

<script>
import {elementUtil} from 'plugins/utils.js'
import expectData from 'components/expectData/'
  export default {
    data () {
      return {
      	orderByArea: true,
      	orderBySuit: true,
      	orderByGenSuit: true,
      	orderByUnSuit: true,
        unit: {key: 'mu', name: '万亩'},
      	value: '万亩',
      	showSectionData: false,
      	areaOption: [{value: 'mu',label: '万亩'},
      				 {value: 'ha',label: '千公顷'}]
      }
    },
    props: {
    	tableData: {
    		type: Array,
    		default: []
    	},
    	showTab: {
    		type: Boolean,
    		default: false
    	},
    	currentIndex: {
    		type: Array,
    		default: [1]
    	},
      imageUrlList: {
        type: Object,
        default: null
      }
    },
    mounted() {
    },
    methods: {
    	closeTab(){
    		this.$emit('closeTab')
    	},
    	sortArea(){
    		this.orderByArea =! this.orderByArea
    		this.$emit('sortArea',this.orderByArea)
    	},
    	sortSuit(){
    		this.orderBySuit =! this.orderBySuit
    		this.$emit('sortSuit',this.orderBySuit)
    	},
    	sortGenSuit(){
    		this.orderByGenSuit =! this.orderByGenSuit
    		this.$emit('sortGenSuit',this.orderByGenSuit)
    	},
    	sortUnSuit(){
    		this.orderByUnSuit =! this.orderByUnSuit
    		this.$emit('sortUnSuit',this.orderByUnSuit)
    	},
      dlSuitArea() {
        if (this.tableData.length > 0) {
          this.$emit('dlSuitArea')
        }
      },
      downloadImage(code) {
        this.imageUrlList[code] && elementUtil.downLoad(this.imageUrlList[code])
      },
      changeUnit(value) {
        for (var i = 0; i < this.areaOption.length; i++) {
          if (this.areaOption[i].value == value) {
            this.unit = {key: this.areaOption[i].value, name: this.areaOption[i].label}

            break
          }
        }
      	
      }
    },
    components: {
    	expectData
    },
    watch: {
      
    }
  }
</script>

<style 
lang="less">
@import '../../../assets/style/common';
.suit-color {
	color: #9bdb42;
}
.unsuit-color {
	color: #a0a0a0;
}
.gensuit-color {
	color: #54c2bc;
}
.common-cursor {
	cursor: pointer;
}
.pop-tab {
	.content {
		padding-bottom: 21px;
	}
	.pop-title {
		font-weight: bold;
		font-size: 16px;
	}
	.pop-right {
		right: -8px;
	    top: 0px;
	    .area-unit {
	    	font-size: 14px;
	    	line-height: 28px;
	    }
	    .unit-change {
	    	width: 68px;
	    	height: 28px;
	    	margin: 0 12px 0 16px;
	    	.el-input__inner {
	    		height: 28px;
	    	}
	    }
		.export-tab {
			display: block;
			color: #fff;
			background: #80b218;
			cursor: pointer;
			.adv-common-border-radius();
			.adv-horizontal-center(78px);
			.adv-height(28px);
			&:hover {
				background: #7eb902;
			}
		}
	}
  .no-data {
    background: #e3e3e3;
    &:hover {
      background: #e3e3e3;
    }
  }
	.table-content {
		.adv-common-border-radius();
		margin: 0 20px;
		border: 1px solid #7d7d7d;
		min-height: 150px;

    p {
      font-size: 14px;
      padding: 10px 0;
      text-align: center;
    }
		table {
			width: 100%;
			overflow: hidden;
			thead {
				.adv-gradient(#f6f6f6;#e5e5e5);
				display: block;
				width: 100%;
				tr {
					
				}
				th {
					.adv-font-normal();
					height: 36px;
					text-align: center;
					font-weight: normal;
					em {
						font-size: 12px;
					}
					span {
						position: absolute;
						top: 10px;
						i {
							font-size: 12px;
							height: 5px;
							display: block;
							cursor: pointer;
						}
						.active {
							color: green;
						}
					}
				}
			}
			tbody {
				width: 100%;
				display: block;
				max-height: 334px;
				overflow-x: hidden;
				tr:nth-child(2n) {
				    background: #ecf7fc;
				}
				.index {
					border: 1px solid #9f9f9f;
					border-left: none;
					border-right: none;
					background: #eff6f9 !important;
					td {
						color: #c58955;
					}
				}
				.active {
					.adv-font-normal();
					height: 37px;
					margin-left: 1px;
					font-weight: bold;
					background: #dbf0fe;
				}
				.active-index {
					.adv-font-normal();
					height: 37px;
					font-weight: bold;
					background: #dbf0fe !important;
					border: 1px solid #9f9f9f;
					border-left: none;
					border-right: none;
					td {
						color: #c58955;
					}
				}
				td {
					text-align: center;
					height: 32px;
					&:nth-child(2) {
							border-right: 1px solid @border-color;
						}
				}
        .download-image {
          cursor: pointer;
          i {
          	font-size: 12px;
          }
          .download-hover {
          	display: none;
          }
          &:hover {
          	.download-hover {
          		display: block;
          	}
          	.download-word,i {
          		display: none;
          	}
          }
        }
			}
		}
	}
}
</style>
