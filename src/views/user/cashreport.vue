<template>
  <div class="app-container">
    <div class="filter-container">
        <el-input v-model="form.account" placeholder="用户名" style="width:160px;"/>
        <el-select v-model="form.is_test" placeholder="显示状态">
          <el-option label="显示全部" value=""/>
          <el-option label="只显示测试" value="1"/>
          <el-option label="只显示正式" value="0"/>
        </el-select>
        <el-date-picker
          style="width:160px"
          v-model="form.start_time"
          value-format="yyyy-MM-dd 00:00:00"
          type="date"
          placeholder="开始时间"
        />
        <span class="line">-</span>
        <el-date-picker
          style="width:160px"
          v-model="form.end_time"
          value-format="yyyy-MM-dd 00:00:00"
          type="date"
          placeholder="结束时间"
        />
        <el-select v-model="form.pay_type" placeholder="现金类型" style="width:160px">
          <el-option label="所有" value="0"/>
          <el-option label="支付" value="1"/>
          <el-option label="出款" value="2"/>
          <el-option label="彩金" value="3"/>
          <el-option label="额度调整" value="5"/>
        </el-select>
        <el-select v-model="form.status" placeholder="订单状态" style="width:160px">
          <el-option label="所有" value="0"/>
          <el-option label="处理中" value="1"/>
          <el-option label="拒绝" value="2"/>
          <el-option label="完成" value="3"/>
        </el-select>
      <el-button type="primary" icon="el-icon-search" @click="fetchData" :loading="listLoading">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column align="center" label="支付金额">
        <template slot-scope="scope">{{ scope.row.amount_in }}</template>
      </el-table-column>
      <el-table-column align="center" label="出款金额">
        <template slot-scope="scope">{{ scope.row.amount_out }}</template>
      </el-table-column>
      <el-table-column align="center" label="彩金">
        <template slot-scope="scope">{{ scope.row.amount_cj }}</template>
      </el-table-column>
      <el-table-column align="center" label="额度调整">
        <template slot-scope="scope">{{ scope.row.amount_change }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total>form.page_size"
      background
      layout="total,prev, pager, next"
      :page-size="form.page_size"
      :current-page="currentpage"
      :total="total"
      :pager-count="7"
      @current-change="handleCurrentChange"
      @next-click="handleNext"
      @prev-click="handlePrev"
      style="margin-top:20px"
    ></el-pagination>
  </div>
</template>

<script>
import { getcashreport } from "@/api/user";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': "正常",
        '-1': "删除",
        '0': "锁定"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      form:{
         account:'',
         status:'',
         pay_type:'',
         is_test:'',
         start_time:'',
         end_time:'',
         page:'',
         page_size:15
      },
      total: "",
      currentpage: "",
      list: null,
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getcashreport(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { list,total } = response.Data;
          this.list = list;
          this.total = total;
        }
      });
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentpage = val;
      this.form.page = val;
      this.fetchData();
    },
    // 下一页
    handleNext(val) {
      this.form.page = val;
      this.fetchData();
    },
    // 上一页
    handlePrev(val) {
      this.form.page = val;
      this.fetchData();
    }
  }
};
</script>
