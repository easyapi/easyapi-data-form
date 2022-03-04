<template>
  <div class="content">
    <h1 class="title">easyapi-data-form</h1>
    <easyapi-data-form
      :jsonData="jsonData"
      :ifArray="ifArray"
      :ifObject="ifObject"
      :jsonClass="jsonClass"
      :modelData="modelData"
      :haveRoot="haveRoot"
      :ifBulkEdit="ifBulkEdit"
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
      ifBulkEdit: true,
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
      unshownRequired: true,
      unshownDefault: true,
    };
  },
  watch: {
    jsonData: {
      handler(newName, oldName) {},
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
    },
    exportJSON() {
      let d = this.$refs.jsonForm.exportJSON();
    },
    ifObjectFun() {
      this.ifObject = !this.ifObject;
    },
    ifArrayFun() {
      this.ifArray = !this.ifArray;
    },
    importJSON: function () {
      let obj = {
        code: 1,
        message: "获取成功",
        content: [
          {
            addTime: "2021-12-21 17:40:56",
            door: "大门",
            inTime: "2021-12-21 17:40:59",
            outTime: "2021-12-22 17:41:02",
            remark: "0",
            updateTime: "2021-12-21 17:40:58",
            user: {
              addTime: "2021-10-29 00:00:44",
              age: null,
              id: 459,
              intro: null,
              male: true,
              mobile: null,
              nickname: "张磊@EasyAPI",
              photo:
                "https://thirdwx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLBc6LY3bAVloK4XIYFsbdPmLSf7Fw9m8BSt4SAKHa0bAq8W3PmHN5eLX5wP5dXTGVFlAfqYt1KsRg/132",
              type: null,
              updateTime: "2021-11-26 08:41:10",
              username: "13656171020",
            },
            visitorId: 1,
          },
        ],
        number: 0,
        size: 10,
        numberOfElements: 1,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
      };
      this.$refs.jsonForm.importJSON(obj);
      setTimeout(() => {}, 1000);
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
