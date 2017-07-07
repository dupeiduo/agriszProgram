<template>
  <div class="swn-tree-position pr">
    <input class="swn-tree-input" type="text" readonly
      @click="toggleTree"
      :value="treeNodeName"
      :style="{'background': inputColor }">
    <el-tree class="swn-tree" 
      v-if="showTreeStatus" 
      highlight-current
      :data="treeData"
      :props="defaultProps"
      @node-click="treeNodeClick">
    </el-tree>
    <span @click="toggleTree" class=" ps tree-icon" :class="showTree ? 'el-icon-arrow-up':'el-icon-arrow-down'"></span>
    <div v-if="showTree" class="confirm-btn-con">
      <span @click="confirmClicked" class="swn-confirm-btn">确&nbsp;&nbsp;定</span>
    </div>
  </div>
</template>
<script>
	export default{
    props:{
      treeData:{
        type: Array,
        default: function(){
        	return []
        }
      },
      inputColor: {
      	type:String,
      	default: '#fff'
      },
      showTree: {
      	type: Boolean,
      	default: false
      },
      nodeName: {
        type: String,
        default: ''
      }
    },
    mounted(){
    
    },
		data(){
		  return {
		  	code: '',
		  	treeNodeName: '',
		  	showTreeStatus: false,
		  	treeNodeData:'',
		  	defaultProps: {
          children: 'contain',
          label: 'area_name'
        }
		  }
		},
		methods:{
	      confirmClicked() {
	        this.showTreeStatus = !this.showTreeStatus
	        this.$emit('treeConfirm',this.treeNodeData)
	      },
				toggleTree(event){
		  		event.stopPropagation()
	      	this.showTreeStatus = !this.showTreeStatus
		  	},
		  	treeNodeClick(data){
		  		this.treeNodeData = data
		  		this.treeNodeName = data.area_name
		  		this.$emit('getTreeNode',data)
		  	}
		},
	  watch: {
	  	treeData: {
	  		handler: function (tree) {
	  			if (tree) {
		  			this.treeNodeName = tree[0].area_name
		  		}
	  		},
	  		deep:true
	  	},
	  	showTreeStatus(change){
	  		this.$emit('changeShowTreeStatus',change)
	  	},
	  	showTree(change){
	  		this.showTreeStatus = change
	  	},
      nodeName(name) {
        this.treeNodeName = name
      }

	  },
		components: {}
	}
</script>
<style
 lang="less" scoped>
    @import '../../assets/style/common';
  .swn-tree-input {
	  width: 100%;
	  height: 34px;
	  padding: 0 0 0 5px;
	  box-sizing: border-box;
	  border: 1px solid #d4d8d2;
	  border-radius: 4px;
	  cursor: pointer;
	  user-select: none;
	}

	.swn-tree {
	  position: absolute;
	  top: 44px;
	  width: 100%;
	  height: 160px;
	  text-align: left;
	  z-index: 1002;
	  overflow: auto;
	  border-radius: 4px;
	  box-shadow: 0 2px 6px #ccc;
	}
	.tree-icon {
	  right: 8px;
	  top: 12px;
	  cursor: pointer;
	}
	.confirm-btn-con {
	  box-shadow: 0 2px 6px #ccc;
	  position: absolute;
    width: 100%;
    height: 50px;
    background: #fff;
    top: 204px;
    left: 0;
    z-index: 10002;
    border-top: 1px solid @border-color-hard;
	  border-right: 1px solid #d4d8d2;
	  border-left: 1px solid #d4d8d2;
	}
	.swn-confirm-btn {
		.adv-fixed-big-primary-btn();
		.adv-position-center();
		position: absolute;
    color: #333;
    border-radius: 2px;
    font-weight: normal;
	}
	
</style>


