/**
 * 填充ID等参数
 * @param array 原数组
 */
let fillId = function (array) {
  return childs(array, 0, 1, 1);
};

/**
 * 子元素处理
 * @param array 数组
 * @param parentId 父级ID
 * @param level 第几级（从1开始）
 * @param id id（从1开始）
 *
 */
function childs(array, parentId, level, id) {
  const parseJson = (json, parentId, level) => {
    let result = json;
    result.forEach((k, index) => {
      k.id = id++;
      k.parentId = parentId;
      k.level = level;
      if (k.childs && k.childs.length > 0) {
        k.childs = parseJson(k.childs, k.id, k.level + 1);
      }
    });
    return result;
  };
  return parseJson(array, parentId, level);
}

export { fillId };
