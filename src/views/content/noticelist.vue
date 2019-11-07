<template>
  <div class="app-container">
    <div style="margin-bottom:10px;">
      <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">新增数据</el-button>
    </div>
    <div class="filter-container">
      <el-select v-model="form.show_type" placeholder="数据类型" style="width:160px">
        <el-option label="全部" value="0" />
        <el-option label="排行榜" value="1" />
        <el-option label="通知" value="2" />
      </el-select>
      <el-select v-model="form.status" placeholder="显示状态" style="width:160px">
        <el-option label="所有" value="0" />
        <el-option label="所有用户可见" value="1" />
        <el-option label="指定用户可见" value="2" />
        <el-option label="不可见" value="3" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
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
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="副标题">
        <template slot-scope="scope">{{ scope.row.sub_title }}</template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column align="center" label="数据类型">
        <template slot-scope="scope">{{ scope.row.show_type | typeFilter }}</template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">{{ scope.row.status | statusFilter }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="edit" icon="el-icon-edit" size="small" @click="handle(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改公告" :visible.sync="editNoticeDialog">
      <el-form label-width="120px">
        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="所有用户可见" value="1" />
            <el-option label="指定用户可见" value="2" />
            <el-option label="不可见" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editNoticeDialog = false">取 消</el-button>
        <el-button type="primary" @click="editNotice">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增数据" :visible.sync="addNoticeDialog">
      <el-form :model="form" label-width="120px">
        <el-form-item label="状态">
          <el-select v-model="sigleInfo.status" placeholder="请选择">
            <el-option label="所有用户可见" value="1" />
            <el-option label="指定用户可见" value="2" />
            <el-option label="不可见" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" v-if="sigleInfo.status==2">
          <el-input v-model="sigleInfo.account"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="sigleInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="sigleInfo.sub_title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="sigleInfo.content"></el-input>
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="sigleInfo.show_type" placeholder="请选择">
            <el-option label="排行榜" value="1" />
            <el-option label="通知" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addNoticeDialog = false">取 消</el-button>
        <el-button type="primary" @click="addNotice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getnoticelist, addnotice, editNotice } from "@/api/user";

export default {
  data() {
    return {
      form: {
        show_type: "",
        status: "",
        page: "",
        page_size: ""
      },
      sigleInfo: {
        account: "",
        title: "",
        sub_title: "",
        content: "",
        show_type: "",
        status: ""
      },
      editForm: {
        show_id: "",
        status: ""
      },
      list: null,
      listLoading: false,
      addNoticeDialog: false,
      editNoticeDialog: false
    };
  },
  created() {
    this.fetchData();
  },
  filters: {
    typeFilter(type) {
      const typeMap = {
        "1": "排行榜",
        "2": "通知"
      };
      return typeMap[type];
    },
    statusFilter(state) {
      const stateMap = {
        "1": "所有用户可见",
        "2": "指定用户可见",
        "3": "不可见"
      };
      return stateMap[state];
    }
  },
  methods: {
    fetchData() {
      getnoticelist(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { list } = response.Data;
          this.list = list;
        }
      });
    },
    openAddDialog(row) {
      this.addNoticeDialog = true;
    },
    // 新增公告信息
    addNotice() {
      addnotice(this.sigleInfo).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          this.$message({
            message: "增加成功",
            type: "success"
          });
          this.fetchData();
          this.addNoticeDialog = false;
        }
      });
    },
    //修改
    handle(val) {
      this.editForm.show_id = val.id;
      this.editForm.status = val.status;
      this.editNoticeDialog = true;
    },
    editNotice() {
      editNotice({
        show_id: this.editForm.show_id,
        status: this.editForm.status
      }).then(val => {
        this.$message({
            message: "修改成功",
            type: "success"
          });
          this.fetchData();
          this.editNoticeDialog = false;
      });
    }
  }
};
</script>
