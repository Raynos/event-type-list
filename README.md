# event-type-list

[![build status][1]][2] [![dependency status][3]][4]

[![browser support][5]][6]

A reducible list abstraction with access to current state

## Example

Assume your data structure is a reducible containing objects
    with `id` and `eventType` fields. The `id` field is just the
    id of that piece of data and `eventType` is either `"add"`
    or `"remove"`.

If you hold those invariants then `event-type-list` transforms
    that reducible into a reducible of the same data except
    you can look at the current state

```js
var event = require("event")
var send = require("event/send")
var EventTypeList = require("event-type-list")
var current = require("event-type-list/current")
var assert = require("assert")

var list = event()
var wrapped = EventTypeList(list)

send(list, { id: 1, eventType: "add" })
send(list, { id: 2, eventType: "add" })
send(list, { id: 3, eventType: "add", custom: "properties" })
send(list, { id: 2, eventType: "remove" })

var state = current(wrapped)
assert.deepEqual(state, [
    { id: 1 }
    , { id: 3, custom: "properties"}
])
```

## Installation

`npm install event-type-list`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Colingo/event-type-list.png
  [2]: http://travis-ci.org/Colingo/event-type-list
  [3]: http://david-dm.org/Colingo/event-type-list/status.png
  [4]: http://david-dm.org/Colingo/event-type-list
  [5]: http://ci.testling.com/Colingo/event-type-list.png
  [6]: http://ci.testling.com/Colingo/event-type-list
