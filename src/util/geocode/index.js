import zipCodes from './australian_postcodes';

export const convertZipCodeToLatLng = (postalCode) => {
  const zipCode = zipCodes.find((zip) => zip.postcode === postalCode);

  if (!zipCode) {
    return null;
  }

  return {
    lat: zipCode.lat,
    lng: zipCode.long
  }
};

export const deg2rad = (deg) => {
  return deg * (Math.PI/180)
};

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);  // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km

  return d;
};

export const nearByOrganisations = (organisations, postalCode, range) => {
  return organisations.filter((org) => {
    const coordinateA = convertZipCodeToLatLng(org.postalCode);
    const coordinateB = convertZipCodeToLatLng(postalCode);

    if (coordinateA && coordinateB) {
      const distance = getDistanceFromLatLonInKm(coordinateA.lat, coordinateA.lng, coordinateB.lat, coordinateB.lng);

      return distance < range;
    }

    return false;
  })
};
