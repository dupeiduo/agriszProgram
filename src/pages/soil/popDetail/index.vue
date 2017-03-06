<template>
	<div>
		<div class="map-spot" :style="{'left':left + 'px','top':top + 'px','position':'absolute'}" v-show="showMapSpot">
			<div class="map-popover">
				<p class="pop-check-title pr">{{seatSpot.station}}<i class="el-icon-close ps" @click="showMapSpot = false"></i></p>
				<table class="pop-cleck-detail">
					<thead>
						<tr>
							<td width="78">监测项目</td>
							<td width="80">标准值</td>
							<td width="74">实测值</td>
							<td width="56">倍数</td>
						</tr>
					</thead>
					<tbody v-if="gridData.length > 0">
						<tr v-for="(item,index) in gridData">
							<td>{{item.name}}</td>
							<td>{{typeof item.normal === "object" ? item.normal[0] : item.normal}}</td>
							<td>{{item.actual}}</td>
							<td :class="item.times > 0 ? 'color-red':''">{{item.times}}</td>
						</tr>
					</tbody>
					<tbody v-else class="none-data">
						－暂无数据－
					</tbody>
				</table>
				<h3 class="check-company clear">
					<span class="fl check-company-detail pr no-select" @click="goDetail">查看详情</span>
					<span class="fl no-select" @click="checkCompany">查看周边企业</span>
				</h3>
			</div>
		</div>
		<div class="shadow-block" v-show="popBlock"></div>
		<div class="pop-company-block pr" v-show="popBlock">
			<p class="el-icon-close pop-delete ps" @click="popBlock = false"></p>
			<h3 v-if="standardInfo.length > 0" class="pop-site">{{seatSpot.station}}&nbsp;&nbsp;&nbsp;&nbsp;共<i class="color-red">{{standardInfo.length}}</i>项超标项目</h3>
			<h3 v-else class="pop-site">{{seatSpot.station}}&nbsp;&nbsp;&nbsp;&nbsp;无超标项目</h3>
			<ul>
				<li v-for="item in standardInfo">
					<span>{{item.name}}</span>
					<em>{{item.actual}}</em>
				</li>
			</ul>
			<div class="company-range clear">
				<h3 class="fl">周边企业</h3>
				<p class="fr">在
					<select @change="getRange($event)">
						<option 
							v-for="(item,index) in range"
							:value="item.value">{{item.name}}</option>
					</select>
					范围内，共<i class="color-red">{{enterprise.length}}</i>企业数
				</p>
			</div>
			<div class="company-range-table" v-loading.body="enteLoading">
				<table>
					<thead>
						<tr>
							<th>企业名称</th>
							<th>所处位置</th>
						</tr>
					</thead>
					<tbody v-if="enterprise.length > 0">
						<tr v-for="item in enterprise">
							<td>{{item.name}}</td>
							<td>{{item.address}}</td>
						</tr>
					</tbody>
					<tbody class="none-data" v-else>－暂无数据－</tbody>
				</table>
			</div>
			<p class="down-data ps no-select" @click="downLoad"><b class="iconfont icon-xiazai1"></b>下载企业数据</p>
		</div>
		<pop-message popTitle="暂无可下载数据" ref="popMessage"></pop-message>
	</div>
</template>
<script>
import request from 'api/request.js'
import model from 'api/model.js'

	export default {
		props: {
			gridData: {
				type: Array,
				default: []
			},
			seatSpot: {
				type: Object,
				default: {
					station: ''
				}
			},
			coordinates: {
				type: Array,
				default: []
			},
			standardInfo: {
				type: Array,
				default: []
			},
      left: {
        type: Number,
        default: 0
      },
      top: {
        type: Number,
        default: 0
      },
      showPop: {
        type: Boolean,
        default: false
      }
		},
		data() {
			return {
				popBlock: false,
				showMapSpot: false,
				range:[
					{
						name: '500m',
						value: 500,
					},
					{
						name: '1km',
						value: 1000,
					},
					{
						name: '2km',
						value: 2000,
					},
					{
						name: '5km',
						value: 5000,
					},
					{
						name: '20km',
						value: 20000,
					}
				],
				curRange: 500,
				enterprise: [],
				enteLoading: false
			}
		},
		mounted() {
		},
		methods: {
			checkCompany(){
				this.popBlock = true
				this.getEnterprises()
			},
			getRange(event) {
				this.curRange = event.target.value
				this.getEnterprises()
			},
			getEnterprises() {
        var data = {
          point: this.coordinates,
          radius: this.curRange
        }
        this.enteLoading = true
        request.nearEnterprises(data).then((response) => {
          if (response.status === 200 && response.data.status === 0) {
            this.enterprise = model.formateEnterprise(response.data.data)
          } else{
          	this.enterprise = []
          }
          this.enteLoading = false
        })
      },
      downLoad() {
        var data = {
          point: this.coordinates,
          radius: this.curRange,
          filename: this.seatSpot.station + '监测点周边企业'
        }
        if (this.enterprise.length > 0) {
        	request.downLoadEnteInfo(data)
        } else {
        	this.$refs['popMessage'].showDialog()
        }
      },
      goDetail() {
      	this.$emit('goDetail', this.seatSpot.id)
      }
		},
		watch: {
			gridData: function(){
				this.showMapSpot = true;
			},
      showPop(show) {
        if (!show) {
          this.showMapSpot = false
        }
      }
		}
	}
