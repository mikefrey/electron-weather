const fetch = require('./fetch')

class Wunderground {
  constructor (key) {
    this.key = key
  }

  url (path) {
    return `http://api.wunderground.com/api/${this.key}/${path}.json`
  }

  async currentConditions (search = 'autoip') {
    const url = this.url(`conditions/q/${search}`)
    const result = await fetch(url)
    return result.current_observation
  }

  async forecast (search = 'autoip') {
    const url = this.url(`forecast/q/${search}`)
    const result = await fetch(url)
    return result.forecast.simpleforecast.forecastday
  }

  async forecast10Day (search = 'autoip') {
    const url = this.url(`forecast10day/q/${search}`)
    const result = await fetch(url)
    return result.forecast.simpleforecast.forecastday
  }
}

module.exports = Wunderground
