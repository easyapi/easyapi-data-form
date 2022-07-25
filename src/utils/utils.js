/**
 * 根据参数类型优化参数
 */
export function optimizeParams(type, value) {
  if (type === "int" || type === "double") {
    if (value) {
      return Number(value);
    } else {
      return null;
    }
  } else if (type === "boolean") {
    return value === "true" ? true : value === "" ? null : false;
  } else {
    return value === "(NULL)" ? null : value;
  }
}

/**
 * 优化类型
 */
export function optimizeType(type) {
  let lowerCaseType = type.toLowerCase();
  let list = ["int", "datetime"];
  let arr = list.filter((x) => lowerCaseType.indexOf(x) != -1);
  if (arr.length > 0) {
    return arr[0];
  } else {
    return lowerCaseType;
  }
}
