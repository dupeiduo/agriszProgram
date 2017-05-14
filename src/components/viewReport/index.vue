<template>
	<div v-if="showReport">
		 <div class="shadow-cover"></div>
	   <div class="report-alllist">
      <p class="report-section pr">
        <span class="report-alllist-title font14" v-if="showReportTitle">{{reportTitle}}</span>
        <span class="report-close">
          <i @click="closePopReport" class="el-icon-close"></i>  
        </span>
      </p>
        <div class="scroll-container">
          <slot name="reportList"></slot>
        </div>
	    </div>
	</div>
</template>
<script>
	export default{
    props:{
      reportName:{
        type: String,
        default: ''
      },
      showReport: {
        type: Boolean,
        default: false
      },
      showReportTitle: {
        type: Boolean,
        default: false
      },
      reportTitle: {
        type: String,
        default: '11'
      }
    },
		data(){
			return {
			}
		},
		methods:{
      closePopReport() {
        this.$emit('closePopReport')
      }
		},
    watch: {

    },
		components: {}
	}
</script>
<style lang="less" scoped>
  .shadow-cover {
      position: absolute;
      z-index: 3;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.3);
  }
  .report-alllist {
      position: absolute;
      z-index: 4;
      top: 55%;
      left: 50%;
      width: 700px;
      height: 400px;
      transform: translate(-50%,-50%);
      border-radius: 6px;
      background: #fff;
      overflow: hidden;
      padding-bottom: 60px;
      .report-section {
        height: 30px;
        width: 100%;
      }
      .report-alllist-title {
        position: absolute;
        left: 14px;
        top: 10px;
      }
      .scroll-container {
        position: relative;
        width: 700px;
        overflow-y: auto;
      }
  }
  .report-close {
    position: absolute;
    right: 14px;
    top: 10px;
    cursor: pointer;
}
    </style>