const http = require('http')
const stackman = require('stackman')()

function sendData(data, port) {
  const options = {
    hostname: `localhost`,
    port: port,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }

  return new Promise((resolve, reject) => {
    const req = http.request(options, resolve)
    req.on('error', e => {
      console.error(e)
      reject(e)
    })

    req.write(data)
    req.end()
  })
}

function sendClear(port) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${port}/clear`, resolve)
    req.on('error', e => {
      console.error(e)
      reject(e)
    })
  })
}

// Serialize requests even if they are not awaited.
const queue = []

function consume() {
  if (queue.length === 0) {
    return
  }

  const item = queue[0]
  let promise
  if (item.clear) {
    promise = sendClear(item.port)
  } else {
    promise = sendData(item.data, item.port)
  }

  return promise
    .then(() => {
      item.resolve()
      queue.shift()
      consume()
    })
    .catch(e => {
      console.error(e)
      item.reject()
      queue.shift()
      consume()
    })
}

function getConstructorName(obj) {
  const ctor = obj && obj.constructor && obj.constructor.name
  if (ctor) {
    return ctor
  }

  const str = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString()
  const match = str.match(/function\s(\w*)/)
  if (!match) {
    return 'Function'
  }

  const cname = match[1]
  const aliases = ['', 'anonymous', 'Anonymous']
  return aliases.indexOf(cname) > -1 ? 'Function' : cname
}

function simplify(value) {
  if (typeof value === 'undefined' || value === null) {
    return null
  }

  const ctor = value.constructor
  if (ctor === Number
    || ctor === String
    || ctor === Boolean
    || ctor === Symbol) {
    return value.valueOf()
  } else {
    return value
  }
}

function convertToObject(value) {
  value = simplify(value)
  if (value && typeof value === 'object') {
    return getJSON(value)
  } else {
    return { value }
  }
}

function getJSON(obj) {
  obj = simplify(obj)

  if (typeof obj === 'number'
    || typeof obj === 'string'
    || typeof obj === 'boolean') {
    return obj
  }

  if (obj && obj.$dump) {
    return obj.$dump()
  }

  if (obj instanceof Date) {
    return {
      $type: 'Date, node.js',
      utc: obj.toUTCString()
    }
  }

  if (obj instanceof RegExp) {
    return {
      $type: 'RegExp, node.js',
      pattern: obj.toString()
    }
  }

  if (typeof obj === 'symbol') {
    const str = obj.toString()
    const key = str.substring(7, str.length - 1)
    if (key.length) {
      return {
        $type: 'Symbol, node.js',
        key
      }
    } else {
      return {
        $type: 'Symbol, node.js'
      }
    }
  }

  if (Array.isArray(obj)) {
    let values = obj
    if (obj.some(item => item && typeof item === 'object')) {
      let exemplar = {}
      obj.forEach(item => {
        Object.keys(convertToObject(item)).forEach(key => {
          exemplar[key] = null
        })
      })

      const [first, ...rest] = obj
      exemplar = {
        ...exemplar,
        ...convertToObject(first),
        $type: 'Object, node.js'
      }

      values = [exemplar, ...rest.map(convertToObject)]
    }

    return {
      $type: 'Array, node.js',
      $values: values
    }
  }

  if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = getJSON(obj[key])
      return acc
    }, { $type: getConstructorName(obj) + ', node.js' })
  }

  // Everything else is itself.
  return obj
}

function dumpInternal(value, title, source) {
  return new Promise((resolve, reject) => {
    queue.push({
      resolve,
      reject,
      port: dump.port,
      data: JSON.stringify({
        $type: 'DumpContainer, node.js',
        $value: value,
        title,
        source
      }) // store a snapshot of current state
    })

    if (queue.length === 1) {
      consume()
    }
  })
}

function trimLine(line) {
  line = line.trim()
  let index = line.indexOf('await ')
  if (index === 0) {
    line = line.substr(6)
  }

  index = line.indexOf('.dump(')
  if (index !== -1) {
    line = line.substr(0, index)
  }

  return line
}

function lineOf(trace) {
  return new Promise((resolve, reject) => {
    if (!trace && !trace.stack) {
      return reject()
    }

    stackman.callsites(trace, (error, callsites) => {
      if (error) {
        return reject(error)
      }

      const site = callsites[1]
      if (!site) {
        return reject()
      }

      site.sourceContext(1, (error, result) => {
        if (error) {
          return reject(error)
        }

        resolve(trimLine(result.line))
      })
    })
  })
}

function dump(data, title) {
  const value = getJSON(data)
  if (!dump.source) {
    return dumpInternal(value, title)
  }

  return lineOf(new Error())
    .then(source => {
      return dumpInternal(value, title, source)
    })
    .catch(() => {
      return dumpInternal(value, title)
    })
}

function dumpSelf(title) {
  const value = getJSON(this)
  if (!dump.source) {
    return dumpInternal(value, title)
  }

  return lineOf(new Error())
    .then(source => {
      return dumpInternal(value, title, source)
    })
    .catch(() => {
      return dumpInternal(value, title)
    })
}

dump.clear = function clear() {
  return new Promise((resolve, reject) => {
    if (queue.length > 1) {
      const items = queue.splice(1, queue.length - 1)
      items.forEach(item => item.resolve())
    }

    queue.push({
      resolve,
      reject,
      port: dump.port,
      clear: true
    })

    if (queue.length === 1) {
      consume()
    }
  })
}

dump.html = function html(htmlString, title) {
  if (typeof htmlString !== 'string') {
    throw new Error('Invalid HTML string.')
  }

  return new Promise((resolve, reject) => {
    queue.push({
      resolve,
      reject,
      port: dump.port,
      data: JSON.stringify({
        $type: 'DumpContainer, node.js',
        $value: {
          $type: 'html',
          $html: htmlString
        },
        title
      })
    })

    if (queue.length === 1) {
      consume()
    }
  })
}

dump.port = 5255
dump.source = true

Object.prototype.dump = dumpSelf
Number.prototype.dump = dumpSelf
String.prototype.dump = dumpSelf
Boolean.prototype.dump = dumpSelf
Symbol.prototype.dump = dumpSelf

module.exports = dump
