module.exports = current

function current(x) {
    return x.__currentState__()
}
