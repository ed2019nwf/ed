<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <el-button type="primary" icon="el-icon-plus" @click="openSigleDialog('','1')">新增支付配置</el-button>
    </div>
    <div class="filter-container">
      <el-select v-model="form.status" placeholder="显示状态">
        <el-option label="所有用户可见" value="1"/>
        <el-option label="所有用户不可见" value="-1"/>
        <el-option label="指定用户可见" value="2"/>
        <el-option label="指定代理可见" value="3"/>
        <el-option label="指定等级可见" value="4"/>
        <el-option label="测试用户可见" value="9"/>
        <el-option label="可见不可用" value="10"/>
      </el-select>

      <el-select v-model="form.class_type" placeholder="支付类型">
        <el-option label="在线支付" value="online"/>
        <el-option label="手工支付" value="hand"/>
      </el-select>

      <!-- <el-select v-model="form.order_by" placeholder="排序">
        <el-option label="升序" value="sort asc"/>
        <el-option label="降序" value="sort desc"/>
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
      <el-table-column align="center" label="可见会员">
        <template slot-scope="scope">{{ scope.row.user_name ==''?'全部':scope.row.user_name}}</template>
      </el-table-column>
      <el-table-column align="center" label="可见等级">
        <template slot-scope="scope">{{ scope.row.user_level }}</template>
      </el-table-column>
      <el-table-column align="center" label="可见代理">
        <template slot-scope="scope">{{ scope.row.user_agent }}</template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">{{ scope.row.status | stateFilter }}</template>
      </el-table-column>
      <el-table-column align="center" label="支付地址">
        <template slot-scope="scope">{{ scope.row.pay_url }}</template>
      </el-table-column>
      <el-table-column align="center" label="支付ID">
        <template slot-scope="scope">{{ scope.row.pay_id }}</template>
      </el-table-column>
      <el-table-column align="center" label="最大额度">
        <template slot-scope="scope">{{ scope.row.max_amount }}</template>
      </el-table-column>
      <el-table-column align="center" label="最小额度">
        <template slot-scope="scope">{{ scope.row.min_amount }}</template>
      </el-table-column>
      <el-table-column align="center" label="是否固定金额">
        <template slot-scope="scope">{{ scope.row.is_fix | fixFilter}}</template>
      </el-table-column>
      <el-table-column align="center" label="固定金额额度">
        <template slot-scope="scope">{{ scope.row.fix_amount }}</template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">{{ scope.row.create_time }}</template>
      </el-table-column>
      <el-table-column align="center" label="支付类型">
        <template slot-scope="scope">{{ scope.row.class_type | paytypeFilter}}</template>
      </el-table-column>
      <el-table-column align="center" label="支付名称">
        <template slot-scope="scope">{{ scope.row.class_title}}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            icon="el-icon-edit"
            @click="openSigleDialog(scope.row,'2')"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="支付配置" :visible.sync="editPayDialog">
      <el-form :model="form" label-width="120px">
        <el-form-item label="状态">
          <el-select v-model="editData.status" placeholder="请选择">
            <el-option label="所有用户可见" value="1"/>
            <el-option label="所有用户不可见" value="-1"/>
            <el-option label="指定用户可见" value="2"/>
            <el-option label="指定代理可见" value="3"/>
            <el-option label="指定等级可见" value="4"/>
            <el-option label="测试用户可见" value="9"/>
            <el-option label="可见不可用" value="10"/>
          </el-select>
        </el-form-item>
        <el-form-item label="支付渠道编码">
          <el-input v-model="editData.pay_id"></el-input>
        </el-form-item>
        <el-form-item label="支付地址">
          <el-input v-model="editData.pay_url"></el-input>
        </el-form-item>
        <el-form-item label="单笔最低限额">
          <el-input v-model="editData.min_amount"></el-input>
        </el-form-item>
        <el-form-item label="单笔最高限额">
          <el-input v-model="editData.max_amount"></el-input>
        </el-form-item>
        <el-form-item label="网站类型">
          <el-radio v-model="editData.website_type" label="0">PC</el-radio>
          <el-radio v-model="editData.website_type" label="1">H5</el-radio>
        </el-form-item>
        <el-form-item label="支付类型">
          <el-select v-model="sel" placeholder="请选择">
            <el-option
              v-for="(item,index) in paylist"
              :key="index"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否固定金额">
          <el-radio v-model="editData.is_fix" label="0">否</el-radio>
          <el-radio v-model="editData.is_fix" label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="固定金额额度">
          <el-input v-model="editData.fix_amount"></el-input>
        </el-form-item>
        <el-form-item label="规定等级可见">
          <el-input v-model="editData.user_level"></el-input>
        </el-form-item>
        <el-form-item label="规定会员可见">
          <el-input v-model="editData.user_name"></el-input>
        </el-form-item>
        <el-form-item label="规定代理可见">
          <el-input v-model="editData.user_agent"></el-input>
        </el-form-item>
        <el-form-item label="支付名">
          <el-input v-model="editData.note"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="editData.sort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPayDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlePay">确 定</el-button>
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
  getpayconf,
  getPayClass,
  getlevellist,
  editpayconf,
  addpayconf
} from "@/api/user";

