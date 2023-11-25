// translates Zwift World from id to name

function translateZwiftWorld(world) {
  let name = world.toLowerCase()
  console.log(name)

  switch (name) {    
    case 'watopia':
      return 1
    case 'richmond':
      return 2
    case 'london':
      return 3
    case 'new-york':
      return 4
    case 'innsbruck':
      return 5
    case 'bologna':
      return 6
    case 'yorkshire':
      return 7
    case 'crit-city':
      return 8
    case 'makuri-island':
      return 9
    case 'france':
      return 10
    case 'paris':
      return 11
    case 'gravel-mountain':
      return 12
    case 'scotland':
      return 13  
    default:
      return 'Not a valid world'
  }
}

module.exports = translateZwiftWorld
