<template>
  <div>
    <!-- <date-slider
      :date="date"
      :start="start"
      :end="end"
      @changeDate="changeDate"
      ></date-slider> -->
    <date-line
      :date="date"
      :dlData="dlData"
      :start="start"
      :end="end"
      @changeDate="changeDate"
      ></date-line>
  </div>
</template>

<script>
  import dateSlider from './dateSlider'
  import dateLine from './dateLine'

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
      },
      dlData: {
        type: Object,
        default: null
      }
    },
    data(){
      return {}
    },
    methods: {
      changeDate(date) {
        this.$emit('changeDate', date)
      }
    },
    components: {
      dateSlider,
      dateLine
    }
  }
</script>