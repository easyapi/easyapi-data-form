<template>
  <div class="content">
    <h1 class="title">easyapi-data-form</h1>
    <easyapi-data-form
      :jsonData="jsonData"
      :ifArray="ifArray"
      :ifObject="ifObject"
      :jsonClass="jsonClass"
      :modelData="modelData"
      :parameter="parameter"
      :ifRequired="ifRequired"
      :ifDefault="ifDefault"
      ref="jsonForm"
    ></easyapi-data-form>
    <div class="tools-btn pure-form">
      <el-button class="pure-button" @click="addNew">addNew</el-button>
      <el-button class="pure-button" @click="getJSONFormData"
        >getJSONFormData</el-button
      >
      <el-button class="pure-button" @click="exportJSON">exportJSON</el-button>
      <el-button class="pure-button" @click="ifArrayFun">ifArray</el-button>
      <el-button class="pure-button" @click="ifObjectFun">ifObject</el-button>
      <el-button class="pure-button" @click="importJSON">importJSON</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function () {
    return {
      ifArray: false,
      type: "form-data22",
      ifObject: false,
      haveRoot: true,
      modelData: null,
      jsonClass: "jsonClass",
      jsonData: [
        {
          // id: 1,
          name: "根节点",
          type: "object",
          description: "博客",
          required: true,
          demo: null,
          defaultValue: "",
          childs: [
            {
              // id: 10,
              name: "user",
              type: "array",
              description: "作者",
              required: true,
              demo: "我和我的祖国",
              defaultValue: "",
              childs: [
                {
                  // id: 100,
                  name: "name",
                  type: "object",
                  description: "名称",
                  required: true,
                  demo: "张三",
                  defaultValue: "",
                  childs: [],
                  level: 3,
                  parentId: 10,
                },
                {
                  // id: 101,
                  name: "email",
                  type: "string",
                  description: "邮箱",
                  required: true,
                  demo: "zhangsan@qq.com",
                  defaultValue: "",
                  childs: [],
                  level: 3,
                  parentId: 10,
                },
                {
                  // id: 102,
                  name: "company",
                  type: "object",
                  description: "公司",
                  required: true,
                  demo: "接口有限公司",
                  defaultValue: "",
                  childs: [
                    {
                      // id: 1021,
                      name: "address",
                      type: "string",
                      description: "公司地址",
                      required: true,
                      demo: "中国无锡",
                      defaultValue: "",
                      childs: [],
                      level: 4,
                      parentId: 102,
                    },
                  ],
                  level: 3,
                  parentId: 10,
                },
              ],
              level: 2,
              parentId: 1,
            },
          ],
          level: 1,
          parentId: 0,
        },
      ],
      parameter: "path",
      ifRequired: true,
      ifDefault: true,
    };
  },
  watch: {
    jsonData: {
      handler(newName, oldName) {
        console.log(this.jsonData);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    addNew() {
      this.$refs.jsonForm.addNew();
    },
    getJSONFormData() {
      let d = this.$refs.jsonForm.getJSONFormData();
      console.log(d);
    },
    exportJSON() {
      let d = this.$refs.jsonForm.exportJSON();
      console.log(d);
    },
    ifObjectFun() {
      this.ifObject = !this.ifObject;
    },
    ifArrayFun() {
      this.ifArray = !this.ifArray;
    },
    importJSON: function () {
      this.$refs.jsonForm.importJSON(
        //   [{
        //   aaa: 123,
        //   bbb: {
        //     ccc: 32,
        //     ddd: 45,
        //     fff: [123, 4556, 67]
        //   }
        // }]
        {
          aaa: 123,
        }
      );
    },
  },
  mounted: function () {
    this.ifArray = true;
    this.ifObject = true;
    this.modelData = [
      {
        value: "宠物店",
        label: "宠物店",
        children: [
          {
            value: "pet",
            label: "pet",
          },
          {
            value: "tag",
            label: "tag",
          },
        ],
      },
    ];
  },
};
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");

.tools-btn {
  margin-top: 20px;
}
</style>
