import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import {Input} from 'antd';

import './style.css';
import AppConstants from '../../../../themes/appConstants';

const mapAddressInfo = (addressComponents) => {
  if (addressComponents.length > 0) {
    let streetNumber = null;
    let address  = null;
    let suburb  = null;
    let postCode  = null;
    let state  = null;
    let country  = null;
    for (let i = 0; i < addressComponents.length; i++) {
      if (addressComponents[i].types.includes('street_number')) {
        streetNumber = addressComponents[i].short_name;
      }
      if (addressComponents[i].types.includes('route')) {
        address = addressComponents[i].short_name;
      }
      if (addressComponents[i].types.includes('locality')) {
        suburb = addressComponents[i].short_name;
      }
      if(addressComponents[i].types.includes('postal_code')){
        postCode = addressComponents[i].short_name;
      }
      if(addressComponents[i].types.includes('administrative_area_level_1')){
        state = addressComponents[i].short_name;
      }
      if(addressComponents[i].types.includes('country')){
        country = addressComponents[i].short_name;
      }
    }
    let addressData = {
      addressOne: streetNumber ? streetNumber + ' ' + address : address,
      suburb: suburb,
      state: state,
      postcode: postCode,
      country: country
    }
    return addressData;
  }
  return null;
};

const PlacesAutocomplete = ({
  defaultValue, heading, error, required, onSetData, ...otherProps
}) => {
  const [defaultAddress, setDefaultAddress] = useState(defaultValue);
  useEffect(() => {
    setDefaultAddress(defaultValue);
  }, [defaultValue]);

  const {
    ready,
    value,
    suggestions: {status, data},
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {country: ['au']},
    },
    debounce: 300,
  });

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e) => {
    setValue(e.target.value);
    setDefaultAddress(null);
  };

  const handleSelect = ({description}) => () => {
    setValue(description, false);
    clearSuggestions();
    let mapData = null;

    // Get latitude and longitude via utility functions
    getGeocode({address: description})
      .then((results) => {
        mapData = mapAddressInfo(results[0].address_components);
        return getLatLng(results[0])
      })
      .then(({lat, lng}) => {

        const result = mapData ? {
          ...mapData,
          lat,
          lng,
        } : null;

        onSetData(result);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const renderSuggestions = () => data.map((suggestion) => {
    const {
      place_id,
      structured_formatting: {main_text: mainText, secondary_text: secondaryText},
    } = suggestion;

    return (
      <li key={place_id} onClick={handleSelect(suggestion)}>
        <strong>{mainText}</strong>
        {' '}
        <small>{secondaryText}</small>
      </li>
    );
  });

  return (
    <div className="place-auto-complete-container" ref={ref}>
      {heading && (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className={`input-heading ${required ? 'required-field' : ''}`} style={{paddingBottom:0}}>{heading}</span>
        </div>
      )}
      <Input
        className={error ? 'input-error' : 'input'}
        value={value || defaultAddress}
        onChange={handleInput}
        disabled={!ready}
        placeholder={AppConstants.pleaseInputAddress}
        autoComplete="new-password"
        {...otherProps}
      />
      {status !== 'OK' && error && (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className="place-auto-complete-input-error-message">{error}</span>
        </div>
      )}
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && (
        <ul className="place-location">
          {renderSuggestions()}
          <li className="logo" key="google">
            <img
              src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png"
              alt="Powered by Google"
            />
          </li>
        </ul>
      )}
    </div>
  );
};

PlacesAutocomplete.propTypes = {
  heading: PropTypes.string,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  onSetData: PropTypes.func,
};

PlacesAutocomplete.defaultProps = {
  heading: '',
  defaultValue: null,
  required: false,
  error: '',
  onSetData: () => {
  },
};

export default PlacesAutocomplete;
