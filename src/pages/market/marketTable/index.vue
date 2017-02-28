<template>
  <div class="market-table-wrap">
  	<table class="market-table market-change">
  		<tbody>
  			<tr v-for="(item,index) in tableData" @click="changeEchart(index)">
  				<td class="market-td-bg" width="20%">
  					<p class="market-big-title">{{item.market_name}}</p>
  				</td>
  				<td width="15%">
  					<h3 class="font14">{{item.farm_product_name}}</h3>
  				</td>
  				<td width="25%">
  					<h3 class="market-table-price">最新价格<i><b>{{item.price}}</b>元/kg</i></h3>
  				</td>
  				<td width="40%" class="market-table-compare">
  					<h3>相比于{{item.rateFlag}}
  						<span class="market-compare">
  							<i :class="item.color" class="font24">{{item.delta}}</i>
  							<i class="rate-unit" :class="item.color">元/kg</i>
  							<span id="priceIcon" class="iconfont" :class="item.image"></span>
  							<span class="change-percent" :class="item.color">{{item.desc}}</span>
  						</span>
  					</h3>
  				</td>
  				<td class="market-check-detail">
  					<a href="javascript:void(0);">查看详情</a>
  				</td>
			</tr>
		</tbody>
	</table>
	<div class="none-data" v-show="tableData.length == 0">-暂无数据-</div>
  </div>
</template>

<script>
  export default{
  	props: {
  		tableData: {
  			type: Array,
  			default: []
  		},
  		changeEchart: {
  			type: Function
  		}
  	},
    data(){
      return {
      }
    },
    computed: {

    },
    methods: {
    },
    components: {
    }
  }
</script>
<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  .market-table-wrap {
  	width: 100%;
  	margin-top: 15px;
  	overflow: hidden;
    border-radius: 4px;
    	.market-table {
		    width: 100%;
		    	tr {
				    position: relative;
				    cursor: pointer;
				    border: 1px solid #d7d7d7;
				    	.market-td-bg {
						    padding-right: 20px;
						    padding-left: 20px;
						    text-align: left;
						    background: #f9f7f7;
						    	.market-big-title {
								    font-size: 14px;
								}
						}
						.market-table-compare {
						    text-align: left;
						    padding-left: 60px;
						    	.market-compare {
								    margin-left: 10px;
								    	.market-green {
										    color: #6cbe7e;
										    	.rate-unit {
												    font-size: 12px;
												}
										}
										 .market-red {
										 	color: #e96678;
										 }
										 .market-blue {
										 	color: #24b5b0;
										 }
								}
						}
						.market-check-detail {
							position: relative;
						    text-align: right;
						    opacity: 0;
						    	a {
								    position: absolute;
								    top: 0;
								    left: -60px;
								    padding: 2px 6px;
								    background: #c6d698;
								}
						}
						td {
						    height: 74px;
						    text-align: center;
						    .market-table-price {
						    	i {
						    		margin-left: 10px;
    								color: #f7a302;
    									b {
										    font-size: 22px;
										}
						    	}
						    }
						}
				}
				tr:hover {
					position: relative;
				    z-index: 2;
				    background: #e8faec;
				    	.market-check-detail {
						    opacity: 1;
						}
				    	td {
				    		background: #e8faec;
				    	}
				}
		}
  }
</style>