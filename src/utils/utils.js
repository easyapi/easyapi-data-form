/**
 * 根据参数类型优化参数
 */
export function optimizeParams(type, value) {
  if (type == "int" || type == "double") {
    return Number(value);
  } else if (type == "boolean") {
    return value == "true" ? true : value == "" ? "" : false;
  } else {
    return value;
  }
}
