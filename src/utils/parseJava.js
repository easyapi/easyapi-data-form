import { optimizeType } from "./utils";

/**
 *  解析JAVA实体类
 */
export function parseJavaEntity(value) {
  let arr = [];
  return arr
    .concat(docComments(value))
    .concat(blockComments(value))
    .concat(endLineComments(value))
    .concat(upLinkComments(value))
    .concat(swaggerComments(value));
}

/**
 *  单行注释 行尾
 */
function endLineComments(value) {
  let data = [];
  let test = /([^\r\n]+[\S]+[^\r\n]+\/\/.+)/g;
  let arr = value.match(test);
  if (arr && arr.length > 0) {
    arr.forEach((item) => {
      data.push({
        name: getData(item).name,
        type: getData(item).type,
        demo: getData(item).demo,
        description: getComments(item, 1),
      });
    });
  }
  return data;
}

/**
 *  单行注释 上行
 */
function upLinkComments(value) {
  let data = [];
  let test = /( +)\/\/*(.*)\r?\n+(.*;)/g;
  let arr = value.match(test);
  if (arr && arr.length > 0) {
    arr.forEach((item) => {
      data.push({
        name: getData(item).name,
        type: getData(item).type,
        demo: getData(item).demo,
        description: getComments(item, 4),
      });
    });
  }
  return data;
}

/**
 *  块注释
 */
function blockComments(value) {
  let data = [];
  let test = /\/\*\n(\s|.)*?\;/g;
  let arr = value.match(test);
  if (arr && arr.length > 0) {
    arr.forEach((item) => {
      data.push({
        name: getData(item).name,
        type: getData(item).type,
        demo: getData(item).demo,
        description: getComments(item, 2),
      });
    });
  }
  return data;
}

/**
 *  文档注释 (双星号)
 */
function docComments(value) {
  let data = [];
  let test = /\/\*\*(\s|.)*?\;/g;
  let arr = value.match(test);
  if (arr && arr.length > 0) {
    arr.forEach((item) => {
      data.push({
        name: getData(item).name,
        type: getData(item).type,
        demo: getData(item).demo,
        description: getComments(item, 3),
      });
    });
  }
  return data;
}

/**
 *  swagger格式
 */
function swaggerComments(value) {
  let data = [];
  let test = /\@ApiModelProperty.*\s.*?\;/g;
  let arr = value.match(test);
  if (arr && arr.length > 0) {
    arr.forEach((item) => {
      data.push({
        name: getSwaggerData(item).name,
        type: getSwaggerData(item).type,
        demo: getSwaggerData(item).demo,
        description: getSwaggerData(item).description,
        required: getSwaggerData(item).required,
      });
    });
  }
  return data;
}

/**
 *  获取swagger数据
 */
function getSwaggerData(value) {
  let obj = {
    name: "",
    type: "",
    demo: "",
    description: "",
    required: false,
  };
  let regExp = /([^\r\n]+[\S]+[^\r\n]+;)/g;
  let resultList = value.match(regExp);
  let arr = [];
  if (resultList && resultList.length > 0) {
    arr = resultList[0].replace(";", "").match(/[A-Za-z0-9_]+/g);
    obj.name = arr[arr.length - 1];
    obj.type = optimizeType(arr[arr.length - 2]);
  }
  let commentRegExp = /\@ApiModelProperty.*?\)/g;
  let commentResultList = value.match(commentRegExp);
  let commentArr = [];
  if (commentResultList && commentResultList.length > 0) {
    commentArr = commentResultList[0].match(/\(.*?\)/g);
    if (commentArr && commentArr.length > 0) {
      try {
        let list = commentArr[0].replace(/\(|\)/g, "").split(",");
        let target = {};
        if (list && list.length > 0) {
          list.forEach((item) => {
            target[item.split("=")[0]] = item.split("=")[1].replace(/\"/g, "");
          });
        }
        obj.demo = optimizeDemo(obj.type, target.example) || "";
        obj.description = target.value || "";
        obj.required = target.required == "true" ? true : false || false;
      } catch {
        obj.description = commentArr[0].replace(/\"|\(|\)/g, "");
      }
    }
  }
  return obj;
}

/**
 *  获取注释
 *  type  1 单行 行尾 2 块注释  3 文档注释 4 单行 上行
 */
function getComments(value, type) {
  let regExp = null;
  let comment = null;
  let clearQualifier = /[\s+\r\*\/\n]+/g;
  if (type == 1) {
    comment = value.split("//")[1];
  } else if (type == 2) {
    regExp = /\/\*\n(\s|.)*?\*\//g;
    let resultList = value.match(regExp);
    comment = resultList[0];
  } else if (type == 3) {
    regExp = /\/\*\*\n(\s|.)*?\*\//g;
    let resultList = value.match(regExp);
    comment = resultList[0];
  } else if (type == 4) {
    regExp = /( +)\/\/*(.*)\r?\n/g;
    let resultList = value.match(regExp);
    comment = resultList[0];
  }
  return comment.replace(clearQualifier, "");
}

/**
 *  获取数据 返回name type demo
 */
function getData(value) {
  // let regExp = /\public|private|\s.*?\;/g;
  let regExp = /([^\r\n]+[\S]+[^\r\n]+;)/g;
  let resultList = value.match(regExp);
  let arr = [];
  let obj = {
    name: "",
    type: "",
    demo: "",
  };
  if (resultList.length > 0) {
    if (resultList[0].indexOf("=") != -1) {
      arr = resultList[0]
        .replace(";", "")
        .split("=")[0]
        .match(/[A-Za-z0-9_<>]+/g);
      obj.name = arr[arr.length - 1];
      obj.type = optimizeType(arr[arr.length - 2]);
      obj.demo = optimizeDemo(
        obj.type,
        resultList[0].replace(";", "").split("=")[1]
      );
    } else {
      arr = resultList[0].replace(";", "").match(/[A-Za-z0-9_<>]+/g);
      obj.name = arr[arr.length - 1];
      obj.type = optimizeType(arr[arr.length - 2]);
      obj.demo = "";
    }
  }
  return obj;
}

// 优化示例值
function optimizeDemo(type, value) {
  if (type === "int" || type === "double") {
    if (value) {
      return Number(value);
    } else {
      return null;
    }
  } else if (type === "boolean") {
    if (value) {
      let str = value.toLowerCase();
      if (str.indexOf("true") != -1) {
        return true;
      } else if (str.indexOf("false") != -1) {
        return false;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  return value;
}
