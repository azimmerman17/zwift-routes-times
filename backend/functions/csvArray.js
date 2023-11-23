// csv file pulled in as a multi line string
function csvArray(csv) {
  // built in split function to build each record
  let lines = csv.split("\n")
  let result = [];

  // first line is the headers
  const headers = lines[0].split(",")

  // loop through each line - skippping the headers 
  for (let i = 1; i < lines.length; i++) {
    let obj = {}
    let currentLine = lines[i].split(",")
    
    // loop through line to create the data object
    for (let j = 0; j < currentLine.length; j++) {
      // transform into number if possible
      if (Number(currentLine[j])) currentLine[j] = Number(currentLine[j]) 
      if (currentLine[j] === "0") currentLine[j] = 0

      obj[headers[j]] = currentLine[j]
    }
    // push record to the result
    result.push(obj)
  }
  //return result as Array
  return result
}

module.exports = csvArray