<template>
  <div class="app-container">
    <div class="filter-container">
      <div style="margin-bottom:20px">
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">添加用户</el-button>
      </div>
      <el-input v-model="form.account" placeholder="用户名" style="width:160px"/>
      <el-input v-model="form.agent_name" placeholder="所属代理" style="width:160px"/>
      <!-- <el-select v-model="form.order_by" placeholder="请选择顺序" style="width:160px">
        <el-option label="升序" value="reg_time asc"/>
        <el-option label="降序" value="reg_time desc"/>
      </el-select>-->
      <el-button type="primary" icon="el-icon-search" @click="fetchData" :loading="listLoading">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="fetchData"
    >
      <el-table-column prop="account" align="center" label="用户名">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column prop="amount" align="center" label="用户额度" sortable>
        <template slot-scope="scope">{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column prop="level" align="center" label="用户等级" sortable>
        <template slot-scope="scope">{{ scope.row.level_title }}</template>
      </el-table-column>
      <el-table-column prop="nick_name" align="center" label="用户昵称">
        <template slot-scope="scope">{{ scope.row.nick_name }}</template>
      </el-table-column>
      <el-table-column prop="phone" align="center" label="手机号码">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column prop="real_name" align="center" label="真实姓名">
        <template slot-scope="scope">{{ scope.row.real_name }}</template>
      </el-table-column>
      <el-table-column prop="is_agent" align="center" label="是否代理">
        <template slot-scope="scope">{{ scope.row.is_agent | isagentFilter }}</template>
      </el-table-column>
      <el-table-column prop="title" align="center" label="所属代理">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="is_test" align="center" label="是否测试">
        <template slot-scope="scope">{{ scope.row.is_test | istestFilter }}</template>
      </el-table-column>
      <el-table-column prop="login_ip" align="center" label="登录IP">
        <template slot-scope="scope">{{ scope.row.login_ip }}</template>
      </el-table-column>
      <el-table-column prop="login_time" align="center" label="登录时间" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.login_time }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reg_time" align="center" label="注册时间" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time"/>
          <span>{{ scope.row.reg_time }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">{{ scope.row.status | statusFilter}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="small"
            @click="openUserDialog(scope.row)"
          >编辑信息</el-button>
          <el-button
            type="danger"
            icon="el-icon-edit"
            size="small"
            @click="openAmountDialog(scope.row)"
          >额度调整</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑信息" :visible.sync="userDialog">
      <el-form :model="form" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="sigleData.account"></el-input>
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="sigleData.level" placeholder="请选择">
            <el-option
              v-for="(item,index) in levellist"
              :key="index"
              :label="item.title"
              :value="item.level"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="sigleData.nick_name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="sigleData.pwd"></el-input>
        </el-form-item>
        <el-form-item label="是否代理">
          <el-radio v-model="sigleData.is_agent" label="1">是</el-radio>
          <el-radio v-model="sigleData.is_agent" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="代理名">
          <el-input v-model="sigleData.agent_name"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="sigleData.status" label="1">正常</el-radio>
          <el-radio v-model="sigleData.status" label="-1">删除</el-radio>
          <el-radio v-model="sigleData.status" label="0">锁定</el-radio>
        </el-form-item>
        <el-form-item label="是否测试">
          <el-radio v-model="sigleData.is_test" label="1">是</el-radio>
          <el-radio v-model="sigleData.is_test" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="sigleData.note"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userDialog = false">取 消</el-button>
        <el-button type="primary" @click="exitUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="额度调整" :visible.sync="amountDialog">
      <el-form label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="amountData.account" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="调整金额">
          <el-input v-model="amountData.amount"></el-input>
        </el-form-item>
        <el-form-item label="现金类型">
          <el-radio v-model="amountData.pay_type" label="1">支付</el-radio>
          <el-radio v-model="amountData.pay_type" label="2">出款</el-radio>
          <el-radio v-model="amountData.pay_type" label="3">彩金</el-radio>
          <el-radio v-model="amountData.pay_type" label="5">额度调整</el-radio>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="amountData.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="amountDialog = false">取 消</el-button>
        <el-button type="primary" @click="setAmount">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="addUserDialog">
      <el-form label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="newUser.account" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="newUser.passwd" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="newUser.con_passwd" placeholder="请确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser">确 定</el-button>
      </div>
    </el-dialog>
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
import {
  getuserlist,
  updateuser,
  changeamount,
  adduser,
  levellist
} from "@/api/user";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        "1": "正常",
        "-1": "删除",
        "0": "锁定"
      };
      return statusMap[status];
    },
    isagentFilter(type) {
      const statusMap = {
        "0": "否",
        "1": "是"
      };
      return statusMap[type];
    },
    istestFilter(status) {
      const statusMap = {
        "0": "否",
        "1": "是"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      form: {
        account: "",
        agent_name: "",
        order_by: "reg_time desc",
        page: "",
        page_size: 10
      },
      list: null,
      listLoading: true,
      userDialog: false,
      amountDialog: false,
      addUserDialog: false,
      total: "",
      currentpage: "",
      sigleData: {},
      amountData: {},
      levellist: [],
      newUser: {
        account: "",
        passwd: "",
        con_passwd: ""
      }
    };
  },
  created() {
    this.getlevellist();
    this.fetchData();
  },
  methods: {
    // 获取等级列表
    getlevellist() {
      levellist().then(response => {
        if (response.Status == 200) {
          const { level_list } = response.Data;
          this.levellist = level_list;
        }
      });
    },
    // 获取用户信息列表 ==>排序的时候带过来的obj参数{prop:要排序的字段,order:升序还是降序}
    fetchData(obj) {
      console.log(obj);
      if (obj) {
        this.form.order_by = `${obj.order === "" ? "" : obj.prop}`;
        if (obj.order === "ascending") {
          this.form.order_by += " asc";
        } else if (obj.order === "descending") {
          this.form.order_by += " desc";
        } else {
          this.form.order_by = "";
        }
      }

      this.listLoading = true;
      getuserlist(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { user_list, total } = response.Data;
          this.list = user_list;
          this.total = total;
        }
      });
    },
    openUserDialog(row) {
      this.userDialog = true;
      const {
        account,
        level,
        nick_name,
        is_agent,
        status,
        is_test,
        agent_name,
        note
      } = row;
      this.sigleData = {
        account: account,
        level: level,
        nick_name: nick_name,
        is_agent: is_agent,
        pwd: "",
        status: status,
        is_test: is_test,
        agent_name: agent_name,
        note: note
      };
    },
    // 编辑用户信息
    exitUserInfo() {
      updateuser(this.sigleData).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          this.userDialog = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.fetchData();
        }
      });
    },
    openAmountDialog(row) {
      this.amountDialog = true;
      const { account, amount, pay_type, note } = row;
      this.amountData = {
        account: account,
        amount: amount,
        pay_type: pay_type,
        content: note
      };
    },
    // 额度调整
    setAmount() {
      changeamount(this.amountData).then(response => {
        if (response.Status == 200) {
          this.amountDialog = false;
          this.$message({
            message: response.Msg,
            type: "success"
          });
          this.fetchData();
        }
      });
    },
    openAddDialog() {
      this.addUserDialog = true;
    },
    // 添加用户
    addNewUser() {
      adduser(this.newUser).then(response => {
        if (response.Status == 200) {
          this.addUserDialog = false;
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.fetchData();
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
