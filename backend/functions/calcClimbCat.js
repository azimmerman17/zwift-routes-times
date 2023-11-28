// calculates the catagory of a climb
// rules must be over 300m with average 3.0%
function calcClimbCat(l, e) {
  let grade = calcClimbCat(l, e)
  l = l * 1000
  if (l < 300 || grade < 3.0) return 'NC'
  // calc the catagory length(m) * average Grade
  let catagory = l * grade
  if (catagory >= 80000) return 'HC'
  else if (catagory >= 64000) return 1
  else if (catagory >= 32000) return 2
  else if (catagory >= 16000) return 3
  else if (catagory >= 8000) return 4
  else return 'NC'
}

modules.export = calcClimbCat