import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CITIES_MARKET_DATA,
  DEFAULT_CITY_ID,
  findNearestCity,
  getCityById,
} from '../data/citiesData.js';

const LocationContext = createContext(undefined);

const STORAGE_KEY = 'kisansetu_user_selected_city';

export function LocationProvider({ children }) {
  const [selectedCityId, setSelectedCityId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CITIES_MARKET_DATA.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // LocalStorage might be unavailable
    }
    return DEFAULT_CITY_ID;
  });

  const [geolocationStatus, setGeolocationStatus] = useState('idle');
  const [detectedCoords, setDetectedCoords] = useState(null);
  const [detectedDistanceKm, setDetectedDistanceKm] = useState(null);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const selectedCity = getCityById(selectedCityId);

  const selectCity = (cityId) => {
    const valid = CITIES_MARKET_DATA.find((c) => c.id === cityId);
    if (valid) {
      setSelectedCityId(cityId);
      setIsGpsActive(false);
      setStatusMessage(`Selected market city: ${valid.name}, ${valid.state}`);
      try {
        localStorage.setItem(STORAGE_KEY, cityId);
      } catch {
        // Ignore
      }
    }
  };

  const requestLocationAccess = async () => {
    if (!navigator.geolocation) {
      setGeolocationStatus('unsupported');
      setStatusMessage('Browser does not support GPS location access. Using Hyderabad default.');
      return;
    }

    setGeolocationStatus('detecting');
    setStatusMessage('Accessing GPS coordinates...');

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setDetectedCoords({ lat: latitude, lng: longitude });
          setGeolocationStatus('granted');
          setIsGpsActive(true);

          const { city, distanceKm } = findNearestCity(latitude, longitude);
          setDetectedDistanceKm(distanceKm);
          setSelectedCityId(city.id);

          const msg = `GPS Location verified: Near ${city.name} (${distanceKm} km away, accuracy ±${Math.round(accuracy)}m). Market details updated to ${city.name}!`;
          setStatusMessage(msg);

          try {
            localStorage.setItem(STORAGE_KEY, city.id);
          } catch {
            // Ignore
          }
          resolve();
        },
        (error) => {
          setGeolocationStatus('denied');
          setIsGpsActive(false);

          let reason = 'Location permission was denied or timed out.';
          if (error.code === error.PERMISSION_DENIED) {
            reason = 'Location permission was denied. Defaulting to Hyderabad (HYD).';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            reason = 'Location position unavailable. Defaulting to Hyderabad (HYD).';
          }

          setStatusMessage(`${reason} Showing Hyderabad market details.`);
          setSelectedCityId(DEFAULT_CITY_ID);
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setSelectedCityId(DEFAULT_CITY_ID);
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        selectedCityId,
        selectCity,
        geolocationStatus,
        requestLocationAccess,
        detectedCoords,
        detectedDistanceKm,
        isGpsActive,
        statusMessage,
        allCities: CITIES_MARKET_DATA,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

export default LocationContext;
