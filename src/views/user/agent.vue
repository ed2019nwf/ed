<template>
  <div class="app-container">
    <div class="filter-container">
        <el-input v-model="form.agent" placeholder="用户名" clearable style="width:160px;"/>
      <el-button type="primary" icon="el-icon-search" @click="fetchData" :loading="listLoading">搜索</el-button>
    </div>
    <p style="color:red;font-size:12px">*点击用户名可查询当前用户的下属代理</p>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope" >
          <a style="color:#66b1ff"  @click="checkAccount(scope.row)">{{ scope.row.account }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户所属代理">
        <template slot-scope="scope">{{ scope.row.agent_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="是否为代理">
        <template slot-scope="scope">{{ scope.row.is_agent==='1'?'是':'否' }}</template>
      </el-table-column>
      <el-table-column align="center" label="下级代理数">
        <template slot-scope="scope">{{ scope.row.low_num }}</template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">{{ scope.row.n_agent_cn }}</template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { getAgentList } from "@/api/user";

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
         agent:'',
         page:1,
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
      getAgentList(this.form).then(response => {
        this.listLoading = false;
        this.list = response.Data.agent_list;
      });
    },
    checkAccount(obj){
      if(obj.low_num<1){
        this.$message.error("当前账户没有下级代理")
        return;
      }
      this.form.agent = obj.account;
      this.fetchData();
    }
  }
};
</script>
