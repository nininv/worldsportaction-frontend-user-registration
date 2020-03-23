import moment from 'moment'
function liveScore_formateDateTime(date) {
    let formatedDate = moment(date).format("DD/MM/YYYY HH:MM")
    return formatedDate
}

function liveScore_formateDate(date) {
    let formatedDate = moment(date).format("DD/MM/YYYY")
    return formatedDate
}

function formateTime(time) {
    let formatedDate = time.format('HH:mm')
    return formatedDate
}


function getDayName(date) {
    let dayName = moment(date).format('ddd');
    return dayName;
}

function getTime(date) {
    let time = moment(date).format('HH:mm');
    return time;
}

function isDateSame(date1, date2) {
    let status = moment(date1).isSame(date2);
    return status;
}

function sortArrayByDate(dateArray) {
    const sortedArray = dateArray.sort((a, b) => moment(a) - moment(b));
    return sortedArray;
}
function formatDateTime(date_time) {
    console.log(date_time)
    var dt = new Date(date_time);
    let formatedValue = dt.toISOString()
    console.log(formatedValue)
    return formatedValue
}

export {
    liveScore_formateDate,
    formateTime,
    liveScore_formateDateTime,
    getDayName,
    getTime,
    isDateSame,
    sortArrayByDate,
    formatDateTime
}