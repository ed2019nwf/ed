<template>
  <div class="app-container">
    <div class="filter-container">
        <el-select v-model="form.game_code" placeholder="游戏名称">
            <el-option v-for="(item,index) in gamecodelist" :key="index" :label="item.title" :value="item.game_code"></el-option>
        </el-select>
        <el-date-picker
          v-model="form.start_time"
          value-format="yyyy-MM-dd 00:00:00"
          type="date"
          placeholder="开始时间"
          style="width:160px"
        />
        <span class="line">-</span>
        <el-date-picker
          v-model="form.end_time"
          value-format="yyyy-MM-dd 00:00:00"
          type="date"
          placeholder="结束时间"
          style="width:160px"
        />
        <!-- <el-select v-model="form.order_by" placeholder="排序" style="width:160px">
          <el-option label="升序" value="issue asc"/>
          <el-option label="降序" value="issue desc"/>
        </el-select> -->
      <el-button type="primary" icon="el-icon-search" :loading="listLoading" @click="fetchData">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="游戏名称">
        <template slot-scope="scope">{{ scope.row.game_title }}</template>
      </el-table-column>
      <el-table-column align="center" label="期号">
        <template slot-scope="scope">{{ scope.row.issue }}</template>
      </el-table-column>
      <el-table-column label="开始时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="开奖结果">
        <template slot-scope="scope">{{ scope.row.result_code }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" icon="el-icon-edit" @click="openIssueDialog(scope.row)">修改开奖结果</el-button>
        </template> 
      </el-table-column>
    </el-table>
    <el-dialog title="修改开奖结果" :visible.sync="issueDialog">
      <el-form :model="form" label-width="120px">
          <el-form-item label="游戏名称">
               <el-input v-model="sigleInfo.game_title"></el-input>
          </el-form-item>
          <el-form-item label="期号">
               <el-input v-model="sigleInfo.issue"></el-input>
          </el-form-item>
          <el-form-item label="开奖结果">
               <el-input v-model="sigleInfo.result_code"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="issueDialog = false">取 消</el-button>
        <el-button type="primary" @click="setIssueNum">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination
      v-show="total>form.page_size"
      background
      layout="total,prev, pager, next,sizes,jumper"
      :page-size="form.page_size"
      @size-change="handleSizeChange"
      :page-sizes="[20, 50, 100, 200]"
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
import { getissuelist,updateresult,lobbylist } from "@/api/user";

export default {
  data() {
    return {
      form: {
        game_code: "",
        start_time: "",
        end_time: "",
        order_by: "",
        page: "",
        page_size: 15
      },
      list: null,
      total: "",
      currentpage: "",
      listLoading: true,
      issueDialog:false,
      sigleInfo:'',
      gamecodelist:''
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
    fetchData() {
      this.listLoading = true;
      getissuelist(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { issue_list,total } = response.Data;
          this.list = issue_list;
          this.total = total;
        }
      });
    },
    openIssueDialog(row){
        this.issueDialog = true;
        this.sigleInfo = row;
    },
    // 修改开奖
    setIssueNum(){
        let params ={
          issue_id:this.sigleInfo.id,
          result_code:this.sigleInfo.result_code
        }
        updateresult(params).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
            this.issueDialog = false;
            this.$message({
              message:'修改成功',
              type:'success'
            })
            this.fetchData();
        }
      });
    },
    // 改变每页显示的条目
    handleSizeChange(val){
      this.form.page_size = val;
      this.fetchData();
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
