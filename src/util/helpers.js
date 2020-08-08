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

const  isNullOrUndefined = (e) => {
  return (e === null || e === undefined) ? false : e;
}

const feeIsNull = (fee) => {
  return ((fee === null||fee===undefined) ? 0 : (stringTOFloatNumber(fee)));
}

const getAge = (birthDate) => {
    return  (Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10))
}

const deepCopyFunction = inObject => 
{
    let outObject, value, key
  
    if(typeof inObject !== "object" || inObject === null) {
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
    return  val === null ? "0.00" : stringTOFloatNumber(val).toFixed(2)
  }

  const stringTOFloatNumber = (checkString) => {
    return typeof checkString === 'string' ? parseFloat(checkString) : checkString;
  }

module.exports = { isArrayNotEmpty, isNullOrEmptyString, getAge, deepCopyFunction,formatValue,
  isNullOrUndefined, feeIsNull }