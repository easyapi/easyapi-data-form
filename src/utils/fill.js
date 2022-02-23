/**
 * 填充ID等参数
 * @param array 原数组
 */
let fillId = function (array) {
  return childs(array, 0, 1)
}

/**
 * 子元素处理
 * @param array 数组
 * @param parentId 父级ID
 * @param level 第几级（从1开始）
 */
function childs(array, parentId, level) {
  for (let i in array) {
    if(array[i].demo == null){
      array[i].demo = "";
    }
    array[i].id = parseInt(level + "" + i);
    array[i].parentId = parentId;
    if (array[i].childs && array[i].childs.length > 0) {
      childs(array[i].childs, array[i].id, level + 1)
    }
  }
  return array;
}

export {
  fillId
}
