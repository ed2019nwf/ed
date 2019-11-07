<template>
  <div class="app-container">
    <div style="margin-bottom:20px;">
      <el-button type="primary" icon="el-icon-plus" @click="openActiveDialog">新增活动</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column align="center" label="标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="副标题">
        <template slot-scope="scope">{{ scope.row.sub_title }}</template>
      </el-table-column>
      <el-table-column align="center" label="首页轮播图">
        <template slot-scope="scope">
          <a :href="scope.row.banner_url" target="_blank">{{scope.row.banner_img}}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动图片">
        <template slot-scope="scope">{{ scope.row.list_img }}</template>
      </el-table-column>
      <el-table-column align="center" label="图片跳转链接">
        <template slot-scope="scope">{{ scope.row.banner_url }}</template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      
      
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">{{ scope.row.status === '1'?'开启':'关闭' }}</template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <!-- <template slot-scope="scope">{{ scope.row.sort }}</template> -->
        <template slot-scope="scope">
          <el-button type="edit" icon="el-icon-edit" size="small" @click="handle(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="title" :visible.sync="activeDialog" @close="closeDialog" width="500px">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="form.sub_title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="是否轮播图">
          <el-radio-group v-model="form.is_banner">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="轮播图路径">
          <el-input v-model="form.banner_img" />
        </el-form-item>
        <el-form-item label="轮播图跳转链接">
          <el-input v-model="form.banner_url" />
        </el-form-item>
        <el-form-item label="活动图路径">
          <el-input v-model="form.list_img" />
        </el-form-item>
        <el-form-item label="是否普通活动">
          <el-radio-group v-model="form.is_list">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="'1'">开启</el-radio>
            <el-radio :label="'2'">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" placeholder="0到100，从小到大排列" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="activeDialog = false">取 消</el-button>
        <el-button type="primary" @click="subBtn">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog title="修改" :visible.sync="editDialog">
      <el-form :model="form1">
      <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
      </el-form>
    </el-dialog>-->
  </div>
</template>

<script>
import { getactivelist, addactive, editActive } from "@/api/user";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      form: {
        id:"",
        title: "",
        sub_title: "",
        content: "",
        is_banner: "",
        is_list: "",
        banner_url: "",
        status: "",
        sort: "",
        list_img:""
      },
      title: "",
      fileList: [{ name: "", url: "" }],
      list: null,
      listLoading: true,
      activeDialog: false,
      dialogType: 0
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getactivelist().then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          const { list } = response.Data;
          this.list = list;
        }
      });
    },
    openActiveDialog() {
      this.title = "新增活动";
      this.activeDialog = true;
      this.dialogType = 0;
    },
    subBtn() {
      if (this.dialogType === 0) {
        this.addActive();
      } else {
        this.editActive();
      }
    },
    // 新增活动
    addActive() {
      addactive(this.form).then(response => {
        this.listLoading = false;
        if (response.Status == 200) {
          this.activeDialog = false;
          this.$message({
            message: "增加成功",
            type: "success"
          });
          this.fetchData();
        }
      });
    },
    closeDialog() {
      this.form.title = "";
      this.form.sub_title = "";
      this.form.content = "";
      this.form.is_banner = "";
      this.form.is_list = "";
      this.form.banner_url = "";
      this.form.list_img = "";
      this.form.status = "";
      this.form.sort = "";
    },
    handle(val) {
      this.form = { ...val };
      this.dialogType = 1;
      this.activeDialog = true;
    },
    editActive() {
      editActive({
        title:this.form.title,
        active_id: this.form.id,
        status: this.form.status,
        is_banner: this.form.is_banner,
        is_list: this.form.is_list,
        content: this.form.content,
        banner_img: this.form.banner_img,
        banner_url: this.form.banner_url,
        sub_title: this.form.sub_title,
        list_img: this.form.list_img,
        sort:this.form.sort
      }).then(val => {
        this.activeDialog = false;
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.fetchData();
      });
    }
  }
};
</script>
