<template>
  <div class="json-form">
    <el-table
      :data="renderData"
      :key="tableKey"
      highlight-current-row
      @current-change="handleCurrentChange"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'childs', hasChildren: 'hasChildren' }"
      ref="singleTable"
    >
      <el-table-column prop="name" label="参数名称">
        <template slot-scope="scope">
          <el-input
            style="flex: 1"
            v-if="!scope.row.inArray"
            v-model="scope.row.name"
            placeholder="请输入内容"
          ></el-input>
          <p v-else>{{ `[ Object ]` }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="参数类型" width="120">
        <template slot-scope="scope">
          <el-select
            v-if="!scope.row.inArray"
            v-model="scope.row.type"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in paramType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="参数位置">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.category"
            placeholder="请选择"
          >
            <el-option label="Path" value="Path"> </el-option>
            <el-option label="Query" value="Query"> </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="参数说明">
        <template slot-scope="scope">
          <el-input
            v-if="!scope.row.inArray"
            v-model="scope.row.description"
            placeholder="请输入内容"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="required" label="必填" width="70">
        <template slot-scope="scope">
          <el-checkbox
            v-if="!scope.row.inArray"
            v-model="scope.row.required"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="sample" label="示例">
        <template slot-scope="scope">
          <el-input
            v-if="!scope.row.inArray"
            v-model="scope.row.sample"
            placeholder="请输入内容"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="demo" label="默认值">
        <template slot-scope="scope">
          <el-input
            v-if="!scope.row.inArray"
            v-model="scope.row.demo"
            placeholder="请输入内容"
          ></el-input>
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
          <el-button @click="delRow(scope)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="json-form-tools tools">
      <el-button size="mini" @click="addNew">添加属性</el-button>
      <el-button size="mini" @click="toQuickAdd">快速添加</el-button>

      <el-button size="mini" @click="move(0)">上移</el-button>
      <el-button size="mini" @click="move(1)">下移</el-button>
    </div>

    <el-dialog
      title="快速添加"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="quickText"
        rows="8"
        show-word-limit
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmQuickAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from "sortablejs";
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
          label: "double",
        },
        {
          value: "int",
          label: "int",
        },
        {
          value: "string",
          label: "string",
        },
        {
          value: "boolean",
          label: "boolean",
        },
        {
          value: "byte",
          label: "byte",
        },
        {
          value: "short",
          label: "short",
        },
        {
          value: "long",
          label: "long",
        },
        {
          value: "float",
          label: "float",
        },
        {
          value: "date",
          label: "date",
        },
        {
          value: "datetime",
          label: "datetime",
        },
      ],
      renderData: [],
      renderDataRows: [],
      quickAddParams: false,
      quickJson: "",
      selectedRow: null,
      tableKey: "",
      sortable: null,
    };
  },
  props: ["jsonData", "ifArray", "ifObject"],
  created() {
    this.renderData = this.jsonData;
  },
  mounted() {
    this.initData();
  },
  watch: {
    renderData: {
      handler(newName, oldName) {
        this.$emit("input", this.renderData);
        //将数据设置成一级，用于拖动排序
        this.treeToTile();
      },
      immediate: true,
      deep: true,
    },
    jsonData: function (val) {
      this.renderData = val;
    },
    ifArray: function (val) {
      if (!val) {
        for (let i in this.paramType) {
          if (this.paramType[i].label == "Array") {
            this.paramType.splice(i, 1);
          }
        }
      } else {
        if (this.paramType.filter((x) => x.value == "array").length == 0) {
          this.paramType.push({
            value: "array",
            label: "Array",
          });
        }
      }
    },
    ifObject: function (val) {
      if (!val) {
        for (let i in this.paramType) {
          if (this.paramType[i].label == "Object") {
            this.paramType.splice(i, 1);
          }
        }
      } else {
        if (this.paramType.filter((x) => x.value == "object").length == 0) {
          this.paramType.push({
            value: "object",
            label: "Object",
          });
        }
      }
    },
  },
  methods: {
    //将树状图平铺
    treeToTile() {
      this.renderDataRows = [];
      const expanded = (data) => {
        if (data && data.length > 0) {
          data
            .filter((d) => d)
            .forEach((e) => {
              this.renderDataRows.push(e);
              expanded(e["childs"]);
            });
        }
      };
      expanded(this.renderData);
    },
    initData() {
      if (this.sortable && this.sortable.tbody) {
        this.sortable.destroy();
      }
      this.tableKey = new Date().getTime();
      this.$nextTick(() => {
        this.rowDrop();
      });
    },
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      if (!tbody) {
        return;
      }
      const _this = this;
      this.sortable = Sortable.create(tbody, {
        disabled: false, // 是否开启拖拽
        ghostClass: "sortable-ghost", //拖拽样式
        animation: 150, // 拖拽延时，效果更好看
        // group: { // 是否开启跨表拖拽
        //   pull: false,
        //   put: false
        // },
        // 拖拽移动的时候
        onMove: function ({ dragged, related }) {
          const oldRow = _this.renderDataRows[dragged.rowIndex];
          const newRow = _this.renderDataRows[related.rowIndex];
          // if (
          //   oldRow.level !== newRow.level ||
          //   oldRow.parentId !== newRow.parentId
          // )
          if (oldRow.level !== newRow.level) {
            return false;
          }
        },
        onEnd({ newIndex, oldIndex }) {
          const oldRow = _this.renderDataRows[oldIndex];
          const newRow = _this.renderDataRows[newIndex];

          if (newIndex !== oldIndex && oldRow.level === newRow.level) {
            //递归找到父类的数据
            let renderDataArrNew = [];
            let renderDataArrOld = [];

            if (oldRow.parentId == 0) {
              renderDataArr = _this.renderData;
            } else {
              const expanded = (data) => {
                if (data && data.length > 0) {
                  data
                    .filter((d) => d)
                    .forEach((e) => {
                      if (
                        renderDataArrNew.length > 0 &&
                        renderDataArrOld.length > 0
                      ) {
                        return;
                      }
                      if (e.id == newRow.parentId) {
                        renderDataArrNew = e["childs"];
                      } else if (e.id == oldRow.parentId) {
                        renderDataArrOld = e["childs"];
                      } else {
                        expanded(e["childs"]);
                      }
                    });
                }
              };
              expanded(_this.renderData);
            }
            if (oldRow.parentId === newRow.parentId) {
              renderDataArrOld = renderDataArrNew;
            }

            //根据ID找出树状图的坐标
            let oldIndexTree = renderDataArrOld.findIndex(
              (x) => x.id == oldRow.id
            );
            let newIndexTree = renderDataArrNew.findIndex(
              (x) => x.id == newRow.id
            );

            if (oldRow.parentId !== newRow.parentId) {
              if (oldIndex < newIndex) {
                newIndexTree += 1;
              }
              renderDataArrOld[oldIndexTree].parentId =
                renderDataArrNew[0].parentId;
            }

            const currRow = renderDataArrOld.splice(oldIndexTree, 1)[0];
            renderDataArrNew.splice(newIndexTree, 0, currRow);

            _this.initData();
          }
        },
      });
    },
    // 插入行
    insertRow: function (scope) {
      if (!scope.row.childs) {
        scope.row.childs = [];
      }
      scope.row.childs.push({
        // id: +`${scope.row.id}${new Date().getTime()}${
        //   Math.random().toFixed(2) * 100
        // }`,
        id: +`${scope.row.childs.length + 1}${new Date().getTime()}`,
        name: "",
        type: "int",
        category: 'Query',
        description: "",
        required: false,
        sample: "",
        demo: "",
        childs: [],
        level: scope.row.level + 1,
        parentId: scope.row.id,
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
        name: "",
        type: "string",
        category: 'Query',
        description: "",
        required: true,
        sample: "",
        demo: "",
        childs: [],
        level: 1,
        parentId: 0,
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

        if (Object.prototype.toString.call(jsonData) === "[object Array]") {
          this.parseArray(jsonData, _urlParams);
        }
        if (Object.prototype.toString.call(jsonData) === "[object Object]") {
          this.parseJson(jsonData, _urlParams);
        }

        const selfRowData = [...this.renderData, ..._urlParams];
        this.renderData = selfRowData;

        this.dialogVisible = false;
      } catch (e) {
        console.error(e);
        this.$message.error("请输入合法的JSON");
      }
    },

    parseArray: function (data, set) {
      data.forEach((el) => {
        if (Object.prototype.toString.call(el) === "[object Array]") {
          const obj = {
            id: +`${set.length + 1}${new Date().getTime()}${parseInt(
              Math.random() * 1000
            )}`,
            name: "",
            type: "array",
            description: "",
            required: false,
            sample: "",
            demo: "",
            demo: "",
            childs: [],
          };
          this.parseArray(el, obj.childs);
          set.push(obj);
        } else if (Object.prototype.toString.call(el) === "[object Object]") {
          const obj = {
            id: +`${set.length + 1}${new Date().getTime()}${parseInt(
              Math.random() * 1000
            )}`,
            name: "",
            type: "object",
            description: "",
            required: false,
            sample: "",
            demo: "",
            demo: "",
            childs: [],
            inArray: true,
          };
          this.parseJson(el, obj.childs);
          set.push(obj);
        } else {
          if (typeof el !== "object") {
            set.push({
              id: +`${set.length + 1}${new Date().getTime()}${parseInt(
                Math.random() * 1000
              )}`,
              name: el,
              type: typeof el,
              description: "",
              required: false,
              sample: el,
              demo: el,
              demo: "",
              childs: [],
            });
          }
        }
      });
    },

    parseJson: function (data, set) {
      let keys = Object.keys(data);
      keys.forEach((key) => {
        if (Object.prototype.toString.call(data[key]) === "[object Object]") {
          const obj = {
            id: +`${set.length + 1}${new Date().getTime()}${parseInt(
              Math.random() * 1000
            )}`,
            name: key,
            type: "object",
            description: "",
            required: false,
            sample: "",
            demo: "",
            demo: "",
            childs: [],
          };
          this.parseJson(data[key], obj.childs);
          set.push(obj);
        } else if (
          Object.prototype.toString.call(data[key]) === "[object Array]"
        ) {
          const obj = {
            id: +`${set.length + 1}${new Date().getTime()}${parseInt(
              Math.random() * 1000
            )}`,
            name: key,
            type: "array",
            description: "",
            required: false,
            sample: "",
            demo: "",
            demo: "",
            childs: [],
          };
          this.parseArray(data[key], obj.childs);
          set.push(obj);
        } else {
          if (typeof data[key] !== "object") {
            set.push({
              id: +`${set.length + 1}${new Date().getTime()}${parseInt(
                Math.random() * 1000
              )}`,
              name: key,
              type: typeof data[key],
              description: "",
              required: false,
              sample: data[key],
              demo: data[key],
              demo: "",
              childs: [],
            });
          }
        }
      });
    },

    handleCurrentChange: function (row) {
      this.selectedRow = row;
    },

    move(dir) {
      let curIndex = 0;

      const changeDir = (arr, index) => {
        if (dir === 0) {
          if (index === 0) return;
          let t = arr[index - 1];
          arr[index - 1] = arr[index];
          arr[index] = t;

          curIndex -= 1;
        } else {
          if (index === arr.length - 1) return;
          let t = arr[index + 1];
          arr[index + 1] = arr[index];
          arr[index] = t;

          curIndex += 1;
        }
      };
      let isChange = false;

      const dealArr = (arr, id) => {
        arr.forEach((el, index) => {
          if (!isChange) {
            curIndex += 1;
            if (el.id === id && !isChange) {
              changeDir(arr, index);
              isChange = true;
            } else if (el.childs && el.childs.length) {
              dealArr(el.childs, id);
            }
          }
        });
      };

      if (this.selectedRow.id) {
        const tmp = this.renderData;
        dealArr(tmp, this.selectedRow.id);

        this.renderData = tmp;
        this.$refs.singleTable.setCurrentRow();
        console.log(curIndex);
        // const curDom = this.$refs.singleTable.$el.querySelectorAll('.el-table__row')[curIndex];
        // if(curDom) {
        //   curDom.click();
        // }
      }
    },

    getJSONFormData() {
      return this.renderData;
    },

    exportJSON() {
      function getJson(targets, json) {
        targets.forEach((el) => {
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
        targets.forEach((el) => {
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

      const json = {};
      getJson(this.renderData, json);
      return json;
    },
  },
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
