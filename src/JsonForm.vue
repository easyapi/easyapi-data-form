<template>
  <div class="json-form">
    <el-table
      :data="renderData"
      highlight-current-row
      @current-change="handleCurrentChange"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'childs', hasChildren: 'hasChildren'}"
      ref="singleTable"
    >
      <el-table-column prop="name" label="参数名称">
        <template slot-scope="scope">
          <el-input style="flex: 1" v-model="scope.row.name" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="参数类型" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择">
            <el-option
              v-for="item in paramType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="参数说明">
        <template slot-scope="scope">
          <el-input v-model="scope.row.description" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="required" label="必填" width="70">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.required"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sample" label="示例">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sample" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="demo" label="默认值">
        <template slot-scope="scope">
          <el-input v-model="scope.row.demo" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="options" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="insertRow(scope)"
            type="text"
            size="small"
            v-if="scope.row.type === 'object' || scope.row.type === 'array'"
          >插入
          </el-button>
          <el-button @click="delRow(scope)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="json-form-tools tools">
      <el-button size="mini" @click="addNew">添加属性</el-button>
      <el-button size="mini" @click="toQuickAdd">快速添加</el-button>

      <el-button size="mini" @click="move(0)">上移</el-button>
      <el-button size="mini" @click="move(1)">下移</el-button>
    </div>
    <el-dialog title="快速添加" :visible.sync="dialogVisible" width="50%">
      <el-input type="textarea" placeholder="请输入内容" v-model="quickText" rows="8" show-word-limit></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmQuickAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "JsonForm",
    data: function () {
      return {
        dialogVisible: false,
        quickText: "",
        // 字段类型
        paramType: [
          {
            value: "double",
            label: "double"
          },
          {
            value: "int",
            label: "int"
          },
          {
            value: "string",
            label: "string"
          },
          {
            value: "boolean",
            label: "boolean"
          },
          {
            value: "byte",
            label: "byte"
          },
          {
            value: "short",
            label: "short"
          },
          {
            value: "long",
            label: "long"
          },
          {
            value: "float",
            label: "float"
          },
          {
            value: "date",
            label: "date"
          },
          {
            value: "datetime",
            label: "datetime"
          },
          {
            value: "object",
            label: "Object"
          },
          {
            value: "array",
            label: "Array"
          }
        ],
        renderData: [],
        quickAddParams: false,
        quickJson: "",

        selectedRow: null
      };
    },
    props: ["jsonData"],
    created() {
      this.renderData = this.jsonData;
    },
    watch: {
      renderData: function () {
        this.$emit("input", this.renderData);
      }
    },
    methods: {
      modelChange: function (item, field, e) {
        let deepIndex = item.deepIndex;
        let target = this.selfRowData;
        deepIndex.forEach((deep, index) => {
          if (index === 0) {
            target = target[deep];
          } else {
            target = target["childs"][deep];
          }
        });
        target[field] = typeof e === "object" ? e.target.value : e;
      },

      // 插入行
      insertRow: function (scope) {
        if (!scope.row.childs) {
          scope.row.childs = [];
        }
        scope.row.childs.push({
          id: +`${scope.row.id}${new Date().getTime()}${Math.random().toFixed(2) *
          100}`,
          name: "",
          type: "int",
          category: null,
          description: "",
          required: false,
          sample: "",
          demo: "",
          childs: []
        });
      },

      // 删除行
      delRow: function (scope) {
        this.delRowItem(scope.row.id);
      },

      delRowItem: function (id) {
        const dealArr = (arr, id) => {
          arr.forEach((el, index) => {
            if (el.id === id) {
              arr.splice(index, 1);
            } else if (el.childs && el.childs.length) {
              dealArr(el.childs, id);
            }
          });
        };
        let tmp = this.renderData;
        dealArr(tmp, id);
        this.renderData = tmp;
      },

      addNew: function () {
        this.renderData.push({
          id: +`${this.renderData.length + 1}${new Date().getTime()}`,
          name: "title",
          type: "string",
          description: "标题",
          required: true,
          sample: "我和我的祖国",
          demo: "",
          childs: []
        });
      },

      // 快速添加
      toQuickAdd: function () {
        this.quickText = "";
        this.dialogVisible = true;
      },

      confirmQuickAdd: function () {
        let _urlParams = [];
        try {
          let jsonData = JSON.parse(this.quickText);
          console.log(jsonData);
          this.parseJson(jsonData, _urlParams);

          const selfRowData = [...this.renderData, ..._urlParams];
          this.renderData = selfRowData;

          this.dialogVisible = false;
        } catch (e) {
          console.log(e);
          this.$message.error("请输入合法的JSON");
        }
      },

      parseJson: function (data, set) {
        let keys = Object.keys(data);
        keys.forEach(key => {
          if (Object.prototype.toString.call(data[key]) === "[object Object]") {
            this.parseJson(data[key], set);
          } else {
            if (typeof data[key] !== "object") {
              set.push({
                id: +`${set.length + 1}${new Date().getTime()}`,

                name: key,
                type: typeof data[key],
                description: "",
                required: false,
                sample: data[key],
                demo: data[key],
                demo: "",
                childs: []
              });
            }
          }
        });
      },

      handleCurrentChange: function (row) {
        this.selectedRow = row;
      },

      move(dir) {
        const changeDir = (arr, index) => {
          if (dir === 0) {
            if (index === 0) return;
            let t = arr[index - 1];
            arr[index - 1] = arr[index];
            arr[index] = t;
          } else {
            if (index === arr.length - 1) return;
            let t = arr[index + 1];
            arr[index + 1] = arr[index];
            arr[index] = t;
          }
        };
        let isChange = false;
        const dealArr = (arr, id) => {
          arr.forEach((el, index) => {
            if (el.id === id && !isChange) {
              changeDir(arr, index);
              isChange = true;
            } else if (el.childs && el.childs.length) {
              dealArr(el.childs, id);
            }
          });
        };
        let tmp = this.renderData;
        dealArr(tmp, this.selectedRow.id);
        this.renderData = tmp;
        this.$refs.singleTable.setCurrentRow();
      },

      exportJSON() {
        function getJson(targets, json) {
          targets.forEach(el => {
            if (el.type === "array") {
              json[el.name] = [];
              pushArray(el.childs, json[el.name]);
            } else if (el.type === "object") {
              json[el.name] = {};
              getJson(el.childs, json[el.name]);
            } else {
              json[el.name] = el.sample;
            }
          });
        }

        function pushArray(targets, arr) {
          targets.forEach(el => {
            if (el.type === "array") {
              let tmpArr = [];
              arr.push(tmpArr);
              pushArray(el.childs, tmpArr);
            } else if (el.type === "object") {
              json[el.name] = {};
              let tmpObj = {};
              arr.push(tmpObj);
              getJson(el.childs, tmpObj);
            } else {
              arr.push(el.sample);
            }
          });
        }

        var json = {};
        getJson(this.renderData, json);
        return json;
      }
    }
  };
</script>

<style lang="less" scoped>
  .tools {
    padding: 8px 10px;
    cursor: pointer;
    border: 1px solid #ddd;
    border-top: none;

    .add {
      display: inline-block;
      margin-right: 20px;

      p {
        display: inline-block;
        color: c-blue;
      }

      &:hover {
        opacity: 0.8;
      }
    }

    .a-icon {
      display: inline-block;
      line-height: 20px;
      font-size: 20px;
      text-align: center;
      color: blue;
      transform: translateY(3px);
    }

    .btn {
      color: #333;
      padding: 2px 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      margin-right: 5px;
    }
  }
</style>


