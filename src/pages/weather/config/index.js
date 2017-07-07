export default {
  menu: [
    {
      name: "气温",
      icon: "icon-qiwen",
      color: "rgb(165, 194, 94)",
      atomos_index: "TEM",
      child: [
        {
          key: "TMP_Tenday_Mean",
          name: "旬气温平均值",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 1
        },
        {
          key: "TMP_Tenday_Max",
          name: "旬气温最大值",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 1
        },
        {
          key: "TMP_Tenday_Min",
          name: "旬气温最小值",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 1
        },
        {
          key: "TMP_Year_Tenday_Mean_5",
          name: "旬气温平均值(5年)",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 2
        },
        {
          key: "TMP_Year_Tenday_Mean_10",
          name: "旬气温平均值(10年)",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 3
        },
        {
          key: "TMP_Year_Tenday_Max_5",
          name: "旬气温最大值(5年)",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 2
        },
        {
          key: "TMP_Year_Tenday_Max_10",
          name: "旬气温最大值(10年)",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 3
        },
        {
          key: "TMP_Year_Tenday_Min_5",
          name: "旬气温最小值(5年)",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 2
        },
        {
          key: "TMP_Year_Tenday_Min_10",
          name: "旬气温最小值(10年)",
          date_tag: "tenday",
          styles: "atmos_tem",
          group: 3
        },
        {
          key: "TMP_Year_Tenday_Anomaly_5",
          name: "旬气温距平值(5年)",
          date_tag: "tenday",
          styles: "atmos_tem_an",
          group: 4
        },
        {
          key: "TMP_Year_Tenday_Anomaly_10",
          name: "旬气温距平值(10年)",
          date_tag: "tenday",
          styles: "atmos_tem_an",
          group: 4
        }
      ]
    },
    {
      name: "降水",
      icon: "icon-jiangshui-",
      color: "rgb(10, 147, 212)",
      atomos_index: "PRE",
      child: [
        {
          key: "PRE_Tenday_Sum",
          name: "旬累计降水量",
          date_tag: "tenday",
          styles: "atmos_pre_acc",
          group: 1
        },
        {
          key: "PRE_Year_Tenday_Avg_5",
          name: "旬平均降水量(5年)",
          date_tag: "tenday",
          styles: "atmos_pre",
          group: 2
        },
        {
          key: "PRE_Year_Tenday_Avg_10",
          name: "旬平均降水量(10年)",
          date_tag: "tenday",
          styles: "atmos_pre",
          group: 2
        },
        {
          key: "PRE_Year_Tenday_Anomaly_5",
          name: "旬降水量距平值(5年)",
          date_tag: "tenday",
          styles: "atmos_pre_an",
          group: 3
        },
        {
          key: "PRE_Year_Tenday_Anomaly_10",
          name: "旬降水量距平值(10年)",
          date_tag: "tenday",
          styles: "atmos_pre_an",
          group: 3
        },
        {
          key: "PRE_Year_Tenday_Anomaly_Percent_5",
          name: "旬降水量距平百分率(5年)",
          date_tag: "tenday",
          styles: "atmos_pre_anp",
          group: 4
        },
        {
          key: "PRE_Year_Tenday_Anomaly_Percent_10",
          name: "旬降水量距平百分率(10年)",
          date_tag: "tenday",
          styles: "atmos_pre_anp",
          group: 4
        }
      ]
    },
    {
      name: "积温",
      icon: "icon-jiwen-",
      color: "rgb(229, 162, 0)",
      child: [
        {
          key: "TMP_Activity_Mean_Sum_10",
          name: "活动积温 (10℃)",
          date_tag: "day",
          styles: "atmos_tem_acc",
          group: 1
        },
        {
          key: "TMP_Activity_Mean_Sum_15",
          name: "活动积温 (15℃)",
          date_tag: "day",
          styles: "atmos_tem_acc",
          group: 1
        },
        {
          key: "TMP_Valid_Mean_Sum_10",
          name: "有效积温(10℃)",
          date_tag: "day",
          styles: "atmos_tem_acc",
          group: 2
        },
        {
          key: "TMP_Valid_Mean_Sum_15",
          name: "有效积温(15℃)",
          date_tag: "day",
          styles: "atmos_tem_acc",
          group: 2
        },
      ]
    }
  ],
  atmos_tem: [
    {
      "name": "50℃以上",
      "color": "#FF0000",
      "value": "50"
    },
    {
      "name": "25℃ ~ 50℃",
      "color": "#FF4600",
      "value": "40"
    },
    {
      "name": "15℃ ~ 25℃",
      "color": "#FFa000",
      "value": "20"
    },
    {
      "name": "0℃ ~ 15℃",
      "color": "#3eff00",
      "value": "10"
    },
    {
      "name": "0℃ ~ -25℃",
      "color": "#00fff4",
      "value": "0"
    },
    {
      "name": "-25℃ ~ -50℃",
      "color": "#00a4ff",
      "value": "-20"
    },
    {
      "name": "-50℃以下",
      "color": "#0500ff",
      "value": "-50"
    }
  ],
  atmos_tem_acc: [
    {
      "name": "15000℃以上",
      "color": "#FF0000",
      "value": "50"
    },
    {
      "name": "12000℃~15000℃",
      "color": "#FF4600",
      "value": "12000"
    },
    {
      "name": "6000℃~12000℃",
      "color": "#FFa000",
      "value": "6000"
    },
    {
      "name": "3000℃~6000℃",
      "color": "#3eff00",
      "value": "3000"
    },
    {
      "name": "0℃ ~ 3000℃",
      "color": "#00fff4",
      "value": "0"
    },
  ],
  atmos_pre: [
    {
      "name": "400mm及以上",
      "color": "#88003f",
      "value": "400"
    },
    {
      "name": "250mm ~ 400mm",
      "color": "#ff00ff",
      "value": "250"
    },{
      "name": "100mm ~ 250mm",
      "color": "#3d00ff",
      "value": "100"
    },{
      "name": "50mm ~ 100mm",
      "color": "#3eb9fc",
      "value": "50"
    },{
      "name": "25mm ~ 50mm",
      "color": "#00c624",
      "value": "25"
    },{
      "name": "10mm ~ 25mm",
      "color": "#85fd83",
      "value": "10"
    },{
      "name": "0 ~ 10mm",
      "color": "#ffffff",
      "value": "0.1"
    }
  ],
  atmos_pre_acc: [
    {
      "name": "1200mm及以上",
      "color": "#88003f",
      "value": "1200"
    },
    {
      "name": "750mm ~ 1200mm",
      "color": "#ff00ff",
      "value": "750"
    },{
      "name": "300mm ~ 750mm",
      "color": "#3d00ff",
      "value": "300"
    },{
      "name": "150mm ~ 300mm",
      "color": "#3eb9fc",
      "value": "150"
    },{
      "name": "75mm ~ 150mm",
      "color": "#00c624",
      "value": "75"
    },{
      "name": "30mm ~ 75mm",
      "color": "#85fd83",
      "value": "30"
    },{
      "name": "0 ~ 30mm",
      "color": "#ffffff",
      "value": "1"
    }
  ],
  atmos_pre_an: [
    {
      "name": "+200mm以上",
      "color": "#0b007b",
      "value": "200"
    },
    {
      "name": "+100mm ~ +200mm",
      "color": "#2f0ee1",
      "value": "100~200"
    },
    {
      "name": "+50mm ~ +100mm",
      "color": "#2b1efb",
      "value": "50~100"
    },
    {
      "name": "+20mm ~ +50mm",
      "color": "#088bd6",
      "value": "20~50"
    },
    {
      "name": "±0 ~ +20mm",
      "color": "#56f3ff",
      "value": "0~20"
    },
    {
      "name": "±0",
      "color": "#ffffff",
      "value": "0"
    },
    {
      "name": "-20mm ~ ±0",
      "color": "#ffd890",
      "value": "-20~0"
    },
    {
      "name": "-50mm ~ -20mm",
      "color": "#fb9523",
      "value": "-50~-20"
    },
    {
      "name": "-100mm ~ -50mm",
      "color": "#f33900",
      "value": "-100~-50"
    },
    {
      "name": "-100mm ~ -200mm",
      "color": "#f60000",
      "value": "-100~-200"
    },
    {
      "name": "-200mm以下",
      "color": "#ff0000",
      "value": "-200"
    }
  ],
  atmos_tem_an: [
    {
      "name": "+20℃以上",
      "color": "#ff0000",
      "value": "20"
    },
    {
      "name": "+10℃ ~ +20℃",
      "color": "#f60000",
      "value": "15"
    },
    {
      "name": "+5℃ ~ +10℃",
      "color": "#f33900",
      "value": "10"
    },
    {
      "name": "+2℃ ~ +5℃",
      "color": "#fb9523",
      "value": "5"
    },
    {
      "name": "±0 ~ +2℃",
      "color": "#ffd890",
      "value": "5"
    },
    {
      "name": "±0",
      "color": "#ffffff",
      "value": "0"
    },
    {
      "name": "-2℃ ~ ±0",
      "color": "#56f3ff",
      "value": "-5"
    },
    {
      "name": "-5℃ ~ -2℃",
      "color": "#088bd6",
      "value": "-10℃"
    },
    {
      "name": "-10℃ ~ -5℃",
      "color": "#2b1efb",
      "value": "-15"
    },
    {
      "name": "-20℃ ~ -10℃",
      "color": "#2f0ee1",
      "value": "-20"
    },
    {
      "name": "-20℃以下",
      "color": "#0b007b",
      "value": "-20"
    }
  ],
  atmos_pre_anp: [
    {
      "name": "+200%以上",
      "color": "#0b007b",
      "value": "200"
    },
    {
      "name": "+100% ~ 200%",
      "color": "#2f0ee1",
      "value": "100~200"
    },
    {
      "name": "+50% ~ +100%",
      "color": "#2b1efb",
      "value": "50~100"
    },
    {
      "name": "+20% ~ +50%",
      "color": "#088bd6",
      "value": "20~50"
    },
    {
      "name": "±0 ~ +20%",
      "color": "#56f3ff",
      "value": "0~20"
    },
    {
      "name": "±0",
      "color": "#ffffff",
      "value": "0"
    },
    {
      "name": "-20% ~ ±0",
      "color": "#ffd890",
      "value": "-20~0"
    },
    {
      "name": "-50% ~ -20%",
      "color": "#fb9523",
      "value": "-50~-20"
    },
    {
      "name": "-100% ~ -50%",
      "color": "#f33900",
      "value": "-100~-50"
    },
    {
      "name": "-100% ~ -200%",
      "color": "#f60000",
      "value": "-100~-200"
    },
    {
      "name": "-200%以下",
      "color": "#ff0000",
      "value": "-200"
    }
  ],
}
