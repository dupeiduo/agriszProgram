<template>
  <div class="analyze clear"  
        @click="hideTree" 
        :style="{'margin-left': menuWidth + 'px'}"
        :class="animationClassName"
        >
    <leftlist :leftList="leftList" @changeState="clickListItem"></leftlist>
    
    <div class="al-content pr " :style="{'height':getScreenHeight + 'px',width: screenWidth - menuWidth - 180 + 'px'}">
      <div class="al-filter" :style="{'width':screenWidth - menuWidth - 60 - 180 + 'px'}">
        <div class="al-filter-date clear pr">
          <div class="tree-container clear ps">
            <span class="select-tree-txt fl">选择市级</span>
            <div class="analyze-tree fl pr">
              <tree 
              :treeData="treeData"
              :showTree="areaShowTree"
              @getTreeNode="treeNodeClick"
              @changeShowTreeStatus="getAreaShowTreeStatus">
              </tree> 
            </div>
          </div>
            <el-date-picker
             class="ps select-date"
              v-model="timeValue"
              align="right"
              type="daterange"
              format="yyyy/MM/dd"
              placeholder="2014/02/14-2015/03/03"
              :picker-options="pickerOptions"
              @change="changTime"
              >
            </el-date-picker>
        </div>
      </div>
      <div class="analyze-content-all" :style="{'width':screenWidth - menuWidth - 60 -180 + 'px','height':getScreenHeight - 250  + 'px'}">
        <div class="al-tb-content pr">
          <div class="al-tb-wrap">
            
            <div class="al-title">
              <div class="al-title-p clear">
                <i class="al-title-txt fl">{{tabTitle}}</i>
                <span class="al-download fr" @click="downInfor">
                  <i class="iconfont icon-xiazai"></i>下载
                </span>
              </div>
            </div>

            <analyzetab v-loading.lock="loading"
              :tabData="tabData" 
              :options="options" 
              :type="type"
              :showNoData="!loading">
            </analyzetab>

            <el-pagination
              v-if="tabData.length > 0"
              class="pages"
              layout="prev, pager, next"
              :page-count="totalPage"
              :current-page="pageIndex"
              :page-size="pageSize"
              @current-change ="currentChange">
            </el-pagination>
        </div>
      </div>
        <div class="footer-width">
         <footerlite></footerlite>
       </div>
     
      </div>
    </div>
  </div>
</template>

