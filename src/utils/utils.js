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
    return value === "true" ? true : value === "" ? "" : false;
  } else {
    return value === "(NULL)" ? null : value;
  }
}
