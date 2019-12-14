<template>
  <el-table
    :data="renderData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    default-expand-all
    :tree-props="{children: 'childs', hasChildren: 'hasChildren'}"
  >
    <el-table-column prop="name" label="参数名称" width="240">
      <template slot-scope="scope">
        <el-input style="width: 80%;" v-model="scope.row.name" placeholder="请输入内容"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="参数类型" width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="参数说明" width="180">
      <template slot-scope="scope">
        <el-input v-model="scope.row.description" placeholder="请输入内容"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="required" label="必填">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.required"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column prop="sample" label="示例" width="180">
      <template slot-scope="scope">
        <el-input v-model="scope.row.sample" placeholder="请输入内容"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="demo" label="默认值" width="180">
      <template slot-scope="scope">
        <el-input v-model="scope.row.demo" placeholder="请输入内容"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="options" label="操作"></el-table-column>
  </el-table>
  <!-- <div
    class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
  >
    <div class="el-table__header-wrapper">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
        <colgroup>
          <col name="el-table_28_column_111" width="180" />
          <col name="el-table_28_column_112" width="180" />
          <col name="el-table_28_column_113" width="459" />
        </colgroup>
        <thead class>
          <tr class>
            <th colspan="1" rowspan="1" class="el-table_28_column_111 is-leaf">
              <div class="cell params-name">
                <span>字段名称</span>
              </div>
            </th>
            <th colspan="1" rowspan="1" class="el-table_28_column_112 is-leaf">
              <div class="cell">
                <span>字段类型</span>
              </div>
            </th>
            <th colspan="1" rowspan="1" class="el-table_28_column_113 is-leaf">
              <div class="cell">
                <span>字段说明</span>
              </div>
            </th>
            <th colspan="1" rowspan="1" class="el-table_28_column_113 is-leaf">
              <div class="cell">
                <span>必填</span>
              </div>
            </th>
            <th colspan="1" rowspan="1" class="el-table_28_column_113 is-leaf">
              <div class="cell">
                <span>示例</span>
              </div>
            </th>
            <th colspan="1" rowspan="1" class="el-table_28_column_113 is-leaf">
              <div class="cell">
                <span>默认值</span>
              </div>
            </th>
            <th colspan="1" rowspan="1" class="el-table_28_column_113 is-leaf">
              <div class="cell">
                <span>操作</span>
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <div class="el-table__body-wrapper is-scrolling-none">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
        <tbody class="ivu-table-tbody" ref="rawTableList">
          <tr
            v-for="(item, index) in renderData"
            :class="['raw-table el-table__row clearfix']"
            :data-deepIndex="getCellClass(item.deepIndex)"
            :key="index"
          >
            <template>
              <td class="el-table_28_column_111 params-name">
                <div class="clearfix name-cell cell">
                  <div
                    class="arrow"
                    :style="`width: ${(item.childs && item.childs.length>0?item.deepIndex.length:item.deepIndex.length-1)*10}px;`"
                  >
                    <i
                      v-if="item.childs && item.childs.length > 0"
                      class="el-icon-caret-right"
                      @click="collapseRow(index, $event)"
                    ></i>
                  </div>
                  <el-input
                    class="ivu-el-input"
                    type="text"
                    placeholder="输入字段名称"
                    @on-change="modelChange(item, 'name', $event)"
                    v-model="item.name"
                  />
                </div>
              </td>
              <td class="el-table_28_column_111">
                <div class="cell">
                  <el-select @on-change="modelChange(item, 'type', $event)" v-model="item.type">
                    <el-option
                      v-for="param in paramType"
                      :key="param.label"
                      :label="param.label"
                      :value="param.value"
                    ></el-option>
                  </el-select>
                </div>
              </td>
              <td class="el-table_28_column_111">
                <div class="cell">
                  <el-input
                    type="text"
                    placeholder="输入字段说明"
                    class="ivu-el-input"
                    v-model="item.description"
                    @on-change="modelChange(item, 'description', $event)"
                  />
                </div>
              </td>
              <td class="el-table_28_column_111">
                <div class="cell">
                  <el-checkbox
                    @on-change="modelChange(item, 'required', $event)"
                    v-model="item.required"
                  ></el-checkbox>
                </div>
              </td>
              <td class="el-table_28_column_111">
                <div class="cell">
                  <el-input
                    type="text"
                    placeholder="输入示例"
                    class="ivu-el-input"
                    v-model="item.sample"
                    @on-change="modelChange(item, 'sample', $event)"
                  />
                </div>
              </td>
              <td class="el-table_28_column_111">
                <div class="cell">
                  <el-input
                    type="text"
                    placeholder="输入默认值"
                    class="ivu-el-input"
                    v-model="item.remark"
                    @on-change="modelChange(item, 'remark', $event)"
                  />
                </div>
              </td>
              <td class="el-table_28_column_111">
                <div class="cell">
                  <a href="javascript:;" @click="insertRow(item)" style="margin-right: 10px;">插入</a>
                  <a href="javascript:;" @click="delRow(item)">删除</a>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="tools">
      <div class="add" @click="addParam">
        <i class="a-icon">
          <i class="add-plus fa fa-plus-circle" aria-hidden="true"></i>
        </i>
        <p>添加属性</p>
      </div>
      <div class="add" @click="toQuickAdd">
        <span class="a-icon">
          <i class="add-plus fa fa-plus-circle" aria-hidden="true"></i>
        </span>
        <p>快速添加</p>
      </div>
  <!-- <el-button size="mini" @click="move(0)">上移</el-button>-->
  <!-- <el-button size="mini" @click="move(1)">下移</el-button> -->
  <!-- </div> -->

  <!-- <Modal v-model="quickAddParams" title="快速添加" width="600">
      <div>
        <el-input
          class="dialog-row"
          v-model="quickJson"
          type="textarea"
          :rows="6"
          placeholder="复制JSON数据"
        />
        <ea-button class="btn" :size="'sml'" text="导入" @click="confirmInsert" />
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>-->
</template>

