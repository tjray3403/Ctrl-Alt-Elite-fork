import { View, Text } from "react-native"; //used for UI components
import React, { useEffect, useState } from "react"; //react hooks //useState manages(stores weather data) //useEffect runs code when the component loads
import * as Location from "expo-location";

const openWeatherKey = "08111bff9b3841ae3ce10ba8c373abbb"; // API Key
const LAT = "30.0933"; // Correct Latitude for Prairie View, TX
const LON = "-95.9877"; // Correct Longitude for Prairie View, TX

import { Platform } from "react-native";

console.log(Platform.OS);

const Weather = () => {
  //declares weather component
  const [forecast, setForecast] = useState(null); //stores weather data, updates forecast when new weather data is fetched, useState(null)- initially sets forecast to null (empty state)
  const [refreshing, setRefreshing] = useState(false); //

  //async keyword makes the loadForecast function an asynchronous function, meaning it can run asynchronous operations like API calls without blocking the rest of the app
  const loadForecast = async () => {
    //loadForecast: fetches weather data
    try {
      const response = await fetch(
        //
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${openWeatherKey}&units=imperial`
      );
      //await ensures we wait for the JSON conversion to finish before moving forward.
      const data = await response.json(); // another asynchronous operation that parses the JSON data from the API response.

      //have to see response in console
      console.log("Full API Response:", data); //log the entire api response

      setForecast(data); // Save data to state
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []); // Runs when the component mounts

  return (
    <View id="container">
      <Text id="title">Weather in Prairie View, TX:</Text>
      {forecast ? (
        <Text>Temperature: {forecast.main.temp}°F</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Weather;