export default {
  filters: {
    paytypeFilter(val) {
      const paytypeMap = {
        online: "在线支付",
        hand: "手工支付"
      };
      return paytypeMap[val];
    },
    fixFilter(val){
      const fixMap = {
        '0': "否",
        '1': "是"
      };
      return fixMap[val];
    },
    stateFilter(val){
      const stateMap = {
        '1':'所有用户可见',
        '-1':'所有用户不可见',
        '2':'指定用户可见',
        '3':'指定代理可见',
        '4':'指定等级可见',
        '9':'测试用户可见',
        '10':'可见不可用'
      }
      return stateMap[val];
    }
  },
  data() {
    return {
      form: {
        status: "",
        class_type: "",
        orde_by: "",
        page: "",
        page_size: 10
      },
      list: null,
      total: "",
      currentpage: "",
      paylist: null,
      levellist: null,
      listLoading: true,
      editPayDialog: false,
      sel: "",
      editData: {},
      digId: 0
    };
  },
  created() {
    this.getPayClass();
    this.getlevellist();
    this.fetchData();
  },
  methods: {
    openSigleDialog(row, mark) {
      this.editPayDialog = true;
      this.sel = row.class_id;
      this.digId = mark;
      this.editData = {
        id: row.id,
        status: row.status,
        pay_id: row.pay_id,
        pay_url: row.pay_url,
        min_amount: row.min_amount,
        max_amount: row.max_amount,
        website_type: row.website_type,
        sort: row.sort,
        is_fix: row.is_fix,
        fix_amount: row.fix_amount,
        class_id: this.sel,
        user_level: row.user_level,
        user_name: row.user_name,
        user_agent: row.user_agent,
        note: row.note
      };
    },
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
    // 获取等级列表
    getlevellist() {
      getlevellist().then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { level_list } = response.Data;
          this.levellist = level_list;
        }
      });
    },
    // 支付配置列表信息
    fetchData() {
      this.listLoading = true;
      getpayconf(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { pay_conf,total } = response.Data;
          this.list = pay_conf;
          this.total = total;
        }
      });
    },
    // 新增&&修改支付配置
    handlePay() {
      this.editData.class_id = this.sel;
      // 修改支付配置
      if (this.digId == 2) {
        editpayconf(this.editData).then(response => {
          this.listLoading = false;
          if (response.Status == 200) {
            this.editPayDialog = false;
            this.$message({
              message:'修改成功',
              type:'success'
            })
            this.fetchData();
          }
        });
      } else {
        // 新增支付配置
        addpayconf(this.editData).then(response => {
          this.listLoading = false;
          if (response.Status == 200) {
            this.editPayDialog = false;
            this.$message({
              message:'增加成功',
              type:'success'
            })
            this.fetchData();
          }
        });
      }
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
