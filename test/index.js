var test = require("tape")
var reduce = require("reducible/reduce")
var end = require("reducible/end")
var passback = require("callback-reduce/passback")
var event = require("event")
var send = require("event/send")

var EventTypeList = require("../index")
var current = require("../current")

test("EventTypeList is a function", function (assert) {
    assert.equal(typeof EventTypeList, "function")
    assert.end()
})

test("EventTypeList returns a reducible", function (assert) {
    var r = EventTypeList()

    assert.ok(r)
    assert.ok(r.reduce)
    assert.end()
})

test("current returns current state", function (assert) {
    var r = EventTypeList(list([
        { id: 1 }
        , { id: 2 }
        , { id: 3 }
    ]))

    reduce(r, noop)

    var arr = current(r)

    assert.deepEqual(arr, [
        { id: 1 }
        , { id: 2 }
        , { id: 3 }
    ])
    assert.end()
})

test("current is correct", function (assert) {
    var r = EventTypeList([
        { id: 1, eventType: "add" }
        , { id: 2, eventType: "add" }
        , { id: 2, eventType: "add" }
        , { id: 3, eventType: "add" }
        , { id: 1, eventType: "remove" }
        , { id: 4, eventType: "add" }
        , { id: 4, eventType: "remove" }
        , { id: 4, eventType: "remove" }
    ])

    reduce(r, noop)
    reduce(r, noop)
    reduce(r, noop)

    var arr = current(r)

    assert.deepEqual(arr, [
        { id: 2 }
        , { id: 3 }
    ])
    assert.end()
})

test("can reduce multiple times correctly", function (assert) {
    var data = event()
    var r = EventTypeList(data)
    var counter = 0

    passback(r, Array, function (err, list) {
        counter++
        assert.deepEqual(list, [
            { id: 1, eventType: "add" }
            , { id: 2, eventType: "add" }
        ])
    })

    passback(r, Array, function (err, list) {
        counter++
        assert.deepEqual(list, [
            { id: 1, eventType: "add" }
            , { id: 2, eventType: "add" }
        ])
    })

    passback(r, Array, function (err, list) {
        counter++
        assert.deepEqual(list, [
            { id: 1, eventType: "add" }
            , { id: 2, eventType: "add" }
        ])
        assert.end()
    })

    send(data, { id: 1, eventType: "add" })
    send(data, { id: 2, eventType: "add" })
    send(data, end)
})

function list(array) {
    return array.map(function (v) {
        v.eventType = "add"
        return v
    })
}

function noop() {}
