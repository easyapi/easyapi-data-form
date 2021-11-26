<template>
  <div class="content">
    <h1 class="title">easyapi-json-form</h1>
    <easyapi-json-form :jsonData="jsonData" :ifArray="ifArray" :ifObject="ifObject" ref="jsonForm"></easyapi-json-form>
    <div class="tools-btn pure-form">
      <el-button class="pure-button" @click="addNew">addNew</el-button>
      <el-button class="pure-button" @click="getJSONFormData">getJSONFormData</el-button>
      <el-button class="pure-button" @click="exportJSON">exportJSON</el-button>
      <el-button class="pure-button" @click="ifArrayFun">ifArray</el-button>
      <el-button class="pure-button" @click="ifObjectFun">ifObject</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function () {
    return {
      ifArray: false,
      ifObject: false,
      jsonData: [
        {
          id: 1,
          name: "blog",
          type: "object",
          description: "博客",
          required: false,
          sample: "",
          demo: "",
          childs: [
            {
              id: 10,
              name: "user",
              type: "array",
              description: "作者",
              required: true,
              sample: "我和我的祖国",
              demo: "",
              childs: [
                {
                  id: 100,
                  name: "name",
                  type: "object",
                  description: "名称",
                  required: true,
                  sample: "张三",
                  demo: "",
                  childs: [],
                  level: 3,
                  parentId: 10,
                }, {
                  id: 101,
                  name: "email",
                  type: "string",
                  description: "邮箱",
                  required: true,
                  sample: "zhangsan@qq.com",
                  demo: "",
                  childs: [],
                  level: 3,
                  parentId: 10,
                }, {
                  id: 102,
                  name: "company",
                  type: "object",
                  description: "公司",
                  required: true,
                  sample: "接口有限公司",
                  demo: "",
                  childs: [
                    {
                      id: 1021,
                      name: "address",
                      type: "string",
                      description: "公司地址",
                      required: true,
                      sample: "中国无锡",
                      demo: "",
                      childs: [],
                      level: 4,
                      parentId: 102,
                    }
                  ],
                  level: 3,
                  parentId: 10,
                }
              ],
              level: 2,
              parentId: 1,
            }
          ],
          level: 1,
          parentId: 0,
        },
        {
          id: 2,
          name: "comments",
          type: "array",
          description: "评论",
          required: true,
          sample: "我和我的祖国",
          demo: "",
          childs: [
            {
              id: 20,
              name: "title",
              type: "string",
              description: "评论标题",
              required: true,
              sample: "写的不错",
              demo: "写的不错",
              childs: [],
              level: 2,
              parentId: 2,
            }, {
              id: 21,
              name: "content",
              type: "string",
              description: "评论内容",
              required: true,
              sample: "最是我见过最棒的文章",
              demo: "",
              childs: [],
              level: 2,
              parentId: 2,
            }
          ],
          level: 1,
          parentId: 0,
        }
      ]
    };
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
    }
  },
  mounted: function () {
    this.ifArray = true;
    this.ifObject = true;
  }
};
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");

.tools-btn {
  margin-top: 20px;
}
</style>


