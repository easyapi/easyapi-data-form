<template>
  <div class="json-form">
    <el-table
      :data="renderData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'childs', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="参数名称">
        <template slot-scope="scope">
          <el-input style="flex: 1" v-model="scope.row.name" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="参数类型" width="180">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择">
            <el-option
              v-for="item in paramType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="参数说明" width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.description" placeholder="请输入内容"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="required" label="必填" width="70">
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
      <el-table-column prop="options" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click="insertRow(scope)" type="text" size="small">插入</el-button>
          <el-button @click="delRow(scope)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="json-form-tools">
      <el-button size="mini" @click="addNew">添加属性</el-button>
      <el-button size="mini">快速添加</el-button>
      <el-button size="mini">预览</el-button>
      <el-button size="mini">导出</el-button>

      <el-button size="mini">上移</el-button>
      <el-button size="mini">下移</el-button>
    </div>
  </div>
</template>

<script>
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
              id: 10,
              name: "title",
              type: "string",
              description: "标题",
              required: true,
              sample: "我和我的祖国",
              demo: "",
              sequence: 1,
              childs: [
                {
                  id: 110,
                  name: "title",
                  type: "string",
                  description: "标题",
                  required: true,
                  sample: "我和我的祖国",
                  demo: "",
                  sequence: 1,
                  childs: []
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "title",
          type: "string",
          description: "标题",
          required: true,
          sample: "我和我的祖国",
          demo: "",
          sequence: 1,
          childs: []
        }
      ],
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
    insertRow: function(scope) {
      console.log(scope)

      if (! scope.row.childs ) { scope.row.childs = [] }
      scope.row.childs.push({
        id: + `${scope.row.id}${new Date().getTime()}`,
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
    delRow: function(scope) {
      // console.log('scope', scope)
      // const data = JSON.stringify(this.renderData)
      // const targetId = scope.row.id
      // // console.log(JSON.stringify(data))
      // const arr = data.split(`{"id":${scope.row.id}`)
      // // console.log(arr)
      // const r = arr[1].split('')
      // let trueR = []
      // // console.log(r)
      // let c = false
      // r.forEach(el => {
      //   if (el !== '}' && !c) {
      //     return
      //   }
      //   c = true
      //   trueR.push(el)
      // })
      // console.log(trueR)
      // console.log(trueR.join(""))
      // console.log(arr[1])
      // console.log(arr[0])
      // const f = `${arr[0]}${trueR.join("")}`
      // console.log('f', f)
      // this.renderData = JSON.parse(f)
    },

    addNew: function() {
      this.renderData.push({
        id: + `${this.renderData.length + 1}${new Date().getTime()}`,
        name: "title",
        type: "string",
        description: "标题",
        required: true,
        sample: "我和我的祖国",
        demo: "",
        sequence: 1,
        childs: []
      })
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


