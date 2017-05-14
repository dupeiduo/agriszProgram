<template>
  <div class="ndvi-datesel">
    <span class="date-desc no-select">选择日期</span>
    
    <div class="date-sel slider-container ndvi-slider" v-if="step != 0">
      <el-tooltip class="item" effect="dark" :content="tipContent" placement="top">
        <el-slider
          v-model="slider"
          :show-tooltip="false"
          :step="step"
          @change="changeDate">
        </el-slider>
      </el-tooltip>
        
    </div>

    <span class="cur-date fr no-select" 
      @click="toggleTree">
      {{dateStr}}
    </span>
    <el-tree class="tree" 
      v-if="showTree && dateTree.length > 0"
      :data="dateTree" 
      :props="defaultProps" 
      @node-click="treeNodeClick">
    </el-tree>
  </div>
</template>

<script>

import {dateUtil} from 'plugins/utils.js'
export default {
  props: {
    dateArray: {
      type: Array,
      default: []
    },
    curDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dateTree: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      dateStr: '',
      showTree: false,
      opacity: 90,
      slider: 100,
      sliderData: [],
      step: 0,
      tipContent: '',
    }
  },
  created() {
  },
  methods: {
    initTree(arr) {
      this.sliderData = []
      for (var i = arr.length - 1; i >= 0; i--) {
        var dateStr = arr[i].date.split(' ')[0].toString(),
          year = dateStr.substr(0, 4),
          month = dateStr.substr(5),
          value = arr[i].date

        var exist = false
        for (var m = 0; m < this.dateTree.length; m++) {
          this.dateTree[m].child = this.dateTree[m].child ? this.dateTree[m].child : []
          if (this.dateTree[m].name === year) {
            this.dateTree[m].child.push({name: month, value})
            exist = true
            break
          } 
        }
        if (!exist) {
          var item = {
            name: year,
            child: [{name: month, value}]
          }
          this.dateTree.push(item)
        }
        this.sliderData.push(dateStr.replaceAll('-', '/'))
      }
      this.step = 100 / (arr.length - 1)
    },
    change() {
      var _date = new Date()
      this.$emit('changeDate', _date)
    },
    treeNodeClick(data) {
      if (data.value) {
        this.showTree = false
        this.dateStr = data.value.split(' ')[0].replaceAll('-', '/')
        this.$emit('changeDate', data.value)
        this.setSlider(data.value)
      }
    },
    toggleTree() {
      this.showTree = !this.showTree
    },
    changeDate(value) {
      var index = (this.sliderData.length - 1) - Math.round(value / this.step)
      this.$emit('changeDate', this.sliderData[index].replaceAll('/', '-'))
    },
    setSlider(date) {
      for (var i = 0; i < this.dateArray.length; i++) {
        if (this.dateArray[i].date === date) {
          this.slider = this.step * i
          break
        }
      }
      
    }
  },
  watch: {
    dateArray (arr) {
      if (arr.length > 0) {
        this.initTree(arr)
        this.tipContent = this.dateStr = arr[arr.length - 1].date.split(' ')[0].replaceAll('-', '/')
      }
    },
    curDate(dateStr) {
      this.setSlider(dateStr)
      this.tipContent = this.dateStr = dateStr.split(' ')[0].replaceAll('-', '/')
    }
  }
}
</script>

<style lang="less" scoped>

.ndvi-datesel {
  width: 100%;

  .date-desc {
    position: relative;
    left: 20px;
    top: 12px;
  }

  .date-sel {
    position: absolute;
    width: 170px;
    top: 105px;
    left: 90px;
  }

  .cur-date {
    line-height: 20px;
    border: 1px solid #bababa;
    width: 68px;
    text-align: center;
    margin: 18px 14px 0 0;
    border-radius: 2px;
  }
  .tree {
    width: 90px;
    right: 4px;
  }
}

</style>