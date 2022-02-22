/**
 * 填充ID等参数
 */
let fillId = function (array) {
  return childs(array, 0, 1)
}

/**
 * 子元素处理
 */
function childs(array, parentId, level) {
  for (let i in array) {
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
