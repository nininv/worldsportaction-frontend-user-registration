import moment from "moment";

export const isArrayNotEmpty = (array) => {
    return array !== null && Array.isArray(array) && array.length > 0;
};
export const isArrayEmpty = array => {
    return (array !== null && Array.isArray(array) && array.length === 0);
}

export const isNullOrEmptyString = (word) => {
    return word !== null && word !== undefined && word.length > 0;
};

export const isNullOrUndefined = (e) => {
    return e === null || e === undefined ? false : e;
};

export const feeIsNull = (fee) => {
    return fee === null || fee === undefined ? 0 : stringTOFloatNumberReg(fee);
};

export const getAge = (birthDate) => {
    let dob = moment(birthDate, "MM-DD-YYYY").format("YYYY-MM-DD");
    return moment().diff(dob, "years", false);
};
// export const getAge = (birthDate) => (Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10));

export const disabledFutureDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
}

export const deepCopyFunction = (inObject) => {
    let outObject, value, key;

    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
        value = inObject[key];

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] =
            typeof value === "object" && value !== null
                ? deepCopyFunction(value)
                : value;
    }

    return outObject;
};

export const formatValue = (val) => {
    return val === null ? "0.00" : stringTOFloatNumberReg(val).toFixed(2);
};

export const stringTOFloatNumber = (checkString) => {
    return typeof checkString === "string"
        ? parseFloat(checkString)
        : checkString;
};

export const stringTOFloatNumberReg = (checkString) => {
    return typeof checkString === "string"
        ? Number(Number(checkString).toFixed(2))
        : Number(Number(checkString).toFixed(2));
};

export const captializedString = (value) => {
    if (value != undefined) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
};

export const getCurrentYear = (yearArr) => {
    let currentYear = moment().year();
    let currentYearIndex = yearArr.findIndex((x) => x.name == currentYear);
    if (currentYearIndex === -1) {
        return yearArr[0].id;
    } else {
        return yearArr[currentYearIndex].id;
    }
};

export const compare = (a, b) => {
    const bandA = a.sortOrder;
    const bandB = b.sortOrder;
    let comparison = 0;
    if (bandA < bandB) {
        comparison = 1;
    } else if (bandA > bandB) {
        comparison = -1;
    }
    return comparison;
};

export const reverseArray = (array) => {
    return array.sort(compare);
};

export const regexNumberExpression = (number) => {
    if (number) {
        return number.replace(/[^\d]/g, "");
    }
};

export const getStringWithPassedValues = (string = "", values = {}) => {
    try {
        const list = Object.entries(values);
        return list.reduce((acc, [key, value]) => {
            return acc.replace(`{{${key}}}`, value);
        }, string);
    } catch (err) {
        console.log('Error "getStringWithPassedValues"', err.message);
    }
};
