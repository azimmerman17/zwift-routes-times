function calcAvgGrade(l, e) {
  // ele_gain unit is meters, length unit is km - convert km to meters
  l = l * 1000

  // find horizontal distince => HD = ((length)^2 - (ele_gain)^2)^(1/2)
  d = ((l ** 2) - (e ** 2)) ** (1/2)
  return ((e / d) * 100).toFixed(1)
}

module.exports = calcAvgGrade