<template>
  <div>
    <el-dialog
      width="50%"
      :before-close="handleClose"
      title="引用数据结构"
      :visible.sync="visible"
      :append-to-body="true"
    >
      <div>
        <el-table
          :data="data"
          border
          @selection-change="handleSelectionChange"
          :header-cell-style="{ background: '#f5f5f5', fontSize: '12px' }"
          tooltip-effect="dark"
          ref="multipleTable"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="类型" prop="type"> </el-table-column>
          <el-table-column label="数据结构名称" prop="name"> </el-table-column>
          <el-table-column label="描述" prop="description"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="innerVisible = true"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        width="70%"
        title="数据结构"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div>
          <el-table
            :data="dataInfo"
            style="width: 100%; margin-bottom: 20px"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'childs', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="name" label="参数名" width="180">
            </el-table-column>
            <el-table-column prop="type" label="类型" width="180">
            </el-table-column>
            <el-table-column label="必填">
              <template slot-scope="scope">
                <span>{{ scope.row.required ? "是" : "否" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="说明"> </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["visible"],
  data() {
    return {
      innerVisible: false,
      selectData: [],
      dataInfo: [
        {
          id: 1,
          name: "login_info",
          type: "object",
          description: "用户登录信息",
          required: true,
          demo: "",
          defaultValue: "",
          mock: "",
          childs: [
            {
              id: 10,
              name: "user_name",
              type: "string",
              description: "用户名",
              required: true,
              demo: "",
              defaultValue: "",
              mock: "",
            },
            {
              id: 11,
              name: "user_password",
              type: "string",
              description: "密码",
              required: true,
              demo: "",
              defaultValue: "",
              mock: "",
            },
          ],
        },
      ],
      data: [
        {
          type: "JSON",
          name: "user_info",
          description: "用户信息",
        },
        {
          type: "JSON",
          name: "user_info",
          description: "用户信息",
        },
      ],
    };
  },
  methods: {
    /**
     * 关闭
     */
    handleClose() {
      this.$emit("update:visible", false);
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    /**
     * 确认
     */
    submit() {
      if (this.selectData.length == 0) {
        this.$message.warning("请选择数据结构");
        return;
      }
      this.handleClose();
    },
  },
};
</script>

<style lang="scss"></style>