</script>
<style 
lang="less" 
scoped>
.map-spot {
	width: 288px;
	height: 160px;
	border-radius: 4px;
	background: #fff;
	box-shadow: -2px 0px 6px #aeaeae;
	.pop-cleck-detail {
		.color-red {
				color: #f15553;
			}
		td {
			text-align: center;
		}
		thead {
			tr {
				height: 36px;
				line-height: 36px;
				background: #eef6fb;
					td {
					 font-weight: bold;	
					}
			}
		}
		tbody {
			tr:nth-child(2n) {
				background: #eef6fb;
			}
			tr {
				height: 28px;
				line-height: 28px;
			}
		}
	}
}
.map-popover {
	width: 288px;
	height: 160px;
	border-radius: 4px;
	overflow: hidden;
  .pop-check-title {
  	line-height: 34px;
  	height: 34px;
    font-size: 14px;
    padding: 0 12px;
    font-weight: bold;
    i {
      right: 12px;
      top: 10px;
      cursor: pointer;
      color: #8e8e8e;
      cursor: pointer;
      &:hover {
        color: #367f05;
      }
    }
  }
  .check-company {
  	border-top: 1px solid #e0e6ed;
    line-height: 33px;
    height: 33px;
    background: #fff;
    .check-company-detail:after {
      position: absolute;
      right: 0;
      width: 1px;
      height: 24px;
      vertical-align: middle;
      content: '';
      margin-top: 6px;
      display: inline-block;
      background: #e0e6ed;
    }
    span {
      width: 144px;
      display: inline-block;
      text-align: center;
      color: #81a963;
      cursor: pointer;
      &:hover {
        color: #8ad573;
        background: #f6f5f5;
      }
    }
  }
}
.shadow-block {
	z-index: 2;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,.5);
}
.pop-company-block {
	z-index: 3;
	position: absolute;
	left: 50%;
	top: 50%;
	width: 678px;
	height: 432px;
	transform: translate(-50%,-50%);
	background: #fff;
	border-radius: 4px;
	.color-red {
		color: #f15553;
		margin: 0 4px;
		font-size: 16px;
	}
	.pop-delete {
		top: 12px;
		right: 14px;
	}
	.pop-site {
		font-size: 14px;
		margin: 24px 0 0 30px;
		font-weight: bold;
	}
	ul {
		width: 610px;
		margin: 20px 0 0px 30px;
		overflow: hidden;
		 li {
		 	float: left;
		 	height: 28px;
		 	line-height: 28px;
		 	margin: 0 22px 20px 0;
		 	border: 1px solid #c0df8a;
		 	border-radius: 4px;
		 	color: #f15553;
		 	background: #e2f0d0;
		 	 span {
		 	 	padding: 7px 8px;
		 	 	background: #beea88;
		 	 	color: #000;
		 	 }
		 	 em {
		 	 	padding: 0 12px 0 8px;
		 	 }
		 }
	}
	.company-range {
		padding-left: 30px;
		border-top: 2px solid #e5e5e5;
		 h3 {
		 	font-size: 14px;
		 	line-height: 45px;
		 }
		 p {
		 	margin-right: 42px;
		 	margin-top: 8px;
		 	 select {
		 	 	height: 28px;
		 	 	background: #f4fcfc;
		 	 }
		 }
	}
	.company-range-table {
		width: 616px;
		border-radius: 4px;
		margin: 0 auto;
		border: 1px solid #bcc4c9;
		overflow: hidden;
		table {
			width: 100%;
			thead {
				display: block;
    			width: 100%;
			}
			.none-data {
				position: relative;
				top: 20px;
			}
			tbody {
				display: block;
			    height: 150px;
			    overflow: auto;
			    width: 100%;
				tr:nth-child(2n) {
					background: #e5f5fd;
				}
			}
			tr {
				th {
					height: 36px;
					line-height: 36px;
					border-bottom: 1px solid #bcc4c9;
					background: #e5f5fd;
				}
				td,th {
					height: 30px;
					line-height: 30px;
					text-align: center;
					width: 308px;
				}
			}
		}
	}
	.down-data {
		right: 30px;
		bottom: 30px;
		width: 112px;
		height: 28px;
		line-height: 28px;
		background: #8ec51f;
		color: #fff;
		border-radius: 4px;
		cursor: pointer;
		 b {
			margin: 0 4px 0 12px;
		}
		&:hover {
			background: #7cb406;
		}
	}
}
</style>