<script>
  import request from 'api/request.js';
  import format from 'api/model.js';
  import untils from 'plugins/utils.js';
  import model from 'api/model.js';
  import leftlist from 'pages/analyze/leftList/';
  import analyzetab from 'pages/analyze/analyzeTab/';
  import {dateUtil} from 'plugins/utils.js';
  import footerlite from 'components/footerlite/'
  import tree from '../../components/tree'
  import {mapGetters} from 'vuex'
  
  export default{
    data(){
      return {
        timeValue:'',  
        startTime: new Date(2014,2,14),
        endTime: new Date(2015,3,3),
        leftList: [],
        formatedData: {},
        tabData: [],
        pageSize: 10,
        pageIndex: 1,
        sum: -1,
        totalPage: -1,
        treeData: [],
        defaultProps: {
          children: 'contain',
          label: 'area_name'
        },
        
        type: null,
        code: null,
        tabTitle:'',
        options: null,
        loading: true,
        pickerOptions: {
          disabledDate: (time)=> {
            var  oldDate = new Date(2010,1,1,0,0,0).getTime(),  
                  newDate = new Date().getTime();  
            if (time.getTime() > newDate) {
              return true
            } else if(time.getTime() < oldDate){
              return true
            }
          }
        },
        animationClassName: '',
        areaShowTree:false
      }
    },
    computed: {
      ...mapGetters({
        menuWidth: 'menuWidth',
        screenWidth: 'screenWidth',
        getScreenHeight: 'getScreenHeight'
      })},
    mounted() {
      this.leftList = [
        {
          name:'长势统计信息',
          key: 'NDVI-5'
        },{
          name:'旱情统计信息',
          key: 'TCI'
        }
      ]
      
      request.cantonTree().then((response) => {
        if (response && response.status === 200 && response.data.status === 200) {
          if (response.data.data.length > 0) {
            this.treeData = response.data.data;
            this.code = response.data.data[0].area_id
            
          } else {
            // 无政区
            this.loading = false
          } 

        } else {
          // 无政区
          this.loading = false
        } 
      })
    },
    methods: {
      getAreaShowTreeStatus(status){
        this.areaShowTree = status
      },
      hideTree() {
        this.areaShowTree = false
      },
      treeNodeClick(data) {
        this.bounds = model.formatBounds(data)
        this.code = data.area_id
      },
      clickListItem(index){
        this.tabData = []
        this.type = this.leftList[index].key
        this.tabTitle = this.leftList[index].name
        this.getAnalzeTab()
      },
      getAnalzeTab(){
        if (this.type && this.code) {
          this.loading = true
          var formated = format.formatAnalyze,
            url = `${this.type}/${this.code}/${dateUtil.formatDate(this.startTime)}/${dateUtil.formatDate(this.endTime)}`
          request.statistics(url).then((requestData) => {
            this.formatedData = formated(requestData.data,this.startTime,this.endTime,this.type, this.pageSize);
            this.goToPage(1)
            this.loading = false
          })
        }
      },
      changTime(value) {
        if (value) {
          this.startTime = new Date(value.substring(0, 10).replace(/-/g, "/"));
          this.endTime = new Date(value.substring(12, value.length).replace(/-/g, "/"));
          this.getAnalzeTab()
        }
      },
      downInfor() {
        var option = {
          start: dateUtil.formatDate(this.startTime),
          end: dateUtil.formatDate(this.endTime),
          index: this.type,
          area: this.code,
          filename: `${this.code}${dateUtil.formatDate(this.startTime)}至${dateUtil.formatDate(this.endTime)}${this.tabTitle}`
        };
        request.downloadExcel(option)
      },
      currentChange(index){
        this.goToPage(index)
      },
      goToPage(pageIndex) {
        this.sum = this.formatedData.sum;
        this.totalPage = this.formatedData.totalPage;
        
        var start = (pageIndex -1) * this.pageSize,
            end = pageIndex * this.pageSize;
        
        if(end > this.sum ){
          end = this.sum
        }

        this.tabData = this.formatedData.tbData.slice(start,end);
        this.options = this.formatedData.pieData.slice(start,end)
      }
    },
    watch: {
      menuWidth(width){
        if(width) {
          this.animationClassName = 'menu-left-animation'
        }
      },
      code: function (code) {
        this.getAnalzeTab()
      }
    },
    components: {
      leftlist,
      analyzetab,
      footerlite,
      tree
    }
  }
</script>
<style 
    lang="less"
    rel="stylesheet/less"
    scoped>

    @import '../../assets/style/common';
  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .analyze {
    overflow: hidden;
    height: 100%;
}
.el-date-editor--daterange.el-input {
    left: 446px;
}
.al-content {
    margin-left: 176px;
    background: #e3eaef;
      .al-filter {
          z-index: 1;
          position: absolute;
          top: 80px;
          left: 30px;
          border-bottom: 1px solid #eee;
          border-radius: 2px;
          background: #fff;
            .al-filter-date {
              position: relative;
              width: 100%;
              padding: 15px;
              height: 30px;
              border-bottom: 1px solid #eee;
              
                span {
                    margin: 0 6px 0 14px;
                    color: #666;
                }
                .tree-container {
                  left: 20px;
                    .select-tree-txt {
                        margin: 8px 6px 0 30px;
                        color: #666;
                    }
                }
            }
      }
}
.analyze-content-all {
  position: absolute;
  top: 175px;
  left: 30px;
  background: @assistant-bg;
  z-index: 0;
}
.al-tb-content {
    height: 460px;
    top: 0px;
    left: 0px;
    padding: 14px 16px;
    background: @assistant-bg;
    overflow-x: hidden;
      .al-tb-wrap {
        height: 600px;
          .al-title {
          width: 100%;
          height: 34px;
          background: #daf7ce;
            .al-title-p {
              .adv-font-normal();
              line-height: 34px;
              padding-left: 12px;
                span:hover {
                    background: #c3efac;
                }
                span {
                    width: 100px;
                    height: 34px;
                    cursor: pointer;
                    text-align: center;
                    background: #bae0a7;
                }
            }
        }
      }
}
.pages {
  position: absolute;
  right: 0;
  bottom: 2%;
  width: 100%;
  text-align: center;
}
</style>