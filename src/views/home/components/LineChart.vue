<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: [Object, Array],
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    },
    setOptions(item) {
      console.log(item)
      if (!item.title_list) return;
      let time = item.title_list,
        lineColor = ["#FF005A", "#3888fa", "orange", "green"],
        legends = [],
        series = item.data_list.map((val, key) => {
          legends.push(val.title);
          return {
            name: val.title,
            itemStyle: {
              normal: {
                color: lineColor[key],
                lineStyle: {
                  color: lineColor[key],
                  width: 2
                }
              }
            },
            smooth: true,
            type: "line",
            data: val.data_list,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          };
        });

      this.chart.setOption({
        xAxis: {
          data: time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          show:true,
          data: legends
        },
        series: series
      });
    }
  }
};
</script>
