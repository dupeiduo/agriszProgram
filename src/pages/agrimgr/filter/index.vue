<template>
  <div>
    <!-- 遮罩层 -->
    <div v-if="show" class="filter-layer-mask"></div>
    
    <div :class="filterSlideAnimation" class="ps filter-detail-border" :style="{'top':filterTop + 'px'}">
      <div class="filter-detail">

      <div class="farm-manager-border">
        <h3>农场管理区</h3>
     
        <div class="filter-tree">
            <tree 
            :treeData="treeFilter"
            :showTree="showTree"
            @getTreeNode="getTreeNode"
            @changeShowTreeStatus="getShowTreeStatus"
            ></tree>
        </div>
      </div>
      
      <div class="filter-child-border">
        <h3>地块面积</h3>
        <el-radio-group v-model="areaModel">
          <el-radio :label="areaOption.value" v-for="areaOption in areaOptions">{{areaOption.label}}</el-radio>
        </el-radio-group>
      </div>
      
      <div class="filter-child-border">
        <h3>健康状况&nbsp;<span class="filter-heath-choose-one" v-if="filterShowHeathChooseOne">请至少选中一项</span></h3>
        <el-checkbox-group v-model="heathFilterModel" @change="heathFilterChange">
          <el-checkbox v-for="heath in heathes" :label="heath">{{heath}}</el-checkbox>
        </el-checkbox-group>
      </div>
     
      <div class="filter-child-border">
        <h3>种植作物&nbsp;<span class="filter-crop-choose-one" v-if="filterShowCropChooseOne">请至少选择一种作物</span></h3>
        <el-checkbox :indeterminate="filterCropIsIndeterminate" v-model="filterCropCheckAll" @change="filterCropCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="cropFilterModel" @change="cropFilterChange">
          <el-checkbox v-for="crop in ownerCrops" :label="crop.crop_id">{{crop.crop_name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      
      <div class="filter-all-btn">
        <span @click="doSlideOutFilter" class="filter-cancle">取消</span><span class="filter-confirm" @click="doFilter" :class="disabledBtn">筛选</span>
      </div>

      </div>

    </div>
   
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import tree from '../../../components/tree'
  const heathesOptions = ['健康','不健康'];
  export default {
    props: {
      show: { //显示整个组件
        type: Boolean,
        default: false
      },
      hideFilterTree: {  // 隐藏树
        type: Boolean,
        default: true
      },
      relationTree: {  // 树数据源，需要转换
        type: Object,
        default: null
      },
      ownerCrops: {  // 作物数据源
        type: Array,
        default: []
      }
    },
    data() {
      return {
        healthyStatus: [],
        filterSlideAnimation:'',
        areaModel:0,
        areaOptions:[{  //value为单选的model 也是数组areaOptions的下标
          label:'全部',
          value:0,
          minValue:-1,
          maxValue:-1
        },{
          label:'500亩以下',
          value:1,
          minValue:-1,
          maxValue:parseInt(500/15*10000)
        },{
          label:'500-1000亩',
          value:2,
          minValue:parseInt(500/15*10000),
          maxValue:parseInt(1000/15*10000)
        },{
          label:'1000-2000亩',
          value:3,
          minValue:parseInt(1000/15*10000),
          maxValue:parseInt(2000/15*10000)
        },{
          label:'2000亩以上',
          value:4,
          minValue:parseInt(2000/15*10000),
          maxValue:-1
        }],
        heathFilterModel:heathesOptions,
        heathes:heathesOptions,

        cropFilterModel:[],
        cropIdList:[],
        cropNameList:[],
        filterCropCheckAll:true,
        filterCropIsIndeterminate:false,


        showTree:false,
        treeNodeName:'全区',
        defaultProps: {
          children: 'contain',
          label: 'area_name'
        },
        treeFilter:[],
        filterShowHeathChooseOne:false,
        filterShowCropChooseOne:false,

        disabledBtn:'normal-btn',
        filterTop:0,
      }
    },
    computed: {
      ...mapGetters({
          getScreenHeight: 'getScreenHeight'
        })
    },
    mounted() {  
     this.getFilterListTop()
    },
    methods: {
      getShowTreeStatus(status){
        this.showTree = status
      },
      getTreeNode(data){
        this.treeNodeName = data.area_name
      },
      doFilter() {    
        if (this.filterShowHeathChooseOne == true || this.filterShowCropChooseOne == true) {
          this.disabledBtn = 'disabled-btn'
          return
        }else{
          this.disabledBtn = 'normal-btn'
          var displayNames = this.getDisplayNames()
          var apiParams = this.getParams();
          // console.log(displayNames)
          // console.log(apiParams)
         
          this.$emit('sliderOutFliter', false);
          this.$emit('doFilterCb', {displayNames, apiParams})
        }
      },
      doSlideOutFilter(){//取消按钮
        this.$emit('sliderOutFliter', !this.show);
      },
      getDisplayNames() {//回显总数据
        var names = [];
        var heathData = [];
        names = [this.formatFilterTree(),this.formatFilterDisplayRadio(),this.formatFilterDisplayHeath(),this.formatFilterCrop()]
        return names
      },
      getParams() { //参数总数据       
        var params = [];
        params = [this.formatFilterTree(),this.formatFilterParamsRadio(),this.formatFilterParamsHeath(),this.formatFilterParamsCrop(this.cropFilterModel)]
        return params 
      },
      formatFilterTree(){//总农场tree数据处理
        if (this.treeNodeName == '全区') {
          return -1
        }else{
          return this.treeNodeName
        }
      },
      formatFilterTreeData(list){
          this.treeFilter = []
          var secondLable = Object.keys(list);
          var secondArr = [];
          for (var i = 0; i < secondLable.length; i++) {
            var thirdLable = Object.keys(list[secondLable[i]])
              var thirdArr = []
              for (var j = 0; j < thirdLable.length; j++) {
                var thirdObj = {
                  area_name:thirdLable[j]
                }
                thirdArr.push(thirdObj)
              }
              var secondObj = {
                area_name:secondLable[i],
                contain:thirdArr
              }
            secondArr.push(secondObj);

          }
          var firstObj = {
            area_name:'全区',
            contain:secondArr
          }
          this.treeFilter.push(firstObj);
      },
      formatFilterParamsRadio(){ //地块面积返回参数处理
        var resParamsArr = [] 
        if (this.areaModel === 0) {
          return -1
        }else{
          resParamsArr = [this.areaOptions[this.areaModel].minValue,this.areaOptions[this.areaModel].maxValue]
          return resParamsArr
        }
      },
      formatFilterDisplayRadio(){//地块面积回显处理
        var resDisplayArr = ''
        if (this.areaModel === 0) {
          return -1
        }else{
          resDisplayArr = this.areaOptions[this.areaModel].label
          return resDisplayArr
        }
      },
      heathFilterChange(value){//健康 复选 触发
        let heathFilterCount = value.length;
        if (heathFilterCount === 0) {
          this.filterShowHeathChooseOne = true;
        }else{
          this.filterShowHeathChooseOne = false;
        }       
      },
      formatFilterParamsHeath(){//健康数据处理（参数）
        var cropArrRes = [];
        if (this.heathFilterModel.length == 1) {
          if (this.heathFilterModel[0] === '健康') {
            cropArrRes = [3,4,5];
            return cropArrRes
          }else{
            cropArrRes = [1,2];
            return cropArrRes
          }
        }else{
          return -1;
        }
      },
      formatFilterDisplayHeath(){//健康数据处理（回显）
        if (this.heathFilterModel.length == 2) {
          return -1
        }else{
          return this.heathFilterModel[0];
        }
      },
      formatFilterCrop(){//种植作物数据处理（回显）
        if (this.cropFilterModel.length == this.ownerCrops.length) {
          return -1
        }else{
          var cropDisplay = []
          for (var i = 0; i < this.cropFilterModel.length; i++) {
            cropDisplay.push(this.cropNameList[this.handleSelectedCrop()[i]])
          }
          return cropDisplay
        } 
      },
      handleSelectedCrop(){
        var checkedCrop = []
        console.log(this.cropIdList)
        for (var i = 0; i < this.cropIdList.length; i++) {
          if (this.cropFilterModel.includes(this.cropIdList[i])) {
            checkedCrop.push(i);
          }else{
            checkedCrop = checkedCrop 
          }
        }
        return checkedCrop
      },
      formatFilterParamsCrop(arr){//种植作物数据处理（参数）
        if (arr.length === this.ownerCrops.length) {
          return -1
        }else{
          return this.cropFilterModel
        }
      },
      filterCropCheckAllChange(){//植物部分全选
        this.cropFilterModel = event.target.checked ? this.cropIdList : []
        this.filterCropIsIndeterminate = false
        this.chooseOneStatus()
      },
      cropFilterChange(value) {// 植物部分复选框逻辑
        let checkedCount = value.length;
        this.filterCropCheckAll = checkedCount === this.ownerCrops.length;
        this.filterCropIsIndeterminate = checkedCount > 0 && checkedCount < this.ownerCrops.length;
        this.chooseOneStatus()
      },
      chooseOneStatus(){
        if (this.cropFilterModel.length === 0) {
          this.filterShowCropChooseOne = true;
        } else {
          this.filterShowCropChooseOne = false;
        }
      },
      formatOwnerlistdata(list){
        this.cropFilterModel = []
          for (var i = 0; i < list.length; i++) {
            var cropId = list[i].crop_id;
            var cropName = list[i].crop_name;
            this.cropFilterModel.push(cropId)
            this.cropIdList.push(cropId)
            this.cropNameList.push(cropName)
          }
      },
      getFilterListTop(){
        var resFilterTop = (this.getScreenHeight - 120 - 496 ) / 2
          if (resFilterTop >= 0) {
            if (this.getScreenHeight - 120 >= 920) {
              this.filterTop = (920 - 496) / 2
            }
            this.filterTop = resFilterTop
          }else{
            this.filterTop = 0
          }
      }
    },
    watch: {
      show(status){
        if (status) {
           this.getFilterListTop()
           this.filterSlideAnimation = 'filter-animation-in';
         }else{
           this.filterSlideAnimation = 'filter-animation-out';
         }
      },
      ownerCrops(list) {
        if (list && list.length > 0) {
          this.formatOwnerlistdata(list)
        }
      },
      relationTree(list){
        if (list) {
          this.formatFilterTreeData(list)
        }
      },
      filterShowHeathChooseOne(status){
        if (status) {
          this.disabledBtn = 'disabled-btn'
        }else{
          this.disabledBtn = 'normal-btn'
        }
      },
      filterShowCropChooseOne(status){
        if (status) {
          this.disabledBtn = 'disabled-btn'
        }else{
          this.disabledBtn = 'normal-btn'

        }
      },
      hideFilterTree(change){
        this.showTree = false
        this.$emit('initTreeStatus',true)
      }
    },
    components: {
      tree
    }
  }
</script>

<style
 lang="less" scoped>
@import '../../../assets/style/common';
  @value:358px;
  
  .normal-btn{
    cursor: pointer;
  }
  .disabled-btn{
    cursor: not-allowed !important;
  }
  .filter-layer-mask{
    width: 100%;
    height: 920px;
    background: black;
    opacity: 0.6;
    z-index: 100;
    position: absolute;
    left: 0;
    top: 0;
  }
  .filter-detail-border{
    top: 87px;
    left: 0;
    z-index: 20000;
    .filter-detail{
      width: 93%;
      padding:0;
      height: 496px;
      position: absolute;
      top: 0;
      left: 13px;
      z-index: 101;
      background: #ffffff;
      overflow: hidden;
      .farm-manager-border{
        padding: 14px 17px 16px;
        border-bottom: 1px solid @border-color;
        h3{
          .adv-title-normal();
        }
        .filter-tree{
          margin-top: 14px;
        }
      }
      .filter-child-border{
        padding: 18px 17px;
        border-bottom: 1px solid @border-color; 
        h3{
          .adv-title-normal;
        }
        .filter-heath-choose-one{
          .adv-text();
          color: red;
          font-weight: normal;
          line-height: 12px;
        }
        .filter-crop-choose-one{
          .adv-text();
          line-height: 12px;
          color: red;
          font-weight: normal;
        }
      }
      .filter-all-btn{
        position: relative;
        width: 100%;
        height: 69px;
        .filter-cancle{
          position: absolute;
          top: 18px;
          right: 106px;
          .adv-big-gray-btn();
        }
        .filter-confirm{
          position: absolute;
          top: 18px;
          right: 18px;
          .adv-big-primary-btn();
        }
      }
    }
  }
  @keyframes fadeleft {
   0% {
      left: @value;
      width: 0;
    }
    100% {
      left: 0px;
      width: 100%;
    }
  }
  .filter-animation-in {
   .adv-animation(fadeleft;.38s;1;forwards)
  }
  @keyframes faderight {
    0% {
      left: 0px;
      width: 100%;
      }
    100% {
      left: @value;
      width: 0;
    }
  }
  .filter-animation-out {
    .adv-animation(faderight;.38s;1;forwards)
  }

  
</style>