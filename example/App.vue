<template>
  <div>
    <el-json-form :jsonData="jsonData" ref="jsonForm"></el-json-form>
    <el-button @click="getJSON">获取标准JSON</el-button>
  </div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
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
              name: "title",
              type: "array",
              description: "标题",
              required: true,
              sample: "我和我的祖国",
              demo: "",
              childs: [
                {
                  id: 100,
                  name: "title",
                  type: "object",
                  description: "标题",
                  required: true,
                  sample: "我和我的祖国",
                  demo: "",
                  childs: [
                    {
                      id: 1000,
                      name: "title",
                      type: "string",
                      description: "标题",
                      required: true,
                      sample: "我和我的祖国",
                      demo: "",
                      childs: []
                    }
                  ]
                },
                {
                  id: 101,
                  name: "title",
                  type: "string",
                  description: "标题",
                  required: true,
                  sample: "我和我的祖国",
                  demo: "",
                  childs: []
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "title",
          type: "array",
          description: "标题",
          required: true,
          sample: "我和我的祖国",
          demo: "",
          childs: [
            {
              id: 20,
              name: "title",
              type: "string",
              description: "标题",
              required: true,
              sample: "我和我的祖国",
              demo: "",
              childs: []
            }
          ]
        }
      ]
    };
  },
  methods: {
    getJSON() {
      let d = this.$refs.jsonForm.exportJSON();
      console.log(d);
    }
  },
  mounted: function() {}
};
</script>

<style>
@import url("../node_modules/highlight.js/styles/github.css");
</style>


