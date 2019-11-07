<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-star">
            <svg-icon icon-class="star" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日投注</div>
            <count-to
              :start-val="0"
              :end-val="list.bet_in"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日派彩</div>
            <count-to
              :start-val="0"
              :end-val="list.bet_out"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-edit">
            <svg-icon icon-class="edit" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日上分</div>
            <count-to
              :start-val="0"
              :end-val="list.cash_in"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-education">
            <svg-icon icon-class="education" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日下分</div>
            <count-to
              :start-val="0"
              :end-val="list.cash_out"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">可下分余额</div>
            <count-to
              :start-val="0"
              :end-val="list.user_amount"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-user">
            <svg-icon icon-class="user" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日登录用户</div>
            <count-to
              :start-val="0"
              :end-val="list.user_login"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日注册用户</div>
            <count-to
              :start-val="0"
              :end-val="list.user_reg"
              :duration="2600"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="filter-container">
        <el-date-picker
          style="width:160px"
          v-model="form.start_time"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="开始时间"
        />
        <span class="line">-</span>
        <el-date-picker
          style="width:160px"
          v-model="form.end_time"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="结束时间"
        />
      <el-button type="primary" icon="el-icon-search" @click="fetchData" :loading="btnLoading">搜索</el-button>
      </div>
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import LineChart from "./components/LineChart";
import CountTo from "vue-count-to";
require("echarts/theme/macarons"); // echarts theme
import { getalldata, getUserGraphs } from "@/api/user";

const lineChartData = {
  newVisitis: {
    touzhuData: [],
    paicaiData: [],
    shangfenData: [],
    xiafenData: []
  }
};

export default {
  components: {
    CountTo,
    LineChart
  },
  data() {
    return {
      list: "",
      lineChartData: [],
      form:{
        start_time:'',
        end_time:''
      },
      listLoading:false,
      btnLoading:false
    };
  },
  mounted() {
    this.getAllData();
    this.getChartData();
  },
  methods: {
    getAllData() {
      getalldata().then(response => {
        if (response.Status == 200) {
          let {
            bet_in_list,
            bet_out_list,
            cash_in_list,
            cash_out_list
          } = response.Data;
          lineChartData.newVisitis.touzhuData = parseInt(bet_in_list);
          lineChartData.newVisitis.paicaiData = parseInt(bet_out_list);
          lineChartData.newVisitis.shangfenData = parseInt(cash_in_list);
          lineChartData.newVisitis.xiafenData = parseInt(cash_out_list);
          Object.keys(response.Data).forEach(val => {
            response.Data[val] = parseInt(response.Data[val]);
          });
          this.list = response.Data;
        }
      });
    },
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
    getChartData() {
      this.btnLoading = true;
      getUserGraphs({start_date:this.form.start_time,end_date:this.form.end_time}).then(val => {
        this.btnLoading = false;
        this.lineChartData = val.Data;
      }).catch(err=>{
        this.btnLoading = false;
      });
    },
    fetchData(){
      this.getChartData();
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-user {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #36a3f7;
      }
      .icon-star {
        background: #40c9c6;
      }
      .icon-edit {
        background: #f4516c;
      }
      .icon-education {
        background: #f4516c;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-user {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #36a3f7;
    }
    .icon-star {
      color: #40c9c6;
    }
    .icon-edit {
      color: #f4516c;
    }
    .icon-education {
      color: #f4516c;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
