<template>
  <div class="app-container">
    <div class="filter-container">
        <el-input v-model="form.account" placeholder="用户名" style="width:160px"/>
        <el-input v-model="form.agent_name" placeholder="所属代理" style="width:160px"/>
        <el-select v-model="form.amount_type" placeholder="账变类型" style="width:160px">
          <el-option label="全部" value=""/>
          <el-option label="支付" value="1"/>
          <el-option label="出款" value="2"/>
          <el-option label="彩金" value="3"/>
          <el-option label="投注" value="4"/>
          <el-option label="额度调整" value="5"/>
          <el-option label="投注赢利" value="6"/>
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
        <!-- <el-select v-model="form.order_by" placeholder="排序" style="width:160px">
          <el-option label="升序" value="create_time asc"/>
          <el-option label="降序" value="create_time desc"/>
        </el-select> -->
      <el-button type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
      <el-button type="warning" icon="el-icon-download" @click="exportData">导出</el-button>
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
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">{{ scope.row.order_id }}</template>
      </el-table-column>
      <el-table-column align="center" label="账变前金额">
        <template slot-scope="scope">{{ scope.row.befor_amount }}</template>
      </el-table-column>
      <el-table-column align="center" label="账变金额">
        <template slot-scope="scope">{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column align="center" label="账变后金额">
        <template slot-scope="scope">{{ scope.row.after_amount }}</template>
      </el-table-column>
      <el-table-column align="center" label="账变类型">
        <template slot-scope="scope">{{ scope.row.amount_type | amountFilter }}</template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.create_time }}</span>
        </template>
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
import { getamountlist,downloadamount } from "@/api/user";

export default {
  filters: {
    amountFilter(val){
        const valMap = {
          '1':'支付',
          '2':'出款',
          '3':'彩金',
          '4':'投注',
          '5':'额度调整',
          '6':'投注赢利'
        }
        return valMap[val];
    }
  },
  data() {
    return {
      form: {
        account: "",
        agent_name: "",
        amount_type: "",
        start_time: "",
        end_time: "",
        order_by: "",
        page: "",
        page_size: 15
      },
      list: null,
      total: "",
      currentpage: "",
      listLoading: true
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 账变记录列表信息
    fetchData() {
      this.listLoading = true;
      getamountlist(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { amount_list,total } = response.Data;
          this.list = amount_list;
          this.total = total;
        }
      });
    },
    // 导出
    exportData(){
        this.listLoading = true;
        downloadamount(this.form).then(response =>{
          this.listLoading = false;
          if (response.Status == 200) {
             const {down_url} = response.Data;
             this.$message({
               message:'文件导出成功',
               type:'success'
             })
             window.open(down_url);
          }
        })
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
