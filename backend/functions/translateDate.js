// translates date from YYYY-MM-DD => YYYY-MON-DD

function translateDate(dateString) {
  let dateArray = dateString.split('-')

  switch (dateArray[1]) {
    case '1':
    case '01':
        dateArray[1] = 'JAN'
        break
    case '2':
    case '02':
      dateArray[1] = 'FEB' 
      break
    case '3':
    case '03':
      dateArray[1] = 'MAR' 
      break
    case '4':
    case '04':
      dateArray[1] =  'APR'
      break
    case '5':
    case '05':
      dateArray[1] = 'MAY' 
      break
    case '6':
    case '06':
      dateArray[1] = 'JUN' 
      break
    case '7':
    case '07':
      dateArray[1] = 'JUL' 
      break
    case '8':
    case '08':
      dateArray[1] = 'AUG' 
      break
    case '9':
    case '09':
      dateArray[1] = 'SEP' 
      break
    case '10':
      dateArray[1] = 'OCT'
      break
    case '11': 
      dateArray[1] = 'NOV'
      break
    case '12':
      dateArray[1] = 'DEC'
      break 
    default:
      return dateString
  }
  return dateArray.join('-')
}

module.exports = translateDate