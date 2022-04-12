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
          :data="struct"
          border
          @selection-change="handleSelectionChange"
          :header-cell-style="{ background: '#f5f5f5', fontSize: '12px' }"
          tooltip-effect="dark"
          ref="multipleTable"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="类型" prop="type">
            <template>
              <span>JSON</span>
            </template>
          </el-table-column>
          <el-table-column label="数据结构名称" prop="name"> </el-table-column>
          <el-table-column label="描述" prop="description"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="openDetailModal(scope.row)"
              >
                查看详情
              </el-button>
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
            v-if="innerVisible"
            :data="structInfo"
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
import { fillId } from "../utils/fill";
export default {
  props: ["visible", "struct"],
  data() {
    return {
      innerVisible: false,
      selectData: [],
      structInfo: [],
    };
  },
  methods: {
    openDetailModal(row) {
      this.innerVisible = true;
      this.structInfo = fillId(row.fields);
    },
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
      if (this.selectData.length > 1) {
        this.$message.warning("当前限制选择 1 数据结构");
        return;
      }
      this.handleClose();
      this.$parent.getDataStructure(this.selectData);
      this.$refs.multipleTable.clearSelection();
    },
  },
};
</script>

<style lang="scss"></style>
