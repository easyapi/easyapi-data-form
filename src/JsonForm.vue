<template>
  <div :class="`${jsonClass} data-form`">
    <el-table
      v-if="!ifEdit"
      :data="renderData"
      :key="tableKey"
      @current-change="handleCurrentChange"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'childs', hasChildren: 'hasChildren' }"
      ref="singleTable"
      size="small"
      class="data-form-container"
    >
      <el-table-column prop="name" label="参数名">
        <template slot-scope="scope">
          <easyapi-env-input
            v-if="!scope.row.inArray"
            style="width: 100%"
            :disabled="
              (scope.row.level === 1 && haveRoot) || parameter == 'path'
            "
            v-model="scope.row.name"
            placeholder="参数名"
            :aggregateEnvs="aggregateEnvs"
            @input="addTable"
          />
          <p v-else>{{ `[ Object ]` }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template slot-scope="scope">
          <el-select
            size="small"
            @change="typeChanged(scope.row)"
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
      <el-table-column prop="description" label="说明">
        <template slot-scope="scope">
          <easyapi-env-input
            v-if="!scope.row.inArray"
            style="width: 100%"
            v-model="scope.row.description"
            placeholder="参数说明"
            :aggregateEnvs="aggregateEnvs"
            @input="addTable"
          />
        </template>
      </el-table-column>
      <el-table-column prop="required" label="必填" width="70">
        <template slot-scope="scope">
          <el-checkbox
            size="small"
            :disabled="parameter == 'path'"
            v-if="!scope.row.inArray"
            v-model="scope.row.required"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="demo" label="示例">
        <template slot-scope="scope">
          <el-input-number
            style="width: 100%"
            v-if="scope.row.type == 'int' && !scope.row.inArray"
            controls-position="right"
            v-model="scope.row.demo"
            placeholder="参数示例"
            :disabled="scope.row.type == 'object' || scope.row.type == 'array'"
            size="small"
          ></el-input-number>
          <el-select
            v-model="scope.row.demo"
            v-if="scope.row.type == 'boolean' && !scope.row.inArray"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <easyapi-env-input
            v-if="
              scope.row.type != 'int' &&
              scope.row.type != 'boolean' &&
              !scope.row.inArray
            "
            style="width: 100%"
            v-model="scope.row.demo"
            :disabled="scope.row.type == 'object' || scope.row.type == 'array'"
            placeholder="参数示例"
            :aggregateEnvs="aggregateEnvs"
            @input="addTable"
          />
        </template>
      </el-table-column>
      <el-table-column prop="defaultValue" label="默认值">
        <template slot-scope="scope">
          <el-input-number
            style="width: 100%"
            v-if="scope.row.type == 'int' && !scope.row.inArray"
            controls-position="right"
            v-model="scope.row.defaultValue"
            placeholder="参数示例"
            :disabled="scope.row.type == 'object' || scope.row.type == 'array'"
            size="small"
          ></el-input-number>
          <el-select
            v-model="scope.row.defaultValue"
            v-if="scope.row.type == 'boolean' && !scope.row.inArray"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <easyapi-env-input
            v-if="
              scope.row.type != 'int' &&
              scope.row.type != 'boolean' &&
              !scope.row.inArray
            "
            style="width: 100%"
            v-model="scope.row.defaultValue"
            :disabled="scope.row.type == 'object' || scope.row.type == 'array'"
            placeholder="参数默认值"
            :aggregateEnvs="aggregateEnvs"
            @input="addTable"
          />
        </template>
      </el-table-column>
      <el-table-column prop="options" width="100" align="right">
        <template slot="header">
          <div class="setting-edit" @click="gotoEdit">批量修改</div>
        </template>
        <template slot-scope="scope">
          <el-button
            @click="insertRow(scope)"
            type="text"
            size="small"
            v-if="scope.row.type === 'object' || scope.row.type === 'array'"
            style="margin-right: 10px"
            >插入
          </el-button>
          <i
            v-if="
              scope.row.level !== 1 ||
              (!haveRoot && scope.$index != renderData.length - 1)
            "
            @click="delRow(scope)"
            class="el-icon-delete"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="bulk-edit" v-if="ifEdit">
      <div class="bulk-edit_header">
        <div class="format-explain">
          格式：参数名,类型,说明,必填,示例值,默认值
        </div>
        <div>
          <el-button size="mini" type="primary" @click="confirmEdit"
            >确认
          </el-button>
          <el-button size="mini" @click="ifEdit = false">取消</el-button>
        </div>
      </div>
      <el-input
        :autosize="{ minRows: 4 }"
        type="textarea"
        v-model="renderValue"
      >
      </el-input>
      <div class="bulk-edit_footer">
        字段之间以英文逗号(,)分隔，多条记录以换行分隔
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import { fillId } from "./utils/fill";

export default {
  name: "JsonForm",
  data: function () {
    return {
      // 字段类型
      ifEdit: false,
      options: [
        {
          value: "true",
          label: "true",
        },
        {
          value: "false",
          label: "false",
        },
        {
          value: "null",
          label: "null",
        },
      ],
      paramType: [
        {
          value: "string",
          label: "string",
        },
        {
          value: "int",
          label: "int",
        },
        {
          value: "boolean",
          label: "boolean",
        },
        {
          value: "double",
          label: "double",
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
      renderValue: "",
    };
  },
  props: [
    "jsonData",
    "ifArray",
    "type",
    "ifObject",
    "haveRoot",
    "aggregateEnvs",
    "jsonClass",
    "parameter",
  ],
  created() {
    this.initViewData();
  },
  mounted() {
    this.initData();
  },
  watch: {
    renderData: {
      handler(newName, oldName) {
        // console.log(newName, oldName);
        this.$emit("input", this.renderData);
        //将数据设置成一级，用于拖动排序
        this.treeToTile();
      },
      immediate: true,
      deep: true,
    },
    jsonData: function (val) {
      // this.renderData = val;
      this.initViewData();
    },

    ifArray: function (val) {
      this.initViewData();
    },
    ifObject: function (val) {
      this.initViewData();
    },
    haveRoot: function (val) {
      this.initViewData();
    },
  },

  methods: {
    gotoEdit() {
      this.ifEdit = true;
      if (!this.haveRoot) {
        let data = this.renderData.filter(
          (x) =>
            x.name != "" ||
            x.description != "" ||
            x.demo != "" ||
            x.defaultValue != ""
        );
        let str = "";
        data.forEach((item) => {
          str += `${item.name},${item.type},${item.description},${item.required},${item.demo},${item.defaultValue}\n`;
        });
        this.renderValue = str;
        return;
      } else {
        let arr = [];
        let num = 0;
        this.getStr(this.renderData[0], arr, num);
        let str = "";
        arr.map((item) => {
          str += `${item}\n`;
        });
        this.renderValue = str;
      }
    },

    getStr(v, arr, num) {
      if (v.childs.length > 0) {
        let symbol = "";
        for (var i = 0; i < num; i++) {
          symbol += ">";
        }
        v.childs.forEach((item, index) => {
          if (num == 0) {
            arr.push(
              `${item.name},${item.type},${item.description},${item.required},${item.demo},${item.defaultValue}`
            );
          } else {
            arr.push(
              `${symbol} ${item.name},${item.type},${item.description},${item.required},${item.demo},${item.defaultValue}`
            );
          }
          this.getStr(item, arr, Number(num + 1));
        });
      }
    },

    getValue(v, arr, level) {
      console.log(v, arr, level);
    },

    confirmEdit() {
      if (!this.haveRoot) {
        this.renderData.splice(0, this.renderData.length);
        let data = this.renderValue.split("\n");
        data.forEach((item) => {
          if (item != "") {
            this.renderData.splice(this.renderData.length, 0, {
              id: +`${this.renderData.length + 1}${new Date().getTime()}`,
              name: item.split(",")[0],
              type: item.split(",")[1],
              description: item.split(",")[2],
              required: item.split(",")[3] == "false" ? false : true,
              demo: item.split(",")[4],
              defaultValue: item.split(",")[5],
              childs: [],
              level: 1,
              parentId: 0,
            });
          }
        });
      } else {
        // this.renderData[0].childs.splice(0, this.renderData.length);
        // let data = this.renderValue.split("\n");
        // let arr = [];
        // data.forEach((item) => {
        //   if (item.indexOf(">") != -1) {
        //     arr.push(item.split(" ")[0].length);
        //   }
        // });
        // let maxLevel = Math.max(...arr);
        // this.getValue(this.renderData[0].childs, data, maxLevel);
      }
      this.ifEdit = false;
    },

    typeChanged(value) {
      if (value.type !== "object" && value.type !== "array") {
        value.childs = [];
      }
      if (value.type == "int") {
        value.demo = 1;
        value.defaultValue = 1;
      }
      if (value.type == "boolean") {
        value.demo = "null";
        value.defaultValue = "null";
      }
    },

    initViewData() {
      if (this.haveRoot) {
        //如果是根节点，那么只显示一个数据
        if (this.jsonData && this.jsonData.length > 0) {
        } else {
          //给一个默认的值
          this.jsonData.push({
            id: 1,
            name: "根节点",
            type: "object",
            description: "",
            required: false,
            demo: "",
            defaultValue: "",
            childs: [],
            level: 1,
            parentId: 0,
          });
        }
        this.renderData = fillId([this.jsonData[0]]);
      } else {
        this.renderData = fillId(this.jsonData);
        if (this.renderData.length == 0 && this.parameter !== "path") {
          this.addNew();
        }

        if (
          (this.renderData.length > 0 &&
            this.renderData[this.renderData.length - 1].name != "") ||
          this.renderData[this.renderData.length - 1].description != "" ||
          this.renderData[this.renderData.length - 1].defaultValue != "" ||
          (this.renderData[this.renderData.length - 1].demo != "" &&
            this.parameter !== "path")
        ) {
          this.addNew();
        }
      }

      //初始化object
      if (!this.ifObject) {
        for (let i in this.paramType) {
          if (this.paramType[i].label === "object") {
            this.paramType.splice(i, 1);
          }
        }
      } else {
        if (this.paramType.filter((x) => x.value === "object").length === 0) {
          this.paramType.push({
            value: "object",
            label: "object",
          });
        }
      }
      //初始化array
      if (!this.ifArray) {
        for (let i in this.paramType) {
          if (this.paramType[i].label === "array") {
            this.paramType.splice(i, 1);
          }
        }
      } else {
        if (this.paramType.filter((x) => x.value === "array").length === 0) {
          this.paramType.push({
            value: "array",
            label: "array",
          });
        }
      }
      //初始化file
      if (this.type && this.type === "form-data") {
        if (this.paramType.filter((x) => x.value === "array").length === 0) {
          if (this.paramType.filter((x) => x.value === "file").length === 0) {
            this.paramType.push({
              value: "file",
              label: "file",
            });
          }
        }
      } else {
        for (let i in this.paramType) {
          if (this.paramType[i].label === "file") {
            this.paramType.splice(i, 1);
          }
        }
      }
    },
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
      const tbody = document.querySelector(
        `.${this.jsonClass} .el-table__body-wrapper tbody`
      );
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

            if (oldRow.parentId === 0) {
              renderDataArrNew = _this.renderData;
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
                      if (e.id === newRow.parentId) {
                        renderDataArrNew = e["childs"];
                      } else if (e.id === oldRow.parentId) {
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
              (x) => x.id === oldRow.id
            );
            let newIndexTree = renderDataArrNew.findIndex(
              (x) => x.id === newRow.id
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
        type: "string",
        description: "",
        required: this.parameter == "path" ? true : false,
        demo: "",
        defaultValue: "",
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

    addTable() {
      if (this.haveRoot) return;
      let item = this.renderData;
      let length = this.renderData.length - 1;
      if (
        item[length].name != "" ||
        item[length].description != "" ||
        item[length].demo != "" ||
        item[length].defaultValue != ""
      ) {
        this.addNew();
      }
    },

    // 添加行
    addNew: function () {
      this.renderData.push({
        id: +`${this.renderData.length + 1}${new Date().getTime()}`,
        name: "",
        type: "string",
        description: "",
        required: this.parameter == "path" ? true : false,
        demo: "",
        defaultValue: "",
        childs: [],
        level: 1,
        parentId: 0,
      });
    },

    confirmQuickAdd: function (type, quickText) {
      if (type == "JSON") {
        let _urlParams = [];
        try {
          let jsonData = JSON.parse(quickText);
          if (Object.prototype.toString.call(jsonData) === "[object Array]") {
            this.parseArray(jsonData, _urlParams);
          }
          if (Object.prototype.toString.call(jsonData) === "[object Object]") {
            this.parseJson(jsonData, _urlParams);
          }
          for (let item of _urlParams) {
            if (!this.haveRoot) {
              this.renderData.splice(this.renderData.length - 1, 0, item);
            } else {
              this.renderData[0].childs.push(item);
            }
          }
          // this.renderData = [...this.renderData, ..._urlParams];
        } catch (e) {
          this.$message.error("请输入合法的JSON");
        }
      } else if (type == "URL") {
        try {
          let data = quickText.split("?")[1].split("&");
          for (let item of data) {
            if (!this.haveRoot) {
              this.renderData.splice(this.renderData.length - 1, 0, {
                id: +`${this.renderData.length + 1}${new Date().getTime()}`,
                name: item.split("=")[0],
                type: "string",
                category: "Query",
                description: "",
                required: false,
                demo: item.split("=")[1],
                defaultValue: "",
                childs: [],
                level: 1,
                parentId: 0,
              });
            } else {
              this.renderData[0].childs.push({
                id: +`${
                  this.renderData[0].childs.length + 1
                }${new Date().getTime()}`,
                name: item.split("=")[0],
                type: "string",
                category: "Query",
                description: "",
                required: false,
                demo: item.split("=")[1],
                defaultValue: "",
                childs: [],
                level: this.renderData[0].childs.length + 1,
                parentId: 0,
              });
            }
          }
        } catch (e) {
          this.$message.error("请输入合法的URL");
        }
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
            demo: "",
            defaultValue: "",
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
            demo: "",
            defaultValue: "",
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
              demo: el,
              defaultValue: el,
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
            demo: "",
            defaultValue: "",
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
            demo: "",
            defaultValue: "",
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
              demo: data[key],
              defaultValue: data[key],
              childs: [],
            });
          }
        }
      });
    },

    handleCurrentChange: function (row) {
      this.selectedRow = row;
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
            json[el.name] = el.demo;
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
            arr.push(el.demo);
          }
        });
      }

      const json = {};
      getJson(this.renderData, json);
      return json;
    },
    importJSON: function (json) {
      //如果是数组，只显示第一个
      if (json.constructor === Array) {
        json = [json[0]];
      }
      //加上根节点
      let newData = {
        根节点: json,
      };
      this.treeToTile();
      this.renderData = fillId(this.jsonParse(newData));
    },

    jsonParse: function (jsonStr) {
      if (!jsonStr || jsonStr.length == 0) {
        return [];
      }
      const parseJson = (json) => {
        let result = [];
        let keys = Object.keys(json);
        keys.forEach((k, index) => {
          let val = json[k];
          let parsedVal = val;

          if (this.getType(val) === "object") {
            parsedVal = parseJson(val);
          } else if (this.getType(val) === "array") {
            parsedVal = parseArray([val[0]]);
          }

          let opt = {
            name: k,
            type: this.getType(val),
            defaultValue: "",
            description:
              this.renderDataRows.filter((x) => x.name == k).length > 0
                ? this.renderDataRows.filter((x) => x.name == k)[0].description
                : "",
          };

          if (opt.type === "array" || opt.type === "object") {
            opt.childs = parsedVal;
            opt.demo = "";
          } else {
            opt.childs = null;
            opt.demo = parsedVal + "";
          }

          result.push(opt);
        });
        return result;
      };

      //
      const parseArray = (arrayObj) => {
        const result = [];
        for (let i = 0; i < arrayObj.length; ++i) {
          let val = arrayObj[i];
          let parsedVal = val;
          if (this.getType(val) === "object") {
            parsedVal = parseJson(val);
          } else if (this.getType(val) === "array") {
            parsedVal = parseArray([val[0]]);
          }

          let opt = {
            // name: null,3
            name: val,
            type: this.getType(val),
            defaultValue: "",
            description:
              this.renderDataRows.filter((x) => x.name == val).length > 0
                ? this.renderDataRows.filter((x) => x.name == val)[0]
                    .description
                : "",
          };

          if (opt.type === "array" || opt.type === "object") {
            opt.childs = parsedVal;
            opt.demo = "";
          } else {
            opt.childs = null;
            opt.demo = parsedVal;
          }

          result.push(opt);
        }
        return result;
      };

      // --
      const parseBody = (json) => {
        return parseJson(json);
      };

      return parseBody(jsonStr);
    },

    getType: function (obj) {
      switch (Object.prototype.toString.call(obj)) {
        case "[object Array]":
          return "array";
          break;
        case "[object Object]":
          return "object";
          break;
        case "[object Number]":
          return obj % 1 === 0 ? "int" : "double";
        case "[object Null]":
        case "[object Function]":
        case "[object Undefined]":
          return "string";
          break;
        default:
          return typeof obj;
          break;
      }
    },
  },
};
</script>

<style lang="less">
.data-form-container {
  .el-table__row td:nth-of-type(6) {
    border-right: none !important;
  }

  thead th:nth-of-type(6) {
    border-right: none !important;
  }

  .setting-edit {
    display: inline-block;
    text-align: right;
    color: #00b2c8;
    cursor: pointer;

    &:hover {
      color: #00b2c8cc;
    }
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #00b2c8;
    border-color: #00b2c8;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
}

.bulk-edit .el-textarea__inner {
  border-radius: 0;
  border-color: #ebeef5;
}
</style>
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

.el-icon-delete {
  font-size: 18px;
  cursor: pointer;
}

.bulk-edit {
  width: 100%;

  .bulk-edit_header {
    padding: 0 10px;
    height: 40px;
    border: 1px solid #ebeef5;
    border-bottom: none;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .format-explain {
      color: #909399;
      font-weight: 550;
    }
  }

  .bulk-edit_footer {
    padding: 0 10px;
    height: 30px;
    border: 1px solid #ebeef5;
    border-top: none;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #909399;
    font-weight: 550;
  }
}
</style>
