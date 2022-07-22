/**
 *  解析JAVA实体类
 */
export function parseJavaEntity(value) {
  let str = value;
  let test = "\/\*\n(\s|.)*?\;";
  let arr = str.match(test);
  console.log(arr);
}
