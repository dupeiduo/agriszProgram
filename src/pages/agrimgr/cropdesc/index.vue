<template>
  <div class="cropdesc-detail"  v-if="cropDescData">
    <div class="cropdesc-detail-introduce">
      <div class="pr">
        <h3 class="cropdesc-detail-title">{{cropDescData.title}}</h3>
        <span class="check-all cleak-common ps" @click="showCropDetail('')">查看全部  <i class="iconfont icon-icon-copy-copy"></i></span>
      </div>
      <p class="cropdesc-detail-section" 
        v-if="cropDescData.desc.areaStatus">
        地块共<b>{{cropDescData.desc.totalLandCount}}</b>个, 其中{{cropDescData.desc.healthy}}地块共<b>{{cropDescData.desc.healthyLandCount}}</b>个(共<b>{{cropDescData.desc.healthyArea}}</b>亩)
      </p>

      <p v-else class="cropdesc-detail-section">
        {{cropDescData.desc.areaDesc}}地块共<b>{{cropDescData.desc.totalLandCount}}</b>个<b>{{cropDescData.desc.totalArea}}</b>亩, 其中{{cropDescData.desc.healthy}}地块<b>{{cropDescData.desc.healthyLandCount}}</b>个(共<b>{{cropDescData.desc.healthyArea}}</b>亩)
      </p>
    </div>
    <ul class="cropdesc-detail-list" v-if="cropDescData.cropList.length > 0">
      <li v-for="(item,index) in cropDescData.cropList">
        <div class="cropdesc-list-introduce">
          <h3  :style="{color: item.color,borderColor: item.color,background: item.bg}">
              <svg class="icon">
                <use :xlink:href="'#' + item.cropIcon"></use>
              </svg>
              <span>{{item.crop}}</span>
          </h3>
          <span class="cleak-common cleak-detail ps" @click="showCropDetail(item.id)">查看详情  <i class="iconfont icon-icon-copy-copy"></i></span>
        </div>
        <p class="cropdesc-list-section" v-if="item.filterHealthy">
          
          <span  v-if="cropDescData.problemCount > 0">
            种植总面积<b class="fw600">{{item.totalArea}}</b>亩; 
            {{item.areaSizeDisplayName}}{{item.crop}}地块
            <b class="fw600">{{item.inrangeLandCount}}</b>个
            (<b class="fw600">{{item.inrangeArea}}</b>亩), 
            全部<i class="healty-color" :style="{color: item.healthColor}">健康</i>状况良好
          </span>

          <span v-else>
            种植总面积<b class="fw600">{{item.totalArea}}</b>亩, 
            {{item.areaSizeDisplayName}}{{item.crop}}地块
            <b class="fw600">{{item.inrangeLandCount}}</b>个
            (<b class="fw600">{{item.inrangeArea}}</b>亩), 
            其中<b class="fw600">{{item.healthyCount}}</b>
            个地块(<b class="fw600">{{item.healthArea}}</b>亩)是<i class="healty-color" :style="{color: item.healthColor}">健康</i>的
          </span>
          

        </p>
        <p class="cropdesc-list-section" v-else>
           
          <span v-if="cropDescData.problemCount > 0">
            种植总面积<b class="fw600">{{item.totalArea}}</b>亩, 
            {{item.areaSizeDisplayName}}{{item.crop}}地块
            <b class="fw600">{{item.inrangeLandCount}}</b>个
            (<b class="fw600">{{item.inrangeArea}}</b>亩), 
            并未出现<i class="ill-color" :style="{color: item.healthColor}">健康问题</i>
          </span>

          <span v-else>
            种植总面积<b class="fw600">{{item.totalArea}}</b>亩, 
            {{item.areaSizeDisplayName}}{{item.crop}}地块
            <b class="fw600">{{item.inrangeLandCount}}</b>个
            (<b class="fw600">{{item.inrangeArea}}</b>亩), 
            其中<b class="fw600">{{item.problemCount}}</b>个地块
            (<b class="fw600">{{item.problemArea}}</b>亩)出现<i class="ill-color" :style="{color: item.healthColor}">健康问题</i>
          </span>
          
        </p>
      </li>
    </ul>
    <expect-data v-else :showSectionData="true"></expect-data>
  </div>
</template>

<script>
import expectData from 'components/expectData/'
  export default {
    props: {
      cropDescData: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        showSectionData: false
      }
    },
    mounted() {
    },
    methods: {
      showCropDetail(cropId) {
        // is all or single crop
        
        this.$emit('showTableDetail', cropId)
      }
    },
    watch: {

    },
    components: {
      expectData
    }
  }
</script>

<style 
 lang="less" scoped>
@import '../../../assets/style/common';
  .cleak-common {
      text-decoration: underline;
      color: #627437;
      cursor: pointer;
      &:hover {
        color: #639002;
        font-weight: bold;
      }
      i {
        font-size: 12px;
      }
  }
  .number-green {
    color: #5a8300;
  }
  .cropdesc-detail {
    .adv-border-normal();
    background: #fff;
    margin-top: 10px;
    line-height: 1;
    min-height: 300px;
    .cropdesc-detail-introduce {
      border-bottom: 1px solid @border-color;
      background: #faf8f4;
      padding: 16px 12px 14px;
      box-sizing: border-box;
      .cropdesc-detail-title {
        .adv-title-big();
        width: 72%;
        line-height: 22px;
      }
      .cropdesc-detail-section {
        .adv-text-line-height-small();
        margin-top: 12px;
        color: #272727;
      }
      .check-all {
        top: 3px;
        right: 0;
      }
    }
    .cropdesc-detail-list {
      li {
        position: relative;
        border-bottom: 1px dashed @border-color;
        padding: 16px 14px 14px;
        
        &:last-child {
          border-bottom: none;
        }
        &:nth-child(2) {
          svg {
            font-size: 16px;
            vertical-align: middle;
          }
        }
        .cropdesc-list-introduce {
          position: relative;
          h3 {
            .adv-height(26px);
            .adv-horizontal-center(78px);
            font-size: 14px;
            border-radius: 20px;
            border-width: 1px;
            border-style: solid;
          }
          .cleak-detail {
            top: 3px;
            right: 0;
          }
        }
        .cropdesc-list-section {
          .adv-text-line-height-small();
          margin-top: 12px;
        }
      }
    }
  }
</style>