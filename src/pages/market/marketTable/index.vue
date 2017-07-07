<template>
  <div class="market-table-wrap pr">
  	<table class="market-table market-change">
  		<tbody>
  			<tr v-for="(item,index) in tableData" @click="changeEchart(index)">
  				<td width="20%">
  					<p class="market-big-title">{{item.market_name}}</p>
  				</td>
  				<td width="15%">
  					<h3 class="market-table-crop">{{item.farm_product_name}}</h3>
  				</td>
  				<td width="25%">
  					<h3 class="market-table-price">最新价格<i><b>{{item.price}}</b>元/kg</i></h3>
  				</td>
  				<td width="40%" class="market-table-compare">
  					<h3>
              <span class="market-table-compare-content">相比于{{item.rateFlag}}</span>
  						<span class="market-compare">
  							<i :class="item.color" style="font-size:24px">{{item.delta}}</i>
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
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
  export default{
  	props: {
  		tableData: {
  			type: Array,
  			default: []
  		},
  		changeEchart: {
  			type: Function
  		},
  		showNoData: {
  			type: Boolean,
  			default: true
  		}
  	},
    data(){
      return {
      }
    },
    computed: {
    	...mapGetters({
    		menuWidth: 'menuWidth',
    		screenWidth: 'screenWidth',
    		getScreenHeight: 'getScreenHeight'
    	})},
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
@import '../../../assets/style/common';

  .market-table-wrap {
  	width: 100%;
  	min-height: 80px;
  	margin: 14px 0;
  	overflow: hidden;
    border-radius: 4px;
       .none-data {
       	line-height: 30px;
        text-align: center;
       }
    	.market-table {
		    width: 100%;
		    	tr {
				    position: relative;
				    cursor: pointer;
				    border-bottom: 1px dotted #d7d7d7;
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
                .market-table-compare-content {
                  .adv-font-small();
                }
						}
						.market-check-detail {
							position: relative;
						    opacity: 0;
						    	a {
								    position: absolute;
								    top: 0;
								    right: 0px;
								    width: 60px;
								    padding: 6px 10px;
								    background: #9fd233;
								}
						}
						td {
						    height: 74px;
						    text-align: center;
						    .market-table-price {
                  .adv-font-small();
						    	i {
						    		margin-left: 10px;
    								color: #f7a302;
    									b {
										    font-size: 22px;
										}
						    	}
						    }
						    .market-big-title {
                    .adv-text();
						        text-align: left;
						        margin-left: 10%;
						     }
                .market-table-crop {
                    .adv-font-normal();
                }
						}
						&:nth-child(2n) {
							background: #f3f9eb;
						}
				}
				tr:hover {
					position: relative;
				    z-index: 2;
				    background: #eafcd5;
				    	.market-check-detail {
						    opacity: 1;
						}
				    	td {
				    		background: #eafcd5;
				    	}
				}
		}
  }
</style>