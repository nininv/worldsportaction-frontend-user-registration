var moment = require('moment');
const isArrayNotEmpty = array => {
    if (array !== null && Array.isArray(array) && array.length > 0) {
        return true
    } else {
        return false
    }
}

const isNullOrEmptyString = word => {
    if (word !== null && word !== undefined && word.length > 0) {
        return true
    } else {
        return false
    }
}

const isNullOrUndefined = (e) => {
    return (e === null || e === undefined) ? false : e;
}

const feeIsNull = (fee) => {
    return ((fee === null || fee === undefined) ? 0 : (stringTOFloatNumberReg(fee)));
}

// const getAge = (birthDate) => {
//     let dob = moment(birthDate,"MM-DD-YYYY").format("YYYY-MM-DD");
//     return moment().diff(dob, 'years',false)
// }
const getAge = (birthDate) => (Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10));

const deepCopyFunction = inObject => {
    let outObject, value, key

    if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}

    for (key in inObject) {
        value = inObject[key]

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
    }

    return outObject
}

const formatValue = (val) => {
    return val === null ? "0.00" : stringTOFloatNumberReg(val).toFixed(2)
}

const stringTOFloatNumber = (checkString) => {
    return typeof checkString === 'string' ? parseFloat(checkString) : checkString;
}

const stringTOFloatNumberReg = (checkString) => {
    return typeof checkString === 'string' ? Number(Number(checkString).toFixed(2)) : Number(Number(checkString).toFixed(2));
}

const captializedString = (value) => {
    if (value != undefined) {
        let capString = value.charAt(0).toUpperCase() + value.slice(1);
        return capString;
    }
};

const getCurrentYear = (yearArr) => {
    let currentYear = moment().year()
    let currentYearIndex = yearArr.findIndex((x) => x.name == currentYear)
    if (currentYearIndex === -1) {
        return yearArr[0].id
    } else {
        return yearArr[currentYearIndex].id
    }
};

const compare = (a, b) => {
    const bandA = a.sortOrder;
    const bandB = b.sortOrder;
    let comparison = 0;
    if (bandA < bandB) {
        comparison = 1;
    } else if (bandA > bandB) {
        comparison = -1;
    }
    return comparison;
}

const reverseArray = (array) => {
    return array.sort(compare)
};

const regexNumberExpression = (number) => {
    if (number) {
        return number.replace(/[^\d]/g, '');
    }
};

module.exports = {
    isArrayNotEmpty, isNullOrEmptyString, getAge, deepCopyFunction, formatValue,
    isNullOrUndefined, feeIsNull, captializedString, getCurrentYear, reverseArray, regexNumberExpression
}
