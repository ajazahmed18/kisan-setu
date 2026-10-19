import React, { createContext, useContext, useState, useEffect } from 'react';
import { CityMarket } from '../types';
import {
  CITIES_MARKET_DATA,
  DEFAULT_CITY_ID,
  findNearestCity,
  getCityById,
} from '../data/citiesData';

export type GeolocationStatus = 'idle' | 'detecting' | 'granted' | 'denied' | 'unsupported';

interface LocationContextType {
  selectedCity: CityMarket;
  selectedCityId: string;
  selectCity: (cityId: string) => void;
  geolocationStatus: GeolocationStatus;
  requestLocationAccess: () => Promise<void>;
  detectedCoords: { lat: number; lng: number } | null;
  detectedDistanceKm: number | null;
  isGpsActive: boolean;
  statusMessage: string | null;
  allCities: CityMarket[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'kisansetu_user_selected_city';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with saved city or default to Hyderabad ('hyd')
  const [selectedCityId, setSelectedCityId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CITIES_MARKET_DATA.some((c) => c.id === saved)) {
        return saved;
      }
    } catch {
      // LocalStorage might be unavailable in some iframe sandboxes
    }
    return DEFAULT_CITY_ID;
  });

  const [geolocationStatus, setGeolocationStatus] = useState<GeolocationStatus>('idle');
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectedDistanceKm, setDetectedDistanceKm] = useState<number | null>(null);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedCity = getCityById(selectedCityId);

  const selectCity = (cityId: string) => {
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

  const requestLocationAccess = async (): Promise<void> => {
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

          // Find the nearest city in our agricultural market network
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
          console.warn('Geolocation access error or denied:', error.message);
          setGeolocationStatus('denied');
          setIsGpsActive(false);

          // User requested Hyderabad default when location isn't accessible or is requested
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

  // Attempt auto-check once if supported, but avoid annoying popups if already denied
  useEffect(() => {
    // If user hasn't explicitly set another city, let's keep Hyderabad as requested:
    // "firslt we need give as per location from whrere he that ex iam from hyd so i need to details of hyd"
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
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
