<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <el-button type="primary" icon="el-icon-plus" @click="openSigleDialog('','1')">新增支付配置</el-button>
    </div>
    <div class="filter-container">
      <el-select v-model="form.bank_code" placeholder="银行列表">
        <el-option label="全部银行" value></el-option>
        <el-option
          v-for="(item,index) in bankList"
          :key="index"
          :label="item.title"
          :value="item.bank_code"
        />
      </el-select>

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
    <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id}}</template>
      </el-table-column>
      <el-table-column align="center" label="银行">
        <template slot-scope="scope">{{ scope.row.bank_title}}</template>
      </el-table-column>
      <el-table-column align="center" label="持卡人姓名">
        <template slot-scope="scope">{{ scope.row.card_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="卡号">
        <template slot-scope="scope">{{ scope.row.card_number }}</template>
      </el-table-column>
      <el-table-column align="center" label="支行信息">
        <template slot-scope="scope">{{ scope.row.bank_branch }}</template>
      </el-table-column>
      <el-table-column align="center" label="图标地址">
        <template slot-scope="scope">{{ scope.row.img_url }}</template>
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
    <el-dialog title="修改银行" :visible.sync="editPayDialog">
      <el-form :model="form" label-width="120px">
        <el-form-item label="支付渠道编码">
          <el-select v-model="editForm.bank_code" placeholder="银行列表" style="width:100%">
            <el-option
              v-for="(item,index) in bankList"
              :key="index"
              :label="item.title"
              :value="item.bank_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="持卡人">
          <el-input v-model="editForm.card_name" placeholder="持卡人姓名" />
        </el-form-item>
        <el-form-item label="卡号">
          <el-input v-model="editForm.card_number" placeholder="持卡人姓名" />
        </el-form-item>
        <el-form-item label="支行信息">
          <el-input v-model="editForm.bank_branch" placeholder="支行信息" />
        </el-form-item>
        <el-form-item label="图标地址">
          <el-input v-model="editForm.img_url" placeholder="图标地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPayDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlePay" :loading="btnLoading">确 定</el-button>
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
  editpayconf,
  addpayconf,
  getHandConf,
  getBankList,
  editBankList,
  addBankList
} from "@/api/user";

export default {
  filters: {},
  data() {
    return {
      form: {
        bank_code: "",
        page: 1,
        page_size: 10
      },
      editForm: {
        id: "",
        bank_code: "",
        card_name: "",
        card_number: "",
        bank_branch: "",
        img_url: ""
      },
      bankList: [],
      list: null,
      total: 0,
      currentpage: 0,
      paylist: null,
      levellist: null,
      listLoading: true,
      editPayDialog: false,
      sel: "",
      editData: {},
      digId: 0,
      btnLoading: false,
      mark: 0
    };
  },
  created() {
    this.fetchData();
    getBankList().then(res => {
      console.log(res);
      this.bankList = res.Data.bank_list;
    });
  },
  methods: {
    openSigleDialog(row, mark) {
      this.editForm.id = row.id;
      this.editForm.bank_code = row.bank_code;
      this.editForm.card_name = row.card_name;
      this.editForm.card_number = row.card_number;
      this.editForm.bank_branch = row.bank_branch;
      this.editForm.img_url = row.img_url;
      this.editPayDialog = true;
      this.mark = mark;
    },
    // 支付配置列表信息
    fetchData() {
      this.listLoading = true;
      getHandConf(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { list, total } = response.Data;
          this.list = list;
          this.total = total;
        }
      });
    },
    // 修改支付配置
    handlePay() {
      this.editData.class_id = this.sel;
      this.btnLoading = true;
      if (this.mark === 1) {
        
        editBankList({
          id: this.editForm.id,
          bank_code: this.editForm.bank_code,
          card_name: this.editForm.card_name,
          card_number: this.editForm.card_number,
          bank_branch: this.editForm.bank_branch,
          img_url: this.editForm.img_url
        }).then(res => {
          if (res.Status === 200) {
            this.btnLoading = false;
            this.$message.success("修改成功");
            this.fetchData();
            this.editPayDialog = false;
          }
        }).catch(err=>{
          this.btnLoading = false;
        });
      }else{
        addBankList({
          id: this.editForm.id,
          bank_code: this.editForm.bank_code,
          card_name: this.editForm.card_name,
          card_number: this.editForm.card_number,
          bank_branch: this.editForm.bank_branch,
          img_url: this.editForm.img_url
        }).then(res=>{
          if (res.Status === 200) {
            this.btnLoading = false;
            this.$message.success("新增成功");
            this.fetchData();
            this.editPayDialog = false;
          }
        }).catch(err=>{
          this.btnLoading = false;
        })
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
