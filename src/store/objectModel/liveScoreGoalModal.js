export function getGoalListData(data) {
    const goalArray = [];
    for (let i in data) {
        const object = this.getGoalListObject(data[i]);
        goalArray.push(object);
    }
    return goalArray;
}

export function getGoalListObject(data) {
    return {
        playerId: data.playerId,
        teamName: data.teamName,
        firstName: data.firstName,
        lastName: data.lastName,
        gamePositionName: data.gamePositionName,
        goal: data.goal,
        miss: data.miss,
        penalty_miss: data.penalty_miss,
        goal_percent: (data.goal_percent * 100).toFixed(2) + "%",
        attempts: Number(data.goal) + Number(data.miss),
    };
}
