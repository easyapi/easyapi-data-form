import { paramTypes } from "./paramsType";
/**
 *  根据类型添加数据结构
 *  type 类型  value 数据  struct数据结构
 */
export function appendStruct(haveRoot, value, struct) {
  let obj = value;
  // 判断类型不存在
  if (paramTypes.filter((x) => x.value == obj.type).length == 0) {
    // 如果没有根节点的话 type为string类型
    if (!haveRoot) {
      obj.type = "string";
    } else {
      let testRegex = /\List|Set.*?\>/g;
      if (testRegex.test(obj.type)) {
        let name = obj.type.match(/\<.*?\>/g)[0].replace(/\<|\>/g, "");
        let arr = struct.filter((x) => x.name == name);
        obj.type = "array";
        if (arr.length > 0) {
          updateChilds(arr[0].fields, true);
          obj.struct = name;
          obj.childs = arr[0].fields;
        }
      } else {
        let name = obj.type;
        let arr = struct.filter((x) => x.name == name);
        obj.type = "object";
        if (arr.length > 0) {
          updateChilds(arr[0].fields, true);
          obj.struct = name;
          obj.childs = arr[0].fields;
        }
      }
    }
  }
  return obj;
}

function updateChilds(val, value) {
  if (val && val.length > 0) {
    val.forEach((item) => {
      item.ifStruct = value;
      if (!value) {
        item.struct = null;
      }
      updateChilds(item.childs, value);
    });
  }
}
