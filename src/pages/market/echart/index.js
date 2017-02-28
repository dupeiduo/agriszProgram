export default {
	lineChart: function(xAxis, yAxis, maxPrice, cropName) {
		var option = {
			title: {
				text: '全国' + cropName + '价格走势',
				left: 'center',
				top: '10px'
			},
			color: ['#00b9ff'],
			tooltip: {
				trigger: 'axis',
				backgroundColor: '#f7f6f6',
				borderColor: '#61d4fb',
				borderWidth: 1,
				axisPointer: {
					type: 'shadow',
				},
				textStyle: {
					color: '#000',
				},
				formatter: '{b}<br/>{a} : {c}（元/kg）'
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: xAxis,
				axisTick: {
					alignWithLabel: true
				}
			}],
			yAxis: [{
				type: 'value',
				min: 0,
				max: maxPrice
			}],
			series: [{
				name: cropName + '单价',
				type: 'line',
				data: yAxis,
				symbol: 'circle',
				showAllSymbol: true,
				markArea: {
					silent: true,
					itemStyle: {
						normal: {
							color: '#eef6fa',
							opacity: 0.8
						}
					},
					data: this.lineDifColor(xAxis)
				}
			}]
		}
		return option
	},
	barChart(xAxis, yAxis, cropName) {
		var option = {
	      color: ['#61d4fb'],
	      title: {
	        text: '全国'+ cropName +'各省价格分布',
	        left: 'center',
	        top: '10px'
	    },
	      tooltip : {
	        trigger: 'axis',
	        backgroundColor:'#f7f6f6',
	        borderColor: '#61d4fb',
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
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	      },
	      xAxis : [
	      {
	        type : 'category',
	        data : xAxis,
	        axisTick: {
	          alignWithLabel: true
	        }
	      }
	      ],
	      yAxis : [
	      {
	        type : 'value',
	        boundaryGap: ['0', '30%']
	      }
	      ],
	      series : [
	      {
	        name: cropName +'单价',
	        type:'bar',
	        barWidth: '30%',
	        data: yAxis
	      }
	      ]
	    }
	    return option
	},
	detailChart(xAxis, yAxis, startDate, endDate, maxPrice, cropName) {
		var option = {
			title: {
				text: cropName + '价格走势（' + startDate + ' ~ ' + endDate + ')',
				left: 'center',
				top: '10px'
			},
			color: ['#61d4fb'],
			tooltip: {
				trigger: 'axis',
				backgroundColor: '#f7f6f6',
				borderColor: '#61d4fb',
				borderWidth: 1,
				axisPointer: {
					type: 'shadow',
				},
				textStyle: {
					color: '#000',
				},
				formatter: '{b}<br/>{a} : {c}（元/kg）'
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [{
				type: 'category',
				data: xAxis,
				axisTick: {
					alignWithLabel: true
				}
			}],
			yAxis: [{
				type: 'value',
				min: 0,
				max: maxPrice
			}],
			series: [{
				name: cropName + '单价',
				type: 'line',
				barWidth: '80%',
				data: yAxis,
				symbol: 'circle',
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