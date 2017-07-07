<template>
	<div v-if="showReport">
		 <div class="shadow-cover cover-zIndex"></div>
     <div class="report-bg pop-zIndex">
       <div class="report-alllist">
        <p class="report-section pr">
          <span class="report-alllist-title" v-if="showReportTitle">{{reportTitle}}</span>
          <span class="report-close">
            <i @click="closePopReport" class="el-icon-close"></i>  
          </span>
        </p>
        <div class="scroll-container">
          <slot name="reportList"></slot>
        </div>
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
<style
 lang="less" scoped>
@import '../../assets/style/common';
  .shadow-cover {
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.3);
  }
  .report-bg {
      .adv-position-center();
      .adv-common-border-radius(); 
      width: 700px;
      background: rgba(227, 246, 184, 0.5);
      overflow: hidden;
      .report-alllist {
        margin: 6px;
        background: #fff;
      }
      .report-section {
        height: 30px;
        width: 100%;
      }
      .report-alllist-title {
        .adv-font-normal();
        position: absolute;
        left: 14px;
        top: 10px;
      }
      .scroll-container {
        position: relative;
        width: 100%;
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