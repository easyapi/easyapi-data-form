# EasyAPI JSON表单组件

## 组建命名

easyapi-json-form

## 组建描述

EasyAPI JSON表单编辑组建，使用表格形式编辑JSON数据，另外还包括数据类型（字段类型），数据注释（字段描述），是否必填，示例值，默认值。

## 组建效果图
![image](https://qiniu.easyapi.com/easyapi-json-form.png)

> 本组建重点在于下一级数据的显示风格

## 数据格式

传入数据格式与输出数据格式一致

> JSON示例如下：
```json
{
  "id": 0,
  "name": "blog",
  "type": "object",      
  "description": "博客",
  "required": true,
  "sample": "",
  "demo": "",
  "sequence": 1,
  "childs":[
    {
      "id": 00,
      "name": "title",
      "type": "string",
      "description": "标题",
      "required": true,
      "sample": "我和我的祖国",
      "demo": "",
      "sequence": 1
    }
  ]
}
```

## 方法说明

*1、getJSONFormData 获取JSON表单数据*

*2、importJSON 导入标准JSON数据*
> 使用JSON的Value作为示例值，并自动处理数据类型

*3、exportJSON 导出标准JSON数据*
> 使用示例值作为JSON的Value

## 更多

*数据类型（字段类型）*
> string, number, boolean, integer, float, double, object, array

## Example

```
<template>
  <el-json-form :jsonData="jsonData" v-model="jsonData"></el-json-form>
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
      ]
    };
  },
  mounted: function() {}
};
</script>

```

