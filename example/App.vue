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
      :mockValues="mockValues"
      :ifMock="true"
      :ifStruct="true"
      :struct="struct"
      :fontSize="fontSize"
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
      <el-button class="pure-button" @click="importXML">importXML</el-button>
      <el-button class="pure-button" @click="exportXML">exportXML</el-button>
      <el-button class="pure-button" @click="getDataFormRoot"
        >getDataFormRoot</el-button
      >
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
      fontSize: 12,
      struct: [
        {
          addTime: "2022-04-07 17:13:55",
          category: null,
          description: "school",
          fields: [
            {
              childs: [],
              demo: null,
              description: "返回码",
              mock: null,
              name: "code",
              struct: null,
              type: "int",
            },
            {
              childs: [],
              demo: null,
              description: "返回说明",
              mock: null,
              name: "message",
              struct: null,
              type: "string",
            },
            {
              childs: [
                {
                  childs: null,
                  demo: "",
                  description: "学校名称",
                  mock: null,
                  name: "name",
                  struct: null,
                  type: "string",
                },
                {
                  childs: null,
                  demo: "",
                  description: "学校地址",
                  mock: null,
                  name: "address",
                  struct: null,
                  type: "string",
                },
                {
                  childs: [
                    {
                      childs: null,
                      demo: "",
                      description: "城市名称",
                      mock: null,
                      name: "name",
                      struct: null,
                      type: "string",
                    },
                    {
                      childs: null,
                      demo: "",
                      description: "省份名称",
                      mock: null,
                      name: "province",
                      struct: null,
                      type: "string",
                    },
                    {
                      childs: null,
                      demo: "",
                      description: "区号",
                      mock: null,
                      name: "areaCode",
                      struct: null,
                      type: "string",
                    },
                  ],
                  demo: "",
                  description: "城市",
                  mock: null,
                  name: "city",
                  struct: "city",
                  type: "object",
                  ifStruct: true,
                },
              ],
              demo: null,
              description: "",
              mock: null,
              name: "content",
              struct: "school",
              type: "array",
            },
          ],
          name: "school",
          structId: 5228,
          updateTime: "2022-04-11 11:55:18",
        },
        {
          addTime: "2022-04-04 14:00:27",
          category: null,
          description: "用户表",
          fields: [
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "用户ID",
              mock: null,
              name: "id",
              required: true,
              struct: null,
              type: "int",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "版本号",
              mock: null,
              name: "version",
              required: false,
              struct: null,
              type: "int",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "添加时间",
              mock: null,
              name: "add_time",
              required: false,
              struct: null,
              type: "datetime",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "更新时间",
              mock: null,
              name: "update_time",
              required: false,
              struct: null,
              type: "datetime",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "类型（manage管理员，user用户，vipVIP用户）",
              mock: null,
              name: "type",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "用户名",
              mock: null,
              name: "username",
              required: true,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "密码",
              mock: null,
              name: "password",
              required: true,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: "",
              demo: null,
              description: "昵称",
              mock: null,
              name: "nickname",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "真实姓名",
              mock: null,
              name: "real_name",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "手机号码",
              mock: null,
              name: "mobile",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: "",
              demo: null,
              description: "头像",
              mock: null,
              name: "photo",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "证件类型",
              mock: null,
              name: "id_type",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "证件号码",
              mock: null,
              name: "id_card",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "性别（是否男性）",
              mock: null,
              name: "male",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: "0",
              demo: null,
              description: "年龄",
              mock: null,
              name: "age",
              required: false,
              struct: null,
              type: "int",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "出生日期",
              mock: null,
              name: "birthday",
              required: false,
              struct: null,
              type: "date",
            },
            {
              childs: null,
              defaultValue: "0",
              demo: null,
              description: "身高CM",
              mock: null,
              name: "height",
              required: false,
              struct: null,
              type: "double",
            },
            {
              childs: null,
              defaultValue: "0.00",
              demo: null,
              description: "体重KG",
              mock: null,
              name: "weight",
              required: false,
              struct: null,
              type: "double",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "部门",
              mock: null,
              name: "department",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "职业",
              mock: null,
              name: "job",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "职位",
              mock: null,
              name: "job_title",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "自我介绍（个性签名）",
              mock: null,
              name: "intro",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "省份",
              mock: null,
              name: "province",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "城市",
              mock: null,
              name: "city",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "是否残疾人",
              mock: null,
              name: "if_the_disabled",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "残疾人证",
              mock: null,
              name: "disability_certificate",
              required: false,
              struct: null,
              type: "varchar",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "是否有陪同人员",
              mock: null,
              name: "if_escort_member",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "是否需要轮椅",
              mock: null,
              name: "if_wheelchair",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "是否需要导航自助机",
              mock: null,
              name: "if_self_service",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "来访总次数",
              mock: null,
              name: "visitor_count",
              required: false,
              struct: null,
              type: "int",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "最近来访时间",
              mock: null,
              name: "last_visitor_time",
              required: false,
              struct: null,
              type: "datetime",
            },
            {
              childs: null,
              defaultValue: "0",
              demo: null,
              description: "陪同人员数量",
              mock: null,
              name: "member_count",
              required: false,
              struct: null,
              type: "int",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "帐号是否过期",
              mock: null,
              name: "account_expired",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "帐号是否锁住",
              mock: null,
              name: "account_locked",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "凭证是否过期",
              mock: null,
              name: "credentials_expired",
              required: false,
              struct: null,
              type: "bit",
            },
            {
              childs: null,
              defaultValue: null,
              demo: null,
              description: "是否可用",
              mock: null,
              name: "account_enabled",
              required: false,
              struct: null,
              type: "bit",
            },
          ],
          name: "user",
          structId: 5225,
          updateTime: "2022-04-04 14:00:27",
        },
      ],
      jsonData: [
        {
          name: "根节点",
          type: "object",
          description: "博客",
          required: true,
          demo: null,
          defaultValue: "",
          mock: "@666",
          childs: [
            {
              name: "user",
              type: "array",
              description: "作者",
              required: true,
              demo: "我和我的祖国",
              defaultValue: "",
              mock: "@abc",
              childs: [
                {
                  name: "name",
                  type: "object",
                  description: "名称",
                  required: true,
                  demo: "张三",
                  defaultValue: "",
                  childs: [],
                },
                {
                  name: "company",
                  type: "object",
                  description: "公司",
                  required: true,
                  demo: "接口有限公司",
                  defaultValue: "",
                  childs: [
                    {
                      name: "address",
                      type: "string",
                      description: "公司地址",
                      required: true,
                      demo: "中国无锡",
                      defaultValue: "",
                      childs: [],
                    },
                  ],
                },
                {
                  name: "email",
                  type: "string",
                  description: "邮箱",
                  required: true,
                  demo: "zhangsan@qq.com",
                  defaultValue: "",
                  childs: [],
                },
              ],
            },
          ],
        },
      ],
      parameter: "path",
      unshownRequired: true,
      unshownDefault: true,
      mockValues: [
        { value: "@boolean", label: "布尔" },
        { value: "@natural", label: "自然数" },
        { value: "@integer" },
        { value: "@float" },
        { value: "@character" },
        { value: "@string" },
        { value: "@range" },
        { value: '@date("yyyy-MM-dd")' },
        { value: '@time("HH:mm:ss")' },
        { value: '@datetime("yyyy-MM-dd HH:mm:ss")' },
        { value: '@now("yyyy-MM-dd HH:mm:ss")' },
        { value: '@image("200x100","#50B347","#FFF","Text")' },
        { value: '@dataImage("200x100","Text")' },
        { value: "@color" },
        { value: "@hex" },
        { value: "@rgb" },
        { value: "@hsl" },
        { value: "@paragraph" },
        { value: "@sentence" },
        { value: "@word" },
        { value: "@title" },
        { value: "@cparagraph" },
        { value: "@csentence" },
        { value: "@cword" },
        { value: "@ctitle" },
        { value: "@first" },
        { value: "@last" },
        { value: "@name" },
        { value: "@cfirst" },
        { value: "@clast" },
        { value: "@cname" },
        { value: "@url" },
        { value: "@domain" },
        { value: "@protocol" },
        { value: "@tld" },
        { value: "@email" },
        { value: "@ip" },
        { value: "@region" },
        { value: "@province" },
        { value: "@city" },
        { value: "@county" },
        { value: "@zip" },
        { value: '@capitalize("text")' },
        { value: '@upper("text")' },
        { value: '@lower("TEXT")' },
        { value: '@pick(["a", "e", "i", "o", "u"])' },
        { value: '@shuffle(["a", "e", "i", "o", "u"])' },
        { value: "@guid" },
        { value: "@id" },
        { value: "@increment" },
      ],
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
    getDataFormRoot() {
      let root = this.$refs.jsonForm.getDataFormRoot();
      console.log(root);
    },
    addNew() {
      this.$refs.jsonForm.addNew();
    },
    getJSONFormData() {
      let d = this.$refs.jsonForm.getJSONFormData("JSON");
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
    importXML: function () {
      let xml = `<bookstore>
<book category="COOKING">
  <title lang="en">Everyday Italian</title> 
  <author>Giada De Laurentiis</author> 
  <year>2005</year> 
  <price>30.00</price> 
</book>
<book category="CHILDREN">
  <title lang="en">Harry Potter</title> 
  <author>J K. Rowling</author> 
  <year>2005</year> 
  <price>29.99</price> 
</book>
<book category="WEB">
  <title lang="en">Learning XML</title> 
  <author>Erik T. Ray</author> 
  <year>2003</year> 
  <price>39.95</price> 
</book>
</bookstore>`;
      this.$refs.jsonForm.importXML(xml);
    },
    exportXML() {
      let xml = this.$refs.jsonForm.exportXML();
      console.log(xml);
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
