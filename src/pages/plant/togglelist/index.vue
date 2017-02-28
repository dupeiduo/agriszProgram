<template>
  <div>
    <ul class="toggle-container" v-show="list.length > 0">
      <li v-for="(p, index) in list">
        <p @click="toggle(p.open, index)">
          <span class="triangle-switcher"
            :class="p.open ? 'triangle-bottom' : 'triangle-right'"
            ></span>
          {{p.name}}
        </p>
        <ul v-show="p.open">
          <li v-for="(c, i) in p.child">
            {{c.name}}
            <el-switch class="switch"
              :width=56
              v-model="c.show"
              on-color="#8fc31f"
              off-color="#95adc4"
              on-text="显示"
              off-text="关闭"
              @change="showMe(c)">
            </el-switch>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        value: null
      }
    },
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    mounted() {

    },
    methods: {
      showMe(item) {
        this.$emit('showLayer', item)
      },
      toggle(open, index) {
        this.$emit('toggleMe', {open: !open, index})
      }
    },
    watch: {
      
    }
  }
</script>

<style lang="less">
  .toggle-container {
    max-height: 370px;
    overflow-x: hidden;
    margin: 10px;
    border: 1px solid #b5b5b5;
    border-radius: 6px;

    li {
      cursor: pointer;
      width: 250px;
      margin: 0 10px;
      p {
        line-height: 46px;
        width: 100%;
        padding: 0 18px;

        span {
          display: inline-block;
          width: 0;
          height: 0;
          margin: 10px 10px 0 0;
          border-bottom: 4px solid transparent;
        }
        .triangle-bottom {
          position: relative;
          top: 6px;
          border-top: 8px solid #959595;
          border-right: 4px solid transparent;
          border-left: 4px solid transparent;
        }
        .triangle-right {
          border-top: 4px solid transparent;
          border-left: 8px solid #959595;
        }
      }
      ul {
        margin: 5px 10px;
        background: #eee;
        width: 270px;
        padding: 8px 0px 0px;
        border-radius: 5px;

        li {
          .switch {
            float: right;
          }
        }
      }
    }
  }
</style>
