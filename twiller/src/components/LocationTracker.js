import React, { useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const LocationTracker = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [address, setAddress] = useState("");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          // Get Address from Google Maps API
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
          const geocodeResponse = await axios.get(geocodeUrl);
          const addressData = geocodeResponse.data.results[0].formatted_address;
          setAddress(addressData);

          // Get Weather Data from OpenWeatherMap API
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`;
          const weatherResponse = await axios.get(weatherUrl);
          setWeather(weatherResponse.data);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading Maps...</p>;

  return (
    <div>
      <h2>Track Your Location</h2>
      <button onClick={getLocation}>Obtain Location</button>
      
      {location && (
        <div>
          <h3>Location: {address}</h3>
          <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={location}>
            <Marker position={location} />
          </GoogleMap>
          
          {weather && (
            <div>
              <h3>Weather: {weather.weather[0].description}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
