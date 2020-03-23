function getData(data) {

    var arr = []
    for (let i in data) {
        var object = this.getMatchDivisionObject(data[i])
        arr.push(object)
    }
    return arr
}

function getMatchDivisionObject(data) {
    return {
        id: data.id,
        name: data.name

    }
}
module.exports = { getData, getMatchDivisionObject, }