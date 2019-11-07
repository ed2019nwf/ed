<template>
  <div class="app-container">
    <div class="filter-container">
        <el-input v-model="form.account" placeholder="用户名" style="width:160px"/>
        <el-input v-model="form.agent_name" placeholder="代理名" style="width:160px"/>
        <el-select v-model="form.game_code" placeholder="游戏名称">
            <el-option v-for="(item,index) in gamecodelist" :key="index" :label="item.title" :value="item.game_code"></el-option>
        </el-select>
        <el-input v-model="form.issue" placeholder="奖期" style="width:160px"/>
        <el-date-picker style="width:160px" v-model="form.start_time" value-format="yyyy-MM-dd 00:00:00" type="date" placeholder="开始时间"/>
        <span class="line">-</span>
        <el-date-picker style="width:160px" v-model="form.end_time" value-format="yyyy-MM-dd 00:00:00" type="date" placeholder="结束时间"/>
        <el-select v-model="form.bet_status" placeholder="订单状态" style="width:160px">
          <el-option label="处理中" value="1"/>
          <el-option label="撤销" value="2"/>
          <el-option label="完成" value="3"/>
        </el-select>
        <!-- <el-select v-model="form.order_by" placeholder="排序" style="width:160px">
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
      <el-table-column align="center" label="奖期">
        <template slot-scope="scope">{{ scope.row.issue }}</template>
      </el-table-column>
      <el-table-column align="center" label="投注额">
        <template slot-scope="scope">{{ scope.row.pay_amount }}</template>
      </el-table-column>
<el-table-column align="center" label="房间号">
        <template slot-scope="scope">{{ scope.row.lobby_code }}</template>
      </el-table-column>
<el-table-column align="center" label="赔率">
        <template slot-scope="scope">{{ scope.row.bet_rate }}</template>
      </el-table-column>
      <el-table-column align="center" label="投注内容">
        <template slot-scope="scope">{{ scope.row.bet_content }}</template>
      </el-table-column>
      <el-table-column align="center" label="游戏名称">
        <template slot-scope="scope">
          <span>{{ scope.row.game_code_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投注时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.bet_time }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | rowstateFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="额度" align="center">
        <template slot-scope="scope">{{ scope.row.amount }}</template>
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
import { getbetlist,downloadbet,lobbylist} from "@/api/user";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '3': "success",
        '1': "gray",
        '2': "danger"
      };
      return statusMap[status];
    },
    rowstateFilter(state){
        const stateMap = {
        '1': "处理中",
        '2': "撤销",
        '3': "完成"
        }
        return stateMap[state];
    }
  },
  data() {
    return {
      form: {
        game_code:'',
        account:'',
        start_time:'',
        end_time:'',
        bet_status:'',
        agent_name:'',
        issue:'',
        order_by:'',
        page:'',
        page_size:10
      },
      list: null,
      total: "",
      currentpage: "",
      listLoading: true,
      gamecodelist:[]
    };
  },
  created() {
    this.lobbylist();
    this.fetchData();
  },
  methods: {
    // 获取游戏编码
    lobbylist(){
      lobbylist().then(response=>{
         if (response.Status == 200) {
          const {Game_list} = response.Data;
          this.gamecodelist = Game_list;
        }
      })
    },
    // 投注列表信息
    fetchData() {
      this.listLoading = true;
      getbetlist(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { bet_list,total } = response.Data;
          this.list = bet_list;
          this.total = total;
        }
      });
    },
    // 导出
    exportData(){
        this.listLoading = true;
        downloadbet(this.form).then(response =>{
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
