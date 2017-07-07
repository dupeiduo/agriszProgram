export default {
  defaultCode: 451229,
  droughtKey: "TCI",
  growthKey: "NDVI",
  surId: "59378dff330c58486ab94d1d",
  elementId: "10",
  weatherMenu: [
    {
      name: "降水",
      icon: "icon-jiangshui-",
      color: "rgb(10, 147, 212)",
      atomos_index: "PRE",
      key: "PRE_Tenday_Sum",
      date_tag: "tenday",
      styles: "atmos_pre_acc"
    },
    {
      name: "积温",
      icon: "icon-jiwen-",
      color: "rgb(229, 162, 0)",
      key: "TMP_Activity_Mean_Sum_10",
      date_tag: "day",
      styles: "atmos_tem_acc"
    },
    {
      name: "气温",
      icon: "icon-qiwen",
      color: "rgb(165, 194, 94)",
      atomos_index: "TEM",
      key: "TMP_Tenday_Mean",
      date_tag: "tenday",
      styles: "atmos_tem"
    },
  ],
  fetchRootCode() {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({data: this.defaultCode})
      })
    })
    return promise
  },
  fetchSurId() {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({data: this.surId})
      })
    })
    return promise
  },
  fetchElementId() {
    var promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({data: this.elementId})
      })
    })
    return promise
  }
}