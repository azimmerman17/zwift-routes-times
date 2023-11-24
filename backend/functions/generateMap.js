function generateMap(data) {
  let newMap = new Map()
  for (key in data) {
    newMap.set(key, data[`${key}`])
  }
  return newMap
}

module.exports = generateMap