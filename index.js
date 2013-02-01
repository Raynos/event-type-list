var reducible = require("reducible")
var reduce = require("reducible/reduce")
var isReduced = require("reducible/is-reduced")
var event = require("event")
var send = require("event/send")
var hub = require("reducers/hub")
var extend = require("xtend")
var invoker = require("invoker")

module.exports = EventTypeList

/* Given a reducible

Return a new reducible which emits data from memory collection
    and then forwards events from hub.

It should reduce the source only once and accumulate the state
    in memory.
*/
function EventTypeList(input) {
    var state = {}
    var eventBus = event()
    var messages = hub(eventBus)
    var counter = 0

    var r = reducible(function (next, initial) {
        counter++
        var invoke = invoker(next, initial, cleanup)

        reduce(messages, invoke)

        if (counter === 1) {
            reduce(input, function (value) {
                if (counter === 0) {
                    return isReduced(null)
                }

                if (value.id &&
                    value.eventType === "add" &&
                    !state[value.id]
                ) {
                    var copy = extend({}, value)
                    ;delete copy.eventType
                    state[copy.id] = copy
                } else if (state[value.id] && value.eventType === "remove") {
                    delete state[value.id]
                }

                send(eventBus, value)
            })
        }

        function cleanup() {
            counter--
        }
    })

    r.__currentState__ = getCurrentState

    return r

    function getCurrentState() {
        return Object.keys(state).map(function (key) {
            return state[key]
        })
    }
}
