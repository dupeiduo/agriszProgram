<template>
  <div class="date-slider">
    <d-slider class="slider-ul"
      :sliders="year"
      :current="curYear"
      :grade="'y'"
      @change="changeDate"></d-slider>
    <d-slider class="slider-ul"
      :sliders="month"
      :current="curMonth"
      :grade="'m'"
      @change="changeDate"></d-slider>
    <d-slider class="slider-ul"
      :sliders="period"
      :current="curPeriod"
      :grade="'p'"
      @change="changeDate"></d-slider>
  </div>
</template>

<script>
import {dateUtil} from 'plugins/utils.js'
import dSlider from './slider/index.vue'


export default{
    props: {
      date: {
        type: Date,
        default: new Date()
      },
      start:{
        type: Date,
        default: new Date('2010-01-01')
      },
      end:{
        type: Date,
        default: new Date()
      }
    },
    data(){
      return {
        year: [],
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        period: [1, 2, 3],
        curYear: 0,
        curMonth: 0,
        curPeriod: 0
      }
    },
    mounted() {
      let y = 0
      while((this.start.getFullYear() + y) <= this.end.getFullYear()) {
        this.year.push(this.start.getFullYear() + y)
        y++
      }
      this.curYear = this.date.getFullYear()
      this.curMonth = this.date.getMonth() + 1
      this.curPeriod = dateUtil.dayToPeriod(this.date.getDate())
    },
    methods: {
      changeDate(data) {
        var date = this.date
        switch(data.grade) {
          case 'y':
            date.setYear(data.index)
            break;
          case 'm':
            date.setMonth(data.index - 1)
            break;
          case 'p':
            let day = dateUtil.periodToDay(data.index)
            date.setDate(day)
            break;
        }
        this.$emit('changeDate', date)
      }
    },
    watch: {
      date: {
        handler: function (date) {
          this.curYear = this.date.getFullYear()
          this.curMonth = this.date.getMonth() + 1
          this.curPeriod = dateUtil.dayToPeriod(this.date.getDate())
        },
        deep: true
      }
    },
    components: {
      dSlider
    }
  }
</script>

<style lang="less" scoped>
  .date-slider {
    position: absolute;
    width: 222px;
    height: 100px;
    padding: 0;
    border: 1px solid #d0d0d0;
    background: #fff;
    z-index: 1;
    box-shadow: 0 1px 5px #d0d0d0;

    .slider-ul {
      text-align: center;
      width: 73px;
      height: 101px;
      overflow: hidden;
      margin: 0 auto;
      position: relative;
      float: left;
    }
  }
</style>
