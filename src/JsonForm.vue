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
      :span-method="objectSpanMethod"
      ref="singleTable"
      size="small"
      class="data-form-container"
      :style="{ fontSize: fontSize + 'px' }"
    >
      <el-table-column width="40" v-if="!haveRoot && !ifStruct">
        <template slot-scope="scope">
          <i
            v-if="scope.$index != renderData.length - 1 || parameter == 'path'"
            class="el-icon-s-operation"
          ></i>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="参数名">
        <template slot-scope="scope">
          <easyapi-env-input
            v-if="!scope.row.inArray"
            :disabled="
              (scope.row.name == '根节点' && haveRoot) ||
              parameter == 'path' ||
              (scope.row.name && scope.row.name.indexOf('[0]') != -1) ||
              scope.row.ifStruct
                ? true
                : false
            "
            v-model="scope.row.name"
            placeholder="参数名"
            :aggregateEnvs="aggregateEnvs"
            @input="addTable"
            :style="{
              fontSize: fontSize + 'px',
              maxWidth: getMaxWidth(scope),
            }"
          />
          <p v-else>{{ `[ Object ]` }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="120">
        <template slot-scope="scope">
          <el-select
            size="small"
            @change="typeChanged(scope.row)"
            v-if="!scope.row.inArray && scope.row.name == '根节点' && haveRoot"
            v-model="scope.row.type"
            placeholder="请选择"
            :disabled="scope.row.ifStruct ? true : false"
            :class="getClassName()"
          >
            <el-option
              v-for="item in rootType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :style="{ fontSize: fontSize + 'px' }"
            >
            </el-option>
          </el-select>

          <el-select
            size="small"
            @change="typeChanged(scope.row)"
            v-if="!scope.row.inArray && scope.row.name != '根节点'"
            v-model="scope.row.type"
            filterable
            :filter-method="(value) => dataFilter(value, scope.row)"
            placeholder="请选择"
            :disabled="scope.row.ifStruct ? true : false"
            :class="getClassName()"
            @focus="dataFocus"
          >
            <el-option
              v-for="item in paramTypeCopy"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :style="{ fontSize: fontSize + 'px' }"
            >
            </el-option>
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
            :disabled="scope.row.ifStruct ? true : false"
            :style="{ fontSize: fontSize + 'px' }"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="!unshownRequired"
        prop="required"
        label="必填"
        width="70"
      >
        <template slot-scope="scope">
          <el-checkbox
            size="small"
            :disabled="parameter == 'path' || scope.row.ifStruct ? true : false"
            v-if="!scope.row.inArray"
            v-model="scope.row.required"
          ></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="demo" label="示例">
        <template slot-scope="scope">
          <el-input
            style="width: 100%"
            :style="{ fontSize: fontSize + 'px' }"
            v-if="
              (scope.row.type == 'int' || scope.row.type == 'double') &&
              !scope.row.inArray
            "
            v-model="scope.row.demo"
            placeholder="(NULL)"
            :disabled="
              scope.row.type == 'object' ||
              scope.row.type == 'array' ||
              scope.row.ifStruct
                ? true
                : false
            "
            size="small"
            type="number"
          ></el-input>
          <el-select
            v-model="scope.row.demo"
            v-if="scope.row.type == 'boolean' && !scope.row.inArray"
            placeholder=""
            size="small"
            :disabled="scope.row.ifStruct ? true : false"
            :class="getClassName()"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :style="{ fontSize: fontSize + 'px' }"
            >
            </el-option>
          </el-select>
          <easyapi-env-input
            v-if="
              scope.row.type != 'int' &&
              scope.row.type != 'double' &&
              scope.row.type != 'boolean' &&
              !scope.row.inArray
            "
            style="width: 100%"
            :style="{ fontSize: fontSize + 'px' }"
            v-model="scope.row.demo"
            :disabled="
              scope.row.type == 'object' ||
              scope.row.type == 'array' ||
              scope.row.ifStruct
                ? true
                : false
            "
            placeholder="参数示例"
            :aggregateEnvs="aggregateEnvs"
            @input="addTable"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="!unshownDefault"
        prop="defaultValue"
        label="默认值"
      >
        <template slot-scope="scope">
          <el-input
            style="width: 100%"
            :style="{ fontSize: fontSize + 'px' }"
            v-if="
              (scope.row.type == 'int' || scope.row.type == 'double') &&
              !scope.row.inArray
            "
            v-model="scope.row.defaultValue"
            placeholder="(NULL)"
            :disabled="
              scope.row.type == 'object' ||
              scope.row.type == 'array' ||
              scope.row.ifStruct
                ? true
                : false
            "
            size="small"
            type="number"
          ></el-input>
          <el-select
            v-model="scope.row.defaultValue"
            v-if="scope.row.type == 'boolean' && !scope.row.inArray"
            placeholder=""
            size="small"
            :disabled="scope.row.ifStruct ? true : false"
            :class="getClassName()"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :style="{ fontSize: fontSize + 'px' }"
            >
            </el-option>
          </el-select>
          <easyapi-env-input
            v-if="
              scope.row.type != 'int' &&
              scope.row.type != 'double' &&
              scope.row.type != 'boolean' &&
              !scope.row.inArray
            "
            style="width: 100%"
            :style="{ fontSize: fontSize + 'px' }"
            v-model="scope.row.defaultValue"
            :disabled="
              scope.row.type == 'object' ||
              scope.row.type == 'array' ||
              scope.row.ifStruct
                ? true
                : false
            "
            placeholder="参数默认值"
            :aggregateEnvs="aggregateEnvs"
            @input="addTable"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="ifMock" label="Mock">
        <template slot-scope="scope">
          <el-autocomplete
            popper-class="my-autocomplete"
            :disabled="
              scope.row.name == '根节点' || scope.row.ifStruct ? true : false
            "
            style="width: 100%"
            v-model="scope.row.mock"
            size="small"
            :fetch-suggestions="mockSearch"
            :trigger-on-focus="false"
            :class="getClassName()"
          >
            <template slot-scope="{ item }">
              <span class="value">{{ item.value }}</span>
              <span class="label">{{ item.label }}</span>
            </template>
          </el-autocomplete>
        </template>
      </el-table-column>

      <el-table-column v-if="parameter == 'path'" width="100" align="right">
      </el-table-column>

      <el-table-column
        v-if="parameter != 'path'"
        prop="options"
        :align="ifBulkEdit ? 'right' : ''"
        label="操作"
      >
        <template slot="header" v-if="ifBulkEdit">
          <div class="setting-edit" :style="{ fontSize: fontSize }">
            <div @click="gotoEdit">批量修改</div>
            <el-tooltip
              class="item"
              effect="dark"
              content="快速添加"
              placement="top"
            >
              <span
                class="el-icon-circle-plus-outline"
                @click="openModal"
              ></span>
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <el-button
            @click="insertRow(scope)"
            type="text"
            size="small"
            :style="{ fontSize: fontSize + 'px' }"
            v-if="
              (scope.row.type === 'object' || scope.row.type === 'array') &&
              !scope.row.struct &&
              !scope.row.ifStruct
            "
            >插入
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="openDataStructureModal(scope)"
            :style="{ fontSize: fontSize + 'px' }"
            v-if="
              ifStruct &&
              (scope.row.type == 'object' || scope.row.type == 'array') &&
              !scope.row.struct &&
              !scope.row.ifStruct
            "
            style="margin-right: 10px"
            >引用数据结构
          </el-button>
          <div
            v-if="scope.row.struct && !scope.row.ifStruct"
            style="display: flex; flex-flow: column; text-align: left"
          >
            <div>
              <el-button
                :style="{ fontSize: fontSize }"
                type="text"
                size="small"
                @click="delectStruct(scope)"
                >删除该数据结构
              </el-button>
            </div>
            <div>
              <el-button
                :style="{ fontSize: fontSize }"
                type="text"
                size="small"
                @click="cancelStruct(scope)"
                >取消该数据结构的关联
              </el-button>
            </div>
            <i
              v-if="
                scope.row.name !== '根节点' ||
                (!haveRoot && scope.$index != renderData.length - 1)
              "
              @click="delRow(scope)"
              class="el-icon-delete"
            ></i>
          </div>
          <i
            v-if="
              (scope.row.name !== '根节点' ||
                (!haveRoot && scope.$index != renderData.length - 1)) &&
              !scope.row.ifStruct &&
              !scope.row.struct
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
        :style="{ fontSize: fontSize + 'px' }"
      >
      </el-input>
      <div class="bulk-edit_footer">
        字段之间以英文逗号(,)分隔，多条记录以换行分隔
      </div>
    </div>

    <el-dialog
      title="快速添加"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-radio-group v-model="quickAddType" @change="changeQuickAddType">
        <el-radio label="URL">URL请求</el-radio>
        <el-radio label="JSON">JSON</el-radio>
        <el-radio label="JAVA">实体类</el-radio>
        <!-- <el-radio label="SQL">SQL语句</el-radio> -->
      </el-radio-group>

      <el-input
        type="textarea"
        :placeholder="placeholder"
        v-model="quickText"
        rows="8"
        show-word-limit
        style="margin-top: 20px"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmQuickAdd('替换')" size="small"
          >替 换</el-button
        >
        <el-button type="primary" @click="confirmQuickAdd('追加')" size="small"
          >追 加</el-button
        >
      </span>
    </el-dialog>
    <!-- 数据结构 -->
    <DataStructureModal :visible.sync="dataStructureModal" :struct="struct" />
  </div>
</template>

<script>
import Sortable from "sortablejs";
import parser from "js-sql-parser";
import { optimizeParams } from "./utils/utils";
import { fillId } from "./utils/fill";
import x2js from "x2js";
import DataStructureModal from "./components/dataStructureModal.vue";
import { parseJavaEntity } from "./utils/parseJava";

const $x2js = new x2js();

export default {
  name: "JsonForm",
  components: {
    DataStructureModal,
  },
  data: function () {
    return {
      dialogVisible: false,
      quickText: "",
      quickAddType: "URL",
      dataStructureModal: false,
      placeholder: "例如?a=1&b=2",
      // 字段类型
      ifEdit: false,
      options: [
        {
          value: "",
          label: "",
        },
        {
          value: "true",
          label: "true",
        },
        {
          value: "false",
          label: "false",
        },
      ],
      rootType: [
        {
          value: "array",
          label: "array",
        },
        {
          value: "object",
          label: "object",
        },
      ],
      paramTypeCopy: [],
      paramType: [
        // {
        //   value: "引用类型",
        //   label: "引用类型",
        //   children: [],
        // },
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
          value: "decimal",
          label: "decimal",
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
      row: [],
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
    "modelData",
    "unshownRequired",
    "unshownDefault",
    "ifBulkEdit",
    "mockValues",
    "ifMock",
    "ifStruct",
    "struct",
    "fontSize",
  ],
  created() {
    this.initViewData();
  },
  computed: {
    mockValuesItems() {
      let mockValuesItems = [];
      this.mockValues.map(function (item) {
        mockValuesItems.push(item);
      });
      return mockValuesItems;
    },
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
    modelData: function (val) {
      if (val && val.length > 0) {
        // this.paramType[0].children = val;
      }
    },
  },

  methods: {
    getMaxWidth(row) {
      let maxWidth = "";
      if (row.treeNode) {
        maxWidth =
          "calc( 100% - " + (20 + 12 * row.treeNode.level) + "px" + " )";
      } else {
        maxWidth = "100%";
      }
      return maxWidth;
    },

    changeQuickAddType() {
      if (this.quickAddType == "URL") {
        this.placeholder = "例如?a=1&b=2";
      } else if (this.quickAddType == "JSON") {
        this.placeholder = "例如{'a': 1,'b': 2}";
      } else if (this.quickAddType == "JAVA") {
        this.placeholder =
          "支持Java语法，单行注释（上行，行尾） //……，块注释/*……*/上一行注释，文档注释/**……*/，如果不满足您的需求，请联系客服";
      } else if (this.quickAddType == "SQL") {
        this.placeholder = "";
      }
    },

    dataFocus() {
      this.paramTypeCopy = this.paramType;
    },

    dataFilter(val, row) {
      if (val) {
        this.paramTypeCopy = this.paramType.filter((item) => {
          if (
            !!~item.label.indexOf(val) ||
            !!~item.label.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          }
        });
        if (this.paramTypeCopy.length > 0) row.type = val;
      } else {
        this.paramTypeCopy = this.paramType;
      }
    },

    getClassName() {
      switch (this.fontSize) {
        case 12:
          return "fontSize-12";
          break;
        case 14:
          return "fontSize-14";
          break;
        case 16:
          return "fontSize-16";
          break;
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let num = 7;
      if (this.unshownRequired && this.unshownDefault) {
        num -= 2;
      }
      if (!this.ifMock) {
        num -= 1;
      }
      if (columnIndex === num) {
        if (row.struct && !row.ifStruct) {
          return {
            rowspan: this.getDataLength(row.childs, []).length + 1,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 1,
            colspan: 1,
          };
        }
      }
    },

    getDataLength(value, arr) {
      if (value && value.length > 0) {
        value.forEach((item) => {
          arr.push(item);
          if (item.childs) {
            this.getDataLength(item.childs, arr);
          }
        });
      }
      return arr;
    },

    getDataStructure(val) {
      let arr = JSON.parse(JSON.stringify(val));
      this.updateRenderData(this.renderData, arr);
    },

    updateRenderData(value, val) {
      value.forEach((el) => {
        if (el === this.row) {
          this.updateChilds(val[0].fields, true);
          el.struct = val[0].name;
          el.childs = val[0].fields;
          return;
        }
        if (el.childs && el.childs.length > 0) {
          this.updateRenderData(el.childs, val);
        }
      });
    },

    updateChilds(val, value) {
      if (val && val.length > 0) {
        val.forEach((item) => {
          item.ifStruct = value;
          if (!value) {
            item.struct = null;
          }
          this.updateChilds(item.childs, value);
        });
      }
    },

    openDataStructureModal(scope) {
      this.row = scope.row;
      this.dataStructureModal = true;
    },

    delectStruct(scope) {
      this.$confirm(
        `是否要删除该数据结构的引用？该操作仅删除数据结构与API文档的关联，并不会删除实际的数据结构。`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        scope.row.childs = [];
        scope.row.struct = null;
      });
    },

    updateCancelStruct(value, val) {
      value.forEach((el) => {
        if (el === val) {
          this.updateChilds(val.childs, false);
          el.struct = null;
          el.childs = val.childs;
          return;
        }
        if (el.childs && el.childs.length > 0) {
          this.updateCancelStruct(el.childs, val);
        }
      });
    },

    cancelStruct(scope) {
      this.$confirm(
        `是否要独立保存该数据结构的信息到API文档中，并且取消该数据结构与API文档的关联？取消与数据结构的关联之后，数据结构的改动将不会再同步到API文档中。`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.updateCancelStruct(this.renderData, scope.row);
      });
    },

    getDataFormRoot() {
      return {
        type: this.renderData[0].type,
        description: this.renderData[0].description,
        struct: this.renderData[0].struct,
      };
    },

    //打开弹窗
    openModal() {
      this.dialogVisible = true;
      this.quickAddType = "URL";
      this.placeholder = "例如?a=1&b=2";
      this.quickText = "";
    },

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
      if (v.childs && v.childs.length > 0) {
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
      // console.log(v, arr, level);
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
        value.demo = null;
        value.defaultValue = null;
      }
      if (value.type == "double") {
        value.demo = null;
        value.defaultValue = null;
      }
      if (value.type == "boolean") {
        value.demo = "";
        value.defaultValue = "";
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
            name: this.type && this.type == "XML" ? "root" : "根节点",
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

        if (this.parameter !== "path") {
          if (
            (this.renderData.length > 0 &&
              this.renderData[this.renderData.length - 1].name != "") ||
            this.renderData[this.renderData.length - 1].description != "" ||
            this.renderData[this.renderData.length - 1].defaultValue != "" ||
            this.renderData[this.renderData.length - 1].demo != ""
          ) {
            this.addNew();
          }
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
      expanded(fillId(this.renderData));
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

          if (oldRow.ifStruct) {
            return false;
          }

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
            // //递归找到父类的数据
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
        if (this.parameter !== "path") {
          this.addNew();
        }
      }
    },

    // 添加行
    addNew: function () {
      this.renderData.push({
        id: +`${this.renderData.length + 1}${new Date().getTime()}`,
        name: "",
        type: "string",
        description: "",
        required: false,
        demo: "",
        defaultValue: "",
        childs: [],
        level: 1,
        parentId: 0,
      });
    },

    confirmQuickAdd: function (type) {
      if (this.quickAddType == "JSON") {
        let _urlParams = [];
        try {
          if (this.haveRoot) {
            let jsonData = JSON.parse(this.quickText);
            if (Object.prototype.toString.call(jsonData) === "[object Array]") {
              this.parseArray(jsonData, _urlParams);
            }
            if (
              Object.prototype.toString.call(jsonData) === "[object Object]"
            ) {
              this.parseJson(jsonData, _urlParams);
            }
            if (type == "替换") {
              this.renderData[0].childs = _urlParams;
            } else {
              for (let item of _urlParams) {
                this.renderData[0].childs.push(item);
              }
            }
          } else {
            let jsonData = JSON.parse(this.quickText);
            if (
              Object.prototype.toString.call(jsonData) === "[object Object]"
            ) {
              for (let key in jsonData) {
                _urlParams.push({
                  id: +`${this.renderData.length + 1}${new Date().getTime()}`,
                  name: key,
                  type:
                    this.getType(jsonData[key]) == "array" ||
                    this.getType(jsonData[key]) == "object"
                      ? "string"
                      : this.getType(jsonData[key]),
                  category: "Query",
                  description: "",
                  required: false,
                  demo:
                    this.getType(jsonData[key]) == "array" ||
                    this.getType(jsonData[key]) == "object"
                      ? jsonData[key].toString()
                      : jsonData[key],
                  defaultValue: "",
                  childs: [],
                  level: 1,
                  parentId: 0,
                });
              }
              if (type == "替换") {
                this.renderData = _urlParams;
                this.addNew();
              } else {
                for (let item of _urlParams) {
                  this.renderData.splice(this.renderData.length - 1, 0, item);
                }
              }
            }
          }
          this.dialogVisible = false;
        } catch (e) {
          this.$message.error("请输入合法的JSON");
        }
      } else if (this.quickAddType == "URL") {
        let _urlParams = [];
        try {
          let data = this.quickText.split("?")[1].split("&");
          if (!this.haveRoot) {
            for (let item of data) {
              _urlParams.push({
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
            }
            if (type == "替换") {
              this.renderData = _urlParams;
              this.addNew();
            } else {
              for (let item of _urlParams) {
                this.renderData.splice(this.renderData.length - 1, 0, item);
              }
            }
          } else {
            for (let item of data) {
              _urlParams.push({
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
            if (type == "替换") {
              this.renderData[0].childs = _urlParams;
            } else {
              for (let item of _urlParams) {
                this.renderData[0].childs.push(item);
              }
            }
          }
          this.dialogVisible = false;
        } catch (e) {
          this.$message.error("请输入合法的URL");
        }
      } else if (this.quickAddType == "JAVA") {
        let data = parseJavaEntity(this.quickText);
        let _urlParams = [];
        if (!this.haveRoot) {
          for (let item of data) {
            _urlParams.push({
              id: +`${this.renderData.length + 1}${new Date().getTime()}`,
              name: item.name,
              type: item.type,
              category: "Query",
              description: item.description,
              required: false,
              demo: "",
              defaultValue: "",
              childs: [],
              level: 1,
              parentId: 0,
            });
          }
          if (type == "替换") {
            this.renderData = _urlParams;
            this.addNew();
          } else {
            for (let item of _urlParams) {
              this.renderData.splice(this.renderData.length - 1, 0, item);
            }
          }
        } else {
          for (let item of data) {
            _urlParams.push({
              id: +`${
                this.renderData[0].childs.length + 1
              }${new Date().getTime()}`,
              name: item.name,
              type: item.type,
              category: "Query",
              description: item.description,
              required: false,
              demo: "",
              defaultValue: "",
              childs: [],
              level: this.renderData[0].childs.length + 1,
              parentId: 0,
            });
          }
          if (type == "替换") {
            this.renderData[0].childs = _urlParams;
          } else {
            for (let item of _urlParams) {
              this.renderData[0].childs.push(item);
            }
          }
        }
        this.dialogVisible = false;
      } else if (this.quickAddType == "SQL") {
        // let ast = parser.parse(this.quickText);
        // console.log(ast);
        // console.log(JSON.stringify(ast));
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
              type: this.getType(el),
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
              type: this.getType(data[key]),
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

    getJSONFormData(type) {
      if (type == "XML") {
        return this.renderData;
      } else if (type == "JSON") {
        return this.renderData[0].childs;
      }
    },

    exportXML() {
      return $x2js.js2xml(this.exportJSON("xml"));
    },

    exportJSON(type) {
      function getJson(targets, json) {
        targets.forEach((el) => {
          if (el.type === "array") {
            if (el.childs && el.childs.length > 0) {
              if (type == "xml") {
                json[el.name] = [{}, {}];
                pushArray(el.childs, json[el.name]);
              } else {
                json[el.name] = [{}];
                pushArray(el.childs, json[el.name]);
              }
            } else {
              json[el.name] = [];
            }
          } else if (el.type === "object") {
            json[el.name] = {};
            getJson(el.childs, json[el.name]);
          } else {
            json[el.name] = optimizeParams(el.type, el.demo);
          }
        });
      }

      function pushArray(targets, arr) {
        targets.forEach((el) => {
          if (el.type === "array") {
            if (el.childs && el.childs.length > 0) {
              let tmpArr = [{}];
              if (type == "xml") {
                arr[0][el.name] = tmpArr;
                arr[1][el.name] = tmpArr;
              } else {
                arr[0][el.name] = tmpArr;
              }
              // arr.push(tmpArr);
              pushArray(el.childs, tmpArr);
            } else {
              if (type == "xml") {
                arr[0][el.name] = [];
                arr[1][el.name] = [];
              } else {
                arr[0][el.name] = [];
              }
            }
          } else if (el.type === "object") {
            json[el.name] = {};
            let tmpObj = {};
            // arr.push(tmpObj);
            if (type == "xml") {
              arr[0][el.name] = tmpObj;
              arr[1][el.name] = tmpObj;
            } else {
              arr[0][el.name] = tmpObj;
            }
            getJson(el.childs, tmpObj);
          } else {
            // arr.push(el.demo);
            if (type == "xml") {
              arr[0][el.name] = optimizeParams(el.type, el.demo);
              arr[1][el.name] = optimizeParams(el.type, el.demo);
            } else {
              arr[0][el.name] = optimizeParams(el.type, el.demo);
            }
          }
        });
      }

      const json = {};
      getJson(this.renderData, json);
      if (type && type == "xml") {
        return json;
      } else {
        return json[this.renderData[0].name];
      }
    },

    importXML: function (xml) {
      //xml转json
      let json = $x2js.xml2js(xml);
      //优化json数据
      if (json) {
        this.optimizeJson(json);
      }
      this.importJSON(json, "xml");
    },

    optimizeJson(json) {
      for (let key in json) {
        if (!json[key].__text && json[key].constructor === Object) {
          this.optimizeJson(json[key]);
        }
        if (json[key].constructor === Array && json[key].length > 0) {
          json[key].forEach((item) => {
            this.optimizeJson(item);
          });
        }
        if (json[key].__text) json[key] = json[key].__text;
        if (key.indexOf("_") != -1) delete json[key];
      }
    },

    importJSON: function (json, type) {
      //如果是数组，只显示第一个
      if (json.constructor === Array && json.length > 0) {
        json = [json[0]];
      }
      //加上根节点
      if (type && type == "xml") {
        let newData = json;
        this.treeToTile();
        this.renderData = fillId(this.jsonParse(newData));
      } else {
        let newData = {
          根节点: json,
        };
        this.treeToTile();
        this.renderData = fillId(this.jsonParse(newData));
      }
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
            if (val.length > 0) {
              parsedVal = parseArray([val[0]]);
            }
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
            if (parsedVal === null) {
              if (opt.type == "int" || opt.type == "double") {
                opt.demo = null;
              } else {
                opt.demo = "(NULL)";
              }
            } else {
              opt.demo = parsedVal.toString();
            }
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
            name: this.getType(val) === "object" ? "" : val,
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
            if (parsedVal === null) {
              if (opt.type == "int" || opt.type == "double") {
                opt.demo = null;
              } else {
                opt.demo = "(NULL)";
              }
            } else {
              opt.demo = parsedVal.toString();
            }
          }

          result.push(opt);
        }
        return result[0].childs;
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

    // Mock
    mockSearch(queryString, cb) {
      var mockValues = this.mockValues;
      var results = queryString
        ? mockValues.filter(this.createFilter(queryString))
        : mockValues;
      cb(results);
    },

    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !=
          -1
        );
      };
    },
  },
};
</script>

<style lang="less">
.my-autocomplete {
  width: 400px !important;
  li {
    line-height: normal;
    display: flex;
    justify-content: space-between;

    .value {
      text-overflow: ellipsis;
      overflow: hidden;
      width: 240px;
    }

    .label {
      color: #b4b4b4;
    }

    .highlighted .label {
      color: #ddd;
    }
  }
}

.data-form {
  .el-table,
  .el-table .cell,
  .el-table__body-wrapper {
    overflow: visible;
  }

  .el-table__body-wrapper {
    position: static !important;
  }
}

.data-form-container {
  // 取消input的上下箭头
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  .fontSize-12 {
    .el-input__inner {
      font-size: 12px;
    }
  }

  .fontSize-14 {
    .el-input__inner {
      font-size: 14px;
    }
  }

  .fontSize-16 {
    .el-input__inner {
      font-size: 16px;
    }
  }

  .el-icon-arrow-right:before {
    content: "\e791" !important;
  }

  .el-icon-s-operation {
    font-size: 16px;
    text-align: center;
    cursor: move;
    margin: 0 auto;
    color: #666;
  }

  .el-table__row {
    td {
      padding: 4px 0 !important;
      .is-disabled {
        background-color: #f5f7fa !important;
        .el-input__inner {
          background-color: #fff !important;
        }
      }
    }
    &:hover td {
      .env-input-container {
        -webkit-transition: background-color 0.25s ease;
        transition: background-color 0.25s ease;
        background-color: #f5f7fa !important;
        .is-disabled[data-v-6d9ac156] {
          -webkit-transition: background-color 0.25s ease;
          transition: background-color 0.25s ease;
          background-color: #f5f7fa !important;
        }
      }
      .el-input__inner {
        -webkit-transition: background-color 0.25s ease;
        transition: background-color 0.25s ease;
        background-color: #f5f7fa !important;
      }
    }
  }

  .setting-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div {
      color: #00b2c8;
      cursor: pointer;

      &:hover {
        color: #00b2c8cc;
      }
    }
    span {
      color: #666;
      cursor: pointer;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #00b2c8;
    border-color: #00b2c8;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }

  .env-input-container {
    height: 32px !important;
    line-height: 32px !important;
    .env-input {
      padding: 0 4px 0 4px !important;
      // border: 0px solid #dcdfe6 !important;
      min-height: 32px !important;
      line-height: 32px !important;
    }
    .env-input_wrap {
      line-height: 30px !important;
    }
    .is-disabled {
      color: #909399;
    }
  }

  .el-input--small {
    .el-input__inner {
      border: 0px solid #000 !important;
      height: 25px !important;
      line-height: 25px !important;
      padding: 0 4px !important;
    }
    .el-input__icon {
      line-height: 25px !important;
    }
  }

  .el-button--small {
    padding: 0px;
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
