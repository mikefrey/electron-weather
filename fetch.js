const https = require('https')
const http = require('http')
const Url = require('url')

function fetch (url) {
  const {hostname, path, protocol} = Url.parse(url)
  const opts = {
    hostname, path, method: 'GET'
  }

  const request = protocol.startsWith('https') ? https.request.bind(https) : http.request.bind(http)

  return new Promise((resolve, reject) => {
    const req = request(opts, res => {
      if (res.statusCode >= 300) {
        console.error('something happened!', res.statusCode)
        reject(new Error(`request failed with status ${res.statusCode}`))
      }

      let b = Buffer.from('')
      res.on('data', d => { b = Buffer.concat([b, d]) })
      res.on('end', () => resolve(JSON.parse(b.toString())))
      res.on('error', e => reject(e))
    })
    req.end()
  })
}

module.exports = fetch
