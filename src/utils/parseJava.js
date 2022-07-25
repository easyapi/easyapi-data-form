import {optimizeType} from "./utils";

/**
 *  解析JAVA实体类
 */
export function parseJavaEntity(value) {
  let arr = [];
  return arr
    .concat(docComments(value))
    .concat(blockComments(value))
    .concat(endLineComments(value))
    .concat(upLinkComments(value));
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
        description: getComments(item, 3),
      });
    });
  }
  return data;
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
 *  获取数据 返回name type
 */
function getData(value) {
  let regExp = /\public|private|\s.*?\;/;
  let resultList = value.match(regExp);
  let arr = [];
  if (resultList.length > 0) {
    arr = resultList[0].replace(";", "").match(/[A-Za-z]+/g);
  }
  return {
    name: arr[arr.length - 1],
    type: optimizeType(arr[arr.length - 2]),
  };
}
