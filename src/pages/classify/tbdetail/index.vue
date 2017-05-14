<template>
  <div class="crop-detail">
    
    <div class="tb-detail">
      <el-table v-if="tableData.length > 0"
        :stripe="true"
        :data="tableData"
        style="width: 100%">
        <el-table-column label="作物" width="78">
          <template  scope="scope">
            <span class="iconfont crop-icon" :class="icons[scope.row.id]"></span>
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="area"
          label="种植面积"
          width="135">
        </el-table-column>
        <el-table-column label="显示" width="72">
          <template  scope="scope">
            <span class="eye-ctl iconfont" :class="scope.row.open ? ' icon-eye' : ' icon-hide'"
              @click="setLayerVisible(scope.row)"></span>
              <i class="animated fadeInRight fade-animation hide-animation"  @click="setLayerVisible(scope.row)">{{scope.row.open ? '隐藏图层' : '显示图层'}}</i>
          </template>
        </el-table-column>
        <el-table-column label="图例" width="76">
          <template  scope="scope">
            <span class="selcolor"
              :style="{background: scope.row.color}"
              @mouseout="removeColorPicker"
              @mouseenter="changeColor($event, scope.$index)"></span>
          </template>
        </el-table-column>
      </el-table>
      
      <h3 class="no-data" v-else-if="tableData.length == 0 && !loading" >－暂无数据－</h3>
    </div>
    

    <el-select class="hm-selector"
      popper-class="select-dropdown"
      size="small"
      v-if="tableData.length > 0"
      v-model="value"
      @change="changeUnit">
      <el-option
        v-for="item in areaOption"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>


    <div class="color-picker" v-if="showColorpicker"
      @mouseleave="removeColorPicker"
      @mouseenter="holdColorPicker" 
      :style="{top: popTop}">
      <div class="wrap">
        <p class="triangle"></p>
        <h3>自定义作物颜色</h3>
        <div class="clear">
          <span  v-for="(item, index) in layerSld.normal" 
            :style="{background: item}"
            @click="changeCropColor($event, item)">
            <i class="iconfont icon-ok"
              v-if="cropIndex >= 0 && tableData[cropIndex].color == item"></i>
            <em class="classification-all-height"></em>
          </span>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import configData from '../../../config/data.js'

export default {
  props: {
    tableData: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false
    },
    layerSld: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      cropIndex: -1,

      areaOption: [{
        value: 'm',
        label: '万亩'
      }, {
        value: 'h',
        label: '千公顷'
      }],
      icons: configData.cropIcons,

      showColorpicker: false,
      popTop: '',

      timeHandler: null,

      value: 'm',
    }
  },
  methods: {
    changeColor(ev, index) {
      this.holdColorPicker()

      var oEvent = ev|| window.event;
      var y = oEvent.clientY - 298
      this.popTop = `${y}px`
      this.showColorpicker = true
      this.cropIndex = index
    },
    removeColorPicker() {
      this.timeHandler = setTimeout(()=> {
        this.timeHandler = null
        this.showColorpicker = false
      }, 300)
    },
    holdColorPicker() {
      if (this.timeHandler) {
        clearTimeout(this.timeHandler)
      }
    },
    setLayerVisible(row) {
      var open = !row.open
      var id = row.id
      var name = row.name

      this.$emit('setLayerVisible', {id, open, name})
    },
    changeCropColor(e, color) {
      var id = this.tableData[this.cropIndex].id
      this.$emit('setLayerColor', {id, color})
    },
    changeUnit(value) {
      this.$emit('changeUnit', value)
    }
  },
  components: {

  }
}

</script>

<style lang="less" scoped>
@import '../../../assets/style/reset';
  .crop-detail {
    .tb-detail {
      background: #fff;
      table {
        width: 100%;
        padding-left: 5px;
        tr {
          height: 34px;
          text-align: center;
          color: #484848;
          font-size: 12px;
          td:nth-child(1) {
            text-align: center !important;
          }
        }
      }
      .no-data {
        text-align: center;
      }
    }
  }
  .selcolor {
    left: 0px;
    position: relative;
    display: inline-block;
    width:  10px;
    height: 10px;
  }
  
  .eye-ctl {
    position: relative;
    cursor: pointer;
    left: 0px;
    font-size: 14px;
    color: #8bbcf9;
  }
  .cell .icon-hide {
    color: #a1a8ae;
  }
  .color-picker {
    position: absolute;
    left: 370px;
    border: 1px solid #d3d3d3;
    background: #fff;
    box-shadow: 2px 1px 8px #8a8a89;
    padding-left: 8px;
    .wrap {
      position: relative;
      width: 157px;

      span {
        line-height: 20px;
        position: relative;
        display: block;
        float: left;
        width: 30px;
        height: 20px;
        margin-bottom: 5px;
        text-align: center;

        i {
          display: inline;
          color: #fff;
        }
        em {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: rgba(255,255,255,.4);
        }
      }
    }
    .triangle {
      position: absolute;
      top: 14px;
      left: -28px;
      width: 20px;
      height: 20px;
      background: url(/static/assets/img/common/class-triangle.png) no-repeat;
    }
    h3 {
      font-size: 14px;
      font-weight: normal;
      line-height: 26px;
      text-align: left;
      color: #474747;
    }
  }
  .hm-selector {
    position: absolute;
    top: 7px;
    width: 72px;
    left: 142px;
  }
</style>