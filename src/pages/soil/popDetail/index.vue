<template>
	<div>
		<div class="map-spot" :style="{'left':left + 'px','top':top + 'px','position':'absolute'}" v-show="showMapSpot">
			<div class="map-popover">
				<p class="pop-check-title pr">{{seatSpot.station}}<i class="el-icon-close ps" @click="hideMapSpot"></i></p>
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
		<div v-show="showPopup"
			class="pop-company-block pf"
			@mouseenter="mouseEnterHandler"
			@mouseleave="mouseOutHandler" 
			:class="className">
			<span class="iconfont lock-popup ps fl" 
				:class="autoFadeIn ? 'icon-suo' : 'icon-suo-'"
				@click="autoFadeIn=!autoFadeIn"></span>
			
			<p class="el-icon-close pop-delete ps" @click="popDelete()"></p>
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
					范围内，<span v-if="enterprise.length === 0">没有找到相关企业，请尝试切换搜索范围</span>
					<span v-else>共<i class="color-red">{{enterprise.length}}</i>企业数</span>
				</p>
			</div>
			<div class="company-range-table" v-loading.lock="enteLoading">
				<table>
					<thead>
						<tr>
							<th width="168">企业名称</th>
							<th width="250">所处位置</th>
							<th width="100">位置</th>
						</tr>
					</thead>
					<tbody v-if="enterprise.length > 0">
						<tr v-for="(item, index) in enterprise">
							<td width="168">{{item.name}}</td>
							<td width="250">{{item.address}}</td>
							<td width="100" class="soil-place" @click="addEnterPoi(index)">
								<i class="iconfont icon-weizhi check-site"
								></i>
								<span class="animated fadeInRight fade-animation">查看企业位置</span>
							</td>
						</tr>
					</tbody>
					<tbody class="none-data" v-else>－暂无数据－</tbody>
				</table>
			</div>
			<p class="down-data ps no-select" :style="{background: enterprise.length > 0 ? '#8ec51f' : '#e3e3e3'}" @click="downLoad"><b class="iconfont icon-xiazai1"></b>下载企业数据</p>
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
				enteLoading: false,
				className: '',
				showPopup: false,
				autoFadeIn: true,

				popStatus: {
					timeHander: null,
					popping: false,
					popAwayReqTimeHander: null,
					poppedUp: false	// remember to init when created
				}
			}
		},
		mounted() {
		},
		methods: {
			hideMapSpot() {
				this.showMapSpot = false
				this.showPopup = false
			},
			checkCompany(){
				this.showPopup = true
				this.getEnterprises()

				// appear
				this.doPopUp();
			},

			/* frame event handlers */
			mouseEnterHandler() {
				// whenever the mouse is entering, just cancel pop-out request
				this.cancelPopAwayRequest()

				// try to pop out if it is popped in
				if(!this.popStatus.poppedUp && !this.popStatus.popping) {
					this.doPopUp()
				}
			},
			mouseOutHandler() {
				// try to pop away if it is popped out
				if (this.autoFadeIn) {
					if (this.popStatus.poppedUp && !this.popStatus.popping) {
						this.reqPopAway(200)
					}
				}
			},

			// prepare to pop away, it may be cancelled if mouse is back again
			reqPopAway(latency) {
				if(!latency && latency != 0) {
					// default latency if it is not set
					latency = 180
				}

				// when fading animation is processing, it won't trigger
				if (this.popStatus.popping) {
					return
				}

				// pop-out will be executed if it's not cancelled in 180 ms
				if(this.popStatus.popAwayReqTimeHander) {
					// just in case, make sure the uniqueness
					clearTimeout(this.popStatus.popAwayReqTimeHander)
				}
				
				// execute pop away after certain time period
				this.popStatus.popAwayReqTimeHander = setTimeout(() => {
					this.doPopAway()
				}, latency)
			},

			// cancelling the request to pop away
			cancelPopAwayRequest() {
				if(this.popStatus.popAwayReqTimeHander) {
					clearTimeout(this.popStatus.popAwayReqTimeHander)
					this.popStatus.popAwayReqTimeHander = null
				}
			},

			/* pop out/in functionalities */
			// execute appearing
			doPopUp() {
				this._doPop(true)
			},

			// acutually popping out
			doPopAway() {
				this._doPop(false)
			},

			// @param
			//  tryPopUp : must be boolean!
			//  					 true means do a pop-up, false mean popping away
			_doPop(tryPopUp) {
				this.popStatus.popping = true

				this.popStatus.poppedUp = tryPopUp
				let animCssName = tryPopUp ? 'fadeout-left' : 'fadeout-right'
				this.className = `pop-company-block pf ${animCssName}`

				clearTimeout(this.popStatus.timeHander)
				this.popStatus.timeHander = setTimeout(()=> {
					this.popStatus.popping = false
				}, 500)
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
			},
			popDelete() {
				this.className = 'pop-company-block pf fadeout-right'
				this.$emit('removeEntLayer')
			},
			addEnterPoi(index) {
				var geom = this.enterprise[index]
				var zoomLevel = this.getZoomLevel()
				this.showMapSpot = false
				this.$emit('addEnterPoi', {geom, zoomLevel})
			},
			getZoomLevel() {
				var zoomLevel = 15
				switch(this.curRange) {
					case "500":
					case "1000":
					case "2000":
						zoomLevel = 15
						break
					case "5000":
						zoomLevel = 12
						break
					case "20000":
						zoomLevel = 11
						break
					default: 
						zoomLevel = 11
						break
				}
				return zoomLevel
			}
		},
		watch: {
			gridData: function(){
				this.showMapSpot = true;
				this.getEnterprises()
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
@import '../../../assets/style/reset';
.map-spot {
	width: 288px;
	height: 160px;
	border-radius: 4px;
	background: #fff;
	.mixin-boxshadow();
	
	.pop-cleck-detail {
		.color-red {
			color: #f15553;
		}
		td {
			text-align: center;
			&:first-child {
				text-align: left;
				padding-left: 20px;
			}
		}
		thead {
			tr {
				background: #f3f9eb;
				border: 1px solid #dcdcdc;
				.mixin-height(36px);
				td {
					font-weight: bold;	
				}
			}
		}
		tbody {
			tr:nth-child(2n) {
				background: #fafafa;
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
		font-size: 14px;
		padding: 0 12px;
		font-weight: bold;
		.mixin-height(34px);
		i {
			right: 12px;
			top: 10px;
			cursor: pointer;
			color: #8e8e8e;
			&:hover {
				color: #367f05;
			}
		}
	}
	.check-company {
		border-top: 1px solid #dcdcdc;
		background: #fff;
		.mixin-height(33px);
		.check-company-detail:after {
			position: absolute;
			right: 0;
			width: 1px;
			height: 24px;
			vertical-align: middle;
			content: '';
			margin-top: 4px;
			display: inline-block;
			background: #dcdcdc;
		}
		span {
			display: inline-block;
			color: #408602;
			cursor: pointer;
			.mixin-width(144px);
			&:hover {
				color: #8ad573;
				background: #f6f5f5;
			}
		}
	}
}
.pop-company-block {
	right: -540px;
	bottom: 54px;
	z-index: 3;
	width: 545px;
    padding: 0 0 45px 0;
	background: #fff;
	border-radius: 4px;
	.mixin-boxshadow();
	.lock-popup {
		cursor: pointer;
		color: #a9a8a8;
	    position: absolute;
	    right: 42px;
	    top: 14px;
	    &:hover {
	    	color: #367f05;
	    }
	}

	.color-red {
		color: #f15553;
		margin: 0 4px;
		font-size: 16px;
	}
	.pop-delete {
		top: 16px;
		right: 14px;
	}
	.pop-site {
		font-size: 14px;
		margin: 16px 0 0 12px;
		font-weight: bold;
	}
	ul {
		width: 610px;
		margin: 12px 0 0px 12px;
		overflow: hidden;
		li {
			float: left;
			margin: 0 20px 12px 0;
			color: #f15553;
			background: #e2f0d0;
			.mixin-border(#c0df8a;4px);
			.mixin-height(28px);
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
		padding-left: 12px;
		border-top: 2px solid #e5e5e5;
		h3 {
			font-size: 14px;
			line-height: 45px;
		}
		p {
			margin-right: 12px;
			margin-top: 8px;
			select {
				height: 28px;
				background: #f4fcfc;
			}
		}
	}
	.company-range-table {
		width: 518px;
		margin: 0 auto;
		.mixin-border(#bcc4c9;4px);
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
				height: 166px;
				overflow-y: auto;
				overflow-x: hidden;
				width: 100%;
				tr:nth-child(2n) {
					background: #e5f5fd;
				}
			}
			tr {
				th {
					border-bottom: 1px solid #bcc4c9;
					background: #e5f5fd;
					.mixin-height(36px);
				}
				.check-site {
					cursor: pointer;
					font-size: 18px;
					color: #54a9fc;
			    width: 80px;
    			margin-left: 43px;
				}
				td {
					padding-left: 14px;
					.mixin-height(26px);
				}
				.soil-place {
					span {
						padding-left: 15px;
						display: none;
						.mixin-height(28px);
						.mixin-animation-function();
						.mixin-animation-duration();
					}

					&:hover {
						i {
							display: none;
						}
						span {
							display: block;
						}
					}
				}
			}
		}
	}
	.down-data {
		right: 12px;
		bottom: 6px;
		width: 112px;
		background: #8ec51f;
		color: #fff;
		border-radius: 4px;
		cursor: pointer;
		.mixin-height(28px);
		b {
			margin: 0 4px 0 12px;
		}
		&:hover {
			background: #7cb406;
		}
	}
}
.fadeout-left {
	.mixin-animation(soiltoleft;.6s;1;forwards)
}
@keyframes soiltoleft {
	0% {
		right: -540px;
	}
	100% {
		right: 0px;
	}
}
.fadeout-right {
	.mixin-animation(soiltoright;.6s;1;forwards)
}
@keyframes soiltoright {
	0% {
		right: 0px;
	}
	100% {
		right: -540px;
	}
}
</style>