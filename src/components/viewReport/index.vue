<template>
	<div>
		 <div class="shadow-cover" v-show="showReport"></div>
	   <div  @click="showEventHandler" class="check-report">{{reportName}}</div>
	   <div class="report-alllist" id="report-alllist" v-show="showReport">
	    	<span class="report-close">
          <i @click="showReport=false" class="el-icon-close"></i>  
        </span>
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
      }
    },
		data(){
			return {
				showReport: false
			}
		},
		methods:{
      showEventHandler(){
        this.showReport = true;
        this.$emit('loadReport');
      },
		},
    watch: {

    },
		components: {}
	}
</script>
<style lang="less" scoped>
      .check-report {
        line-height: 28px;
        position: fixed;
        z-index: 1;
        top: 77px;
        right: 80px;
        width: 126px;
        height: 28px;
        padding-left: 40px;
        cursor: pointer;
        color: #fff;
        background: url(/static/assets/img/common/product-check.png) no-repeat;
    }
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

      .scroll-container {
        position: relative;
        width: 700px;
        overflow-y: auto;
      }
  }
  .report-close {
    line-height: 30px;
    display: block;
    z-index: 2;
    width: 98%;
    margin-top: 12px;
    cursor: pointer;
    text-align: right;
    background: #fff;
}
    </style>