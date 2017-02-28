<template>
  <div class="market-section">
  	<p class="market-select-title pr">{{sectionTitle}}</p>
    <div class="market-select-content">
      <slot name="section-content"></slot>
    </div>
  </div>
</template>

<script>
  export default{
  	props: {
  		sectionTitle: {
  			type: String,
  			default:''
  		}
  	},
    data(){
      return {
      }
    },
    computed: {

    },
    methods: {
    },
    components: {
    }
  }
</script>
<style 
  lang="less" 
  rel="stylesheet/less" 
  scoped>
  .market-section {
  	.market-select-title {
	    font-size: 14px;
	    line-height: 32px;
	    z-index: 1;
	    width: 82px;
	    height: 32px;
	    text-align: center;
	    border-top: 1px solid #d7d7d7;
	    border-right: 1px solid #d7d7d7;
	    border-bottom: 1px solid #eee;
	    border-left: 1px solid #d7d7d7;
	    border-radius: 2px 2px 0 0;
	    background: #eee;
	}
	.market-select-content {
	    top: -1px;
	    border: 1px solid #d7d7d7;
	}
  }
</style>