<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="form.game_code" placeholder="游戏名称">
          <el-option label="全部" value=""></el-option>
        <el-option
          v-for="(item,index) in gamecodelist"
          :key="index"
          :label="item.title"
          :value="item.game_code"
        ></el-option>
      </el-select>

      <el-select v-model="form.lobby_code" placeholder="房间等级">
        <el-option
          v-for="(item,index) in vipGrade"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
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
      <el-table-column align="center" label="游戏名称">
        <template slot-scope="scope">{{ scope.row.game_code_title}}</template>
      </el-table-column>
      <el-table-column align="center" label="最小入场金额">
        <template slot-scope="scope">{{ (+scope.row.min_amount) === 0?'不限制':scope.row.min_amount}}</template>
      </el-table-column>
      <el-table-column align="center" label="最大入场金额">
        <template slot-scope="scope">{{ (+scope.row.max_amount) === 0?'不限制':scope.row.max_amount }}</template>
      </el-table-column>
      <el-table-column align="center" label="最小总投注">
        <template slot-scope="scope">{{ (+scope.row.min_bet) === 0?'不限制':scope.row.min_bet }}</template>
      </el-table-column>
      <el-table-column align="center" label="最大总投注">
        <template slot-scope="scope">{{ (+scope.row.max_bet) === 0?'不限制':scope.row.max_bet}}</template>
      </el-table-column>
      <el-table-column align="center" label="单笔最小投注">
        <template slot-scope="scope">{{ (+scope.row.one_min) === 0?'不限制':scope.row.one_min}}</template>
      </el-table-column>
      <el-table-column align="center" label="单笔最大投注">
        <template slot-scope="scope">{{ (+scope.row.one_max) === 0?'不限制':scope.row.one_max}}</template>
      </el-table-column>
      <el-table-column align="center" label="大厅等级">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            icon="el-icon-edit"
            @click="openRateDialog(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改配置" :visible.sync="rateDialog" width="400px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="最小进入额度" >
          <el-input v-model="formLobby.min_amount" placeholder="最小进入额度(0=不限制)"></el-input>
        </el-form-item>
        <el-form-item label="最大进入额度">
          <el-input v-model="formLobby.max_amount" placeholder="最大进入额度(0=不限制)"></el-input>
        </el-form-item>
        <el-form-item label="当期最小总投注">
          <el-input v-model="formLobby.min_bet" placeholder="当期最小总投注(0=不限制)"></el-input>
        </el-form-item>
        <el-form-item label="当期最大总投注">
          <el-input v-model="formLobby.max_bet" placeholder="当期最大总投注(0=不限制)"></el-input>
        </el-form-item>
        <el-form-item label="单笔最小投注">
          <el-input v-model="formLobby.one_min" placeholder="单笔最小投注(0=不限制)"></el-input>
        </el-form-item>
        <el-form-item label="单笔最大投注">
          <el-input v-model="formLobby.one_max" placeholder="单笔最大投注(0=不限制)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rateDialog = false">取 消</el-button>
        <el-button type="primary" :loading="listLoading" @click="handleRate">确 定</el-button>
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
import { getGameLobby, updateLobby, lobbylist } from "@/api/user";

export default {
  data() {
    return {
      form: {
        game_code: "",
        lobby_code: "",
        page: 1,
        page_size: 20
      },
      list: null,
      total: 0,
      currentpage: "",
      listLoading: true,
      rateDialog: false,
      sigleInfo: "",
      formLobby:{
          id:"",
          min_amount:"",
          max_amount:"",
          min_bet:"",
          max_bet:"",
          one_min:"",
          one_max:""
      },
      vipGrade: [
          {
          value: "",
          label: "全部"
        },
        {
          value: "vip1",
          label: "普通会员厅"
        },
        {
          value: "vip2",
          label: "贵宾会员厅"
        },
        {
          value: "vip3",
          label: "VIP会员厅"
        }
      ],
      gamecodelist: []
    };
  },
  created() {
    this.lobbylist();
    this.fetchData();
  },
  methods: {
    // 获取游戏编码
    lobbylist() {
      lobbylist().then(response => {
        if (response.Status == 200) {
          const { Game_list } = response.Data;
          this.gamecodelist = Game_list;
        }
      });
    },
    // 游戏大厅列表
    fetchData() {
      getGameLobby(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { list, total } = response.Data;
          this.list = list;
          this.total = parseInt(total);
        }
      });
    },
    openRateDialog(row) {
      this.rateDialog = true;
      this.formLobby = {...row};
    //   this.sigleInfo = row;
    },
    // 修改赔率
    handleRate() {
      updateLobby({...this.formLobby}).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          this.rateDialog = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.fetchData();
        }
      });
    },
    // 改变每页显示的条目
    handleSizeChange(val) {
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
