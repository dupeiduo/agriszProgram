export default {
	lineChart: function(xAxis, yAxis, maxPrice, cropName, minPrice) {
		var option = {
			title: {
				left: '25px',
				top: '10px',
				bottom: '14px',
				textStyle: {
					fontSize: 16,
					fontWeight: 'normal',
					fontStyle: 'normal',
					color: '#232323'
				}
			},
			color: ['#6887da'],
			backgroundColor: '#fafafa',
			tooltip: {
				trigger: 'axis',
				backgroundColor: '#fafafa',
				borderColor: '#6887da',
				borderWidth: 1,
				textStyle: {
					color: '#000',
				},
				formatter: '{b}<br/>{a} : {c}（元/kg）'
			},
			grid: {
				show: false,
				left: '3%',
				right: '4%',
				bottom: '10%',
				containLabel: true,
				borderWidth: 1,
				borderColor: '#ccc',
			},
			xAxis: [{
				type: 'category',
				data: xAxis,
				axisTick: {
					alignWithLabel: true,
					show: true
				}
			}],
			yAxis: [{
				type: 'value',
				min: (minPrice - maxPrice * 0.15).toFixed(1),
				max: (maxPrice + maxPrice * 0.15).toFixed(1),
				name: '(元/公斤)',
				splitLine: {
					show: false
				},
				// boundaryGap: ['8%', '8%']
			}],
			series: [{
				name: cropName + '单价',
				type: 'line',
				data: yAxis,
				symbol: 'circle',
				showAllSymbol: true,
				markPoint: {
					data: [
						{type: 'max', name: '最大值',
						 itemStyle: {
						 	normal: {
						 		color: '#e96678'
						 	}
						 }
						},
						{
							type: 'min', name: '最小值',
							symbolRotate: 180,
							label: {
								normal: {
									show: true,
									position: 'inside',
									offset: [0, 10],
									textStyle: {
										color: '#fff'
									}
								}
							},
							itemStyle: {
								normal: {
									color: '#6cbe7e'
								}
							},
						},
					],
					itemStyle: {
						normal: {
							color: 'rgba(0,0,0,.5)'
						}
					}
				},
				markLine: {
					data: [
						{type: 'average', name: '平均值'}
					],
					lineStyle: {
						normal: {
							color: '#a0a0a0'
						}
					}
				}
			}],
			dataZoom: [{ 
		        type: 'slider', 
		        start: 80,
		        end: 100
		    }]
		}
		return option
	},
	barChart(xAxis, yAxis, cropName) {
		var option = {
			color: ['#6887da'],
			backgroundColor: '#fafafa',
			title: {
				left: 'center',
				top: '10px'
			},
			tooltip : {
				trigger: 'axis',
				backgroundColor:'#fafafa',
				borderColor: '#6887da',
				borderWidth: 1,
				axisPointer : { 
					type : 'shadow',
				},
				textStyle: {
					color:'#000',
				},
				formatter:'{b}<br/>{a} : {c}（元/kg）'
			},
			grid: {
				left: '4%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis : [{
				type : 'category',
				data : xAxis,
				axisTick: {
					alignWithLabel: true
				}
			}],
			yAxis : [{
				name: '(元/公斤)',
				type : 'value',
				boundaryGap: ['0', '30%']
			}],
			series : [{
				name: cropName +'单价',
				type:'bar',
				barWidth: '30%',
				data: yAxis,
				label: {
					normal: {
						show: true,
						position: 'top',
						textStyle: {
							color: '#000'
						}
					}
				}
			}]
		}
	    return option
	},
	detailChart(xAxis, yAxis, startDate, endDate, maxPrice, cropName, minPrice) {
		var option = {
			title: {
				text: cropName + '价格走势折线图',
				left: 'center',
				top: '10px'
			},
			color: ['#6887da'],
			tooltip: {
				trigger: 'axis',
				backgroundColor: '#fafafa',
				borderColor: '#6887da',
				borderWidth: 1,
				textStyle: {
					color: '#000',
				},
				formatter: '{b}<br/>{a} : {c}（元/kg）'
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '15%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: xAxis,
				axisTick: {
					alignWithLabel: true
				},
			}],
			yAxis: [{
				type: 'value',
				min: (minPrice - maxPrice * 0.15).toFixed(1),
				max: (maxPrice + maxPrice * 0.15).toFixed(1),
				name: '(元/公斤)',
				splitLine: {
					show: false
				}
			}],
			series: [{
				name: cropName + '单价',
				type: 'line',
				barWidth: '80%',
				data: yAxis,
				symbol: 'circle',
				markPoint: {
					data: [
						{type: 'max', name: '最大值',
						itemStyle: {
						 	normal: {
						 		color: '#e96678'
						 	}
						 }
						},
						{
							type: 'min', name: '最小值',
							symbolRotate: 180,
							itemStyle: {
						 	normal: {
						 		color: '#6cbe7e'
						 		}
						 	},
							label: {
								normal: {
									show: true,
									position: 'inside',
									textStyle: {
										color: '#fff'
									},
									offset: [0, 10]
								}
							}
						}
					],
					itemStyle: {
						normal: {
							color: 'rgba(0,0,0,.5)'
						}
					}
				},
				markLine: {
					data: [
						{type: 'average', name: '平均值'}
					],
					lineStyle: {
						normal: {
							color: '#a0a0a0'
						}
					}
				}
			}],
			dataZoom: [{ 
		        type: 'slider', 
		        start: 80,
		        end: 100
		    }]
		}
		return option
	},
	lineDifColor: function(xAxis){
			var lineYearColor = [];
			var start = xAxis[0].substr(0, 4);
			var end = xAxis[xAxis.length - 1].substr(0, 4);
			var currentYear = parseInt(xAxis[0].substr(0, 4));
			for (var i = 0; i <= (end - start); i++) {
				var current = currentYear + '-01-01';
				var next = currentYear + 1 + '-01-01';
				if (currentYear + 1 <= end) {
					next = this.getItem(xAxis, next, currentYear + 1);
					current = this.getItem(xAxis, current, currentYear);
				} else {
					next = xAxis[xAxis.length - 1];
					current = this.getItem(xAxis, current, currentYear);
				}
				if (i == 0) {
					current = currentYear + xAxis[i].substr(4);
					var arr = [{
						xAxis: current
					}, {
						xAxis: next
					}];
					lineYearColor.push(arr);
				} else if (i % 2 == 0) {
					var arr = [{
						xAxis: current
					}, {
						xAxis: next
					}];
					lineYearColor.push(arr);
				}
				currentYear += 1;
			}
			return lineYearColor;
	},
	getItem(xAxis, item, currentYear) {
		if (xAxis.indexOf(item) >= 0) {
			return item;
		} else {
			for (var i = 0; i < xAxis.length; i++) {
				if (xAxis[i].indexOf(currentYear) >= 0) {
					return xAxis[i];
				}
			}
		}
	}
}