<script>
let makeParamsList = function(data) {
  let result = [];
  let deepIndex = [0];
  let map = [...data];
  console.log(map);
  map.forEach((el, index) => {
    el["deepIndex"] = [...deepIndex];
    result.push(el);
    if (el.childs && el.childs.length > 0) {
      makeParamsChild(el.childs, result, deepIndex);
    }
    deepIndex[0]++;
  });
  return result;
};

let makeParamsChild = function(childMap, result, deepArr) {
  let deepIndex = [...deepArr, 0];
  childMap.forEach(el => {
    el["deepIndex"] = [...deepIndex];
    result.push(el);
    if (el.childs && el.childs.length > 0) {
      makeParamsChild(el.childs, result, deepIndex);
    }
    deepIndex[deepIndex.length - 1]++;
  });
};

export default {
  name: "JsonForm",
  data: function() {
    return {
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
      renderData: [
        {
          id: 1,
          name: "blog",
          type: "object",
          description: "博客",
          required: false,
          sample: "",
          demo: "",
          sequence: 1,
          childs: [
            {
              id: 11,
              name: "title",
              type: "string",
              description: "标题",
              required: true,
              sample: "我和我的祖国",
              demo: "",
              sequence: 1
            }
          ]
        }
      ],
      selfRowData: [],
      quickAddParams: false,
      quickJson: ""
    };
  },
  props: ["rawData"],
  created() {
    // this.selfRowData = this.rawData;
    // this.renderData = makeParamsList(this.selfRowData);
  },
  watch: {
    selfRowData: function() {
      this.$emit("el-input", this.selfRowData);
    }
  },
  methods: {
    // 添加属性
    addParam: function() {
      this.selfRowData.push({
        name: "",
        type: "int",
        category: null,
        description: "",
        required: false,
        sample: "",
        demo: "",
        formatJson: false,
        dataModel: null,
        remark: "",
        childParams: []
      });
      this.renderData = makeParamsList(this.selfRowData);
    },

    modelChange: function(item, field, e) {
      let deepIndex = item.deepIndex;
      let target = this.selfRowData;
      deepIndex.forEach((deep, index) => {
        if (index == 0) {
          target = target[deep];
        } else {
          target = target["childs"][deep];
        }
      });
      target[field] = typeof e == "object" ? e.target.value : e;
    },
    // 插入行
    insertRow: function(item) {
      let _deepIndex = [...item.deepIndex];
      _deepIndex[_deepIndex.length - 1] += 1;
      if (!item.childs) {
        item["childs"] = [];
      }
      item.childs.push({
        name: "",
        deepIndex: _deepIndex,
        category: null,
        type: "int",
        description: "",
        required: false,
        sample: "",
        demo: "",
        formatJson: false,
        dataModel: null,
        remark: "",
        childs: []
      });
      this.renderData = makeParamsList(this.selfRowData);
    },
    // 删除行
    delRow: function(item) {
      let deepIndex = item.deepIndex;
      let targetWrapper = this.selfRowData;
      deepIndex.forEach((deep, index) => {
        if (deepIndex.length > 1) {
          if (deepIndex.length - 1 == index) {
            targetWrapper = targetWrapper["childs"];
          } else {
            if (index == 0) {
              targetWrapper = targetWrapper[deep];
            } else {
              targetWrapper = targetWrapper["childs"][deep];
            }
          }
        }
      });
      let target = item.deepIndex[item.deepIndex.length - 1];
      console.log(targetWrapper);
      targetWrapper.splice(target, 1);
      this.renderData = makeParamsList(this.selfRowData);
    },

    // 生成Cell Class
    getCellClass: function(deepIndex) {
      let _c = [];
      let _tmp = "row";
      deepIndex.forEach(el => {
        _tmp += `-${el}`;
        _c.push(_tmp);
      });
      return _c.join(" ");
    },

    // 折叠row
    collapseRow: function(index, e) {
      let direction = 0; // 0 is up, 1 is down
      let allRow = this.$refs.rawTableList.querySelectorAll(".raw-table");
      // 触发元素
      let target = allRow[index];
      direction = hasClass(target.classList, "collapse") ? 0 : 1;
      target.classList.toggle("collapse");
      // 触发元素Deep Tag
      let targetTag = target.dataset.deepindex;
      //
      console.log(target, targetTag);
      let firstRow = true;
      for (let i = 0; i < allRow.length; ++i) {
        console.log(allRow[i].dataset);
        if (hasTag(allRow[i].dataset.deepindex, targetTag)) {
          if (firstRow) {
            firstRow = false;
            continue;
          }
          if (direction == 0) {
            allRow[i].classList.add("hide");
          } else {
            allRow[i].classList.remove("hide");
          }
        }
      }
    },

    // 快速添加
    toQuickAdd: function() {
      this.quickAddParams = true;
    },

    confirmInsert: function() {
      let _urlParams = [];
      try {
        let jsonData = JSON.parse(this.quickJson);
        this.parseJson(jsonData, _urlParams);

        this.selfRowData = [...this.selfRowData, ..._urlParams];
        this.renderData = makeParamsList(this.selfRowData);
        this.quickAddParams = false;
      } catch (e) {
        console.log(e);
        this.$Message.error("请输入合法的JSON");
      }
    },

    parseJson: function(data, set) {
      let keys = Object.keys(data);
      keys.forEach(key => {
        if (Object.prototype.toString.call(data[key]) == "[object Object]") {
          this.parseJson(data[key], set);
        } else {
          if (typeof data[key] !== "object") {
            set.push({
              name: key,
              type: typeof data[key],
              category: "query",
              description: "",
              required: false,
              sample: data[key],
              demo: data[key],
              formatJson: false,
              dataModel: null,
              remark: data[key],
              childs: []
            });
          }
        }
      });
    }
  }
};

function hasTag(deepIndex, targetTag) {
  return deepIndex.indexOf(targetTag) >= 0;
}

function hasClass(classList, targetClass) {
  // the type of classList is DOMTokenList
  let _ = classList.value.split(" ");
  return _.indexOf(targetClass) < 0;
}
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

.ivu-table-row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ivu-table-cell {
  display: flex;
  flex: 1;
  padding: 10px;
  min-height: 55px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  justify-content: center;
  align-items: center;

  &.params-name {
    min-width: 200px;
  }

  &:first-child {
    border-left: 1px solid #ddd;
  }
}

.name-cell {
  display: flex;
  justify-content: center;
  align-items: center;

  .ivu-el-input {
    flex: 1;
    padding-left: 0;
  }

  .arrow {
    text-align: right;
    color: blue;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }
}

.raw-table {
  .arrow-icon {
    transition: all 0.4s ease;
  }

  &.hide {
    display: none;
  }

  &.collapse {
    .arrow-icon {
      transform: rotate(-90deg);
    }
  }
}
</style>


