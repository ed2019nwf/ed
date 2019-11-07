<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
    <el-button type="primary" icon="el-icon-plus" @click="openaddleveldialog()">新增用户等级</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">{{ scope.row.level }}</template>
      </el-table-column>
      <el-table-column align="center" label="会员名称">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="small" icon="el-icon-edit" @click="openVipDialog(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增等级弹框 -->
    <el-dialog title="新增用户等级" :visible.sync="addlevelDialog">
      <el-form :model="form" label-width="120px">
          <el-form-item label="会员等级">
               <el-input v-model="form.level"></el-input>
          </el-form-item>
          <el-form-item label="会员名称">
               <el-input v-model="form.title"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addlevelDialog = false">取 消</el-button>
        <el-button type="primary" @click="addlevel">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改等级弹框 -->
    <el-dialog title="修改用户等级" :visible.sync="levelDialog">
      <el-form :model="form" label-width="120px">
          <!-- <el-form-item label="会员等级">
               <el-input v-model="form.level"></el-input>
          </el-form-item> -->
          <el-form-item label="会员名称">
               <el-input v-model="form.title"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="levelDialog = false">取 消</el-button>
        <el-button type="primary" @click="editlevel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getlevellist ,editlevel , addlevel } from "@/api/user";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      levelDialog: false,
      addlevelDialog: false,
      form:{
          title:"",
          level:""
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    openaddleveldialog(){
       this.addlevelDialog = true;
    },
    openVipDialog(row) {
      this.levelDialog = true;
      this.form = row;
    },
    // 用户等级列表
    fetchData() {
      getlevellist().then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { level_list } = response.Data;
          this.list = level_list;
        }
      })
    },
    // 修改用户等级
    editlevel(){
      let params = {
        level_id:this.form.id,
        title:this.form.title
      }
      editlevel(params).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
           this.levelDialog = false;
           this.$message({
            message:'修改成功',
            type:'success'
          })
           this.fetchData();
        }
      })
    },
    // 新增用户等级
    addlevel(){
      let params = {
        level:this.form.level,
        title:this.form.title
      }
      addlevel(params).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
           this.addlevelDialog = false;
           this.$message({
            message:'增加成功',
            type:'success'
          })
           this.fetchData();
        }
      })
    }
  }
};
</script>
