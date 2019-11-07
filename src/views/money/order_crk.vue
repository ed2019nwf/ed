<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="form.account" placeholder="用户名" style="width:150px"/>
      <el-input v-model="form.is_group" placeholder="代理名" style="width:150px"/>
      <el-input v-model="form.order_number" placeholder="订单号" style="width:150px"/>
      <el-select v-model="form.pay_type" placeholder="现金类型" style="width:150px">
        <el-option label="支付" value="1"/>
        <el-option label="出款" value="2"/>
        <el-option label="彩金" value="3"/>
        <el-option label="额度调整" value="5"/>
      </el-select>
      <el-date-picker
        v-model="form.start_time"
        value-format="yyyy-MM-dd 00:00:00"
        type="date"
        placeholder="开始时间"
        style="width:150px"
      />
      <span class="line">-</span>
      <el-date-picker
        v-model="form.end_time"
        value-format="yyyy-MM-dd 00:00:00"
        type="date"
        placeholder="结束时间"
        style="width:150px"
      />
      <el-select v-model="form.cash_status" placeholder="订单状态" style="width:150px">
        <el-option label="未处理" value="1"/>
        <el-option label="拒绝" value="2"/>
        <el-option label="完成" value="3"/>
      </el-select>
      <el-select v-model="form.pay_class" placeholder="支付方式" style="width:150px">
        <el-option
          v-for="(item,index) in paylist"
          :key="index"
          :label="item.title"
          :value="item.code"
        />
      </el-select>
      <!-- <el-select v-model="form.order_by" placeholder="顺序" style="width:150px">
        <el-option label="升序" value="create_time asc"/>
        <el-option label="降序" value="create_time desc"/>
      </el-select> -->
      <el-button type="primary" icon="el-icon-search" :loading="listLoading" @click="fetchData">搜索</el-button>
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
        <template slot-scope="scope">{{ scope.row.order_number }}</template>
      </el-table-column>
      <el-table-column align="center" label="所属代理">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.finish_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | orderFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="额度" align="center">
        <template slot-scope="scope">{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column label="现金类型" align="center">
        <template slot-scope="scope">{{ scope.row.pay_type | paytypeFilter }}</template>
      </el-table-column>
      <el-table-column label="银行卡号" align="center">
        <template slot-scope="scope">{{ scope.row.card_number }}</template>
      </el-table-column>
      <el-table-column label="持卡人姓名" align="center">
        <template slot-scope="scope">{{ scope.row.card_name }}</template>
      </el-table-column>
      <el-table-column label="银行名称" align="center">
        <template slot-scope="scope">{{ scope.row.bank_name }}</template>
      </el-table-column>
      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">{{ scope.row.finisher }}</template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">{{ scope.row.note }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope" v-if="scope.row.status == 1">
          <el-button
            type="success"
            icon="el-icon-success"
            size="small"
            @click="handle(scope.row,3)"
          >同意</el-button>
          <el-button type="danger" icon="el-icon-error" size="small" @click="handle(scope.row,2)">拒绝</el-button>
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
import { getcashlist, getPayClass, updatecash, downloadcash } from "@/api/user";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        "3": "success",
        "1": "gray",
        "2": "danger"
      };
      return statusMap[status];
    },
    orderFilter(status) {
      const statusMap = {
        "1": "未处理",
        "2": "拒绝",
        "3": "完成"
      };
      return statusMap[status];
    },
    paytypeFilter(type) {
      const typeMap = {
        "1": "支付",
        "2": "出款",
        "3": "彩金",
        "5": "额度调整"
      };
      return typeMap[type];
    }
  },
  data() {
    return {
      form: {
        account: "",
        is_group: "",
        start_time: "",
        end_time: "",
        pay_type: "",
        cash_status: "",
        order_number: "",
        order_by: "",
        pay_class: "",
        page: "",
        page_size: 10
      },
      paylist: "",
      list: null,
      total: "",
      currentpage: "",
      listLoading: true
    };
  },
  created() {
    this.getPayClass();
    this.fetchData();
  },
  methods: {
    // 获取支付方式
    getPayClass() {
      getPayClass().then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { pay_list } = response.Data;
          this.paylist = pay_list;
        }
      });
    },
    // 同意/拒绝上下分(state:2=>拒绝、state:3=>同意)
    handle(row, state) {
      const { order_number } = row;
      const params = {
        order_number: order_number,
        cash_status: state
      };
      updatecash(params).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.fetchData();
        }
      });
    },
    // 上下分信息列表
    fetchData() {
      this.listLoading = true;
      getcashlist(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { cash_list, total } = response.Data;
          this.list = cash_list;
          this.total = total;
        }
      });
    },
    // 导出
    exportData(){
        this.listLoading = true;
        downloadcash(this.form).then(response =>{
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
