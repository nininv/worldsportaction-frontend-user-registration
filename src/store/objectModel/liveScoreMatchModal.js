export function getData(data) {
    const arr = [];
    for (let i in data) {
        const object = this.getMatchDivisionObject(data[i]);
        arr.push(object);
    }
    return arr;
}

export function getMatchDivisionObject(data) {
    return {
        id: data.id,
        name: data.name,
    };
}
