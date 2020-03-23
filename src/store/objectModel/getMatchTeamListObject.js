import moment from 'moment'
import { liveScore_formateDate } from '../../themes/dateformate'

function getMatchListSettings(data) {

    // console.log(data, "array setting");
    var matchlist = [];
    for (let i in data) {
        var object = getData(data[i]);
        matchlist.push(object);
    }

    return matchlist;
}

function getData(data) {
    // console.log(data, "*** DATAT ****")
    return {
        id: data.id,
        team1Score: data.team1Score,
        team2Score: data.team2Score,
        score: data.team1Score + " : " + data.team2Score,
        venueId: data.venueCourtId,
        competitionId: data.competitionId,
        divisionId: data.divisionId,
        team1Id: data.team1Id,
        team2Id: data.team2Id,
        // startTime: moment(data.startTime).format("DD/MM/YYYY hh:mm"),
        // startTime: liveScore_formateDate(data.startTime),
        startTime: data.startTime,
        type: data.type,
        matchDuration: data.matchDuration,
        breakDuration: data.breakDuration,
        qtrBreak: data.type == "FOUR_QUARTERS" ? data.breakDuration : "",
        mainBreakDuration: data.type == "FOUR_QUARTERS" ? data.mainBreakDuration : data.breakDuration,
        extraTimeDuration: data.extraTimeDuration,
        scorerStatus: data.scorerStatus,
        mnbMatchId: data.mnbMatchId,
        mnbPushed: data.mnbPushed,
        matchEnded: data.matchEnded,
        matchStatus: data.matchStatus,
        endTime: moment(data.endTime).format("DD/MM/YYYY hh:mm"),
        team1ResultId: data.team1ResultId,
        team2ResultId: data.team2ResultId,
        roundId: data.roundId,
        originalStartTime: data.originalStartTime,
        pauseStartTime: data.pauseStartTime,
        totalPausedMs: data.totalPausedMs,
        centrePassStatus: data.centrePassStatus,
        centrePassWonBy: data.centrePassWonBy,
        deleted_at: data.deleted_at,
        created_at: data.created_at,
        updated_at: data.updated_at,
        team1: team1(data.team1),
        team2: team2(data.team2),
        venueCourt: venueCourt(data.venueCourt),
        division: division(data.division),
        competition: competition(data.competition),
        round: round(data.round)
    }
}


//Team 1 data
function team1(data) {

    return {
        id: data.id,
        name: data.name,
        divisionId: data.divisionId,
        logoUrl: data.logoUrl,
        competitionId: data.competitionId,
        nameFilter: data.nameFilter,
        clubId: data.clubId,
        gameTimeTrackingOverride: data.gameTimeTrackingOverride,
        positionTracking: data.positionTracking

    }
}

//Team 2 data
function team2(data) {
    return {
        id: data.id,
        name: data.name,
        divisionId: data.divisionId,
        logoUrl: data.logoUrl,
        competitionId: data.competitionId,
        nameFilter: data.nameFilter,
        clubId: data.clubId,
        gameTimeTrackingOverride: data.gameTimeTrackingOverride,
        positionTracking: data.positionTracking
    }
}

//Venue Data
function venueCourt(data) {
    return {
        id: data.id,
        name: data.name ? data.name : "",
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        parentId: data.parentId,
        parent: {
            id: data.id,
            name: data.name,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            parentId: data.parentId
        }
    }

}

//Division Data

function division(data) {
    return {
        id: data.id,
        name: data.name,
        age: data.age,
        grade: data.grade,
        competitionId: data.competitionId
    }
}

function competition(data) {
    return {
        id: data.id,
        name: data.name,
        longName: data.longName,
        logoUrl: data.logoUrl,
        recordUmpire: data.recordUmpire,
        gameTimeTracking: data.gameTimeTracking,
        positionTracking: data.positionTracking,
        uploadScores: data.uploadScores,
        uploadAttendance: data.uploadAttendance,
        scoringType: data.scoringType,
        attendanceRecordingType: data.attendanceRecordingType,
        timerType: data.timerType,
        attendanceRecordingPeriod: data.attendanceRecordingPeriod,
        softBuzzerUrl: data.softBuzzerUrl,
        hardBuzzerUrl: data.hardBuzzerUrl,
        recordGoalAttempts: data.recordGoalAttempts,
        centrePassEnabled: data.centrePassEnabled,
        lineupSelectionTime: data.lineupSelectionTime,
        attendanceSelectionTime: data.attendanceSelectionTime,
        lineupSelectionEnabled: data.lineupSelectionEnabled.lineupSelectionEnabled,
        incidentsEnabled: data.incidentsEnabled,
        // location: {
        //     id: data.id,
        //     name: data.name,
        //     abbreviation: data.abbreviation
        // }
    }
}

function round(data) {
    return {
        id: data.id,
        name: data.name,
        sequence: data.sequence,
        competitionId: data.competitionId,
        divisionId: data.divisionId,
    }

}


export { getMatchListSettings }
