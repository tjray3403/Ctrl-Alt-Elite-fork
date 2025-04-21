import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../../config/styles";
import { Platform } from "react-native";
import TextWeather from "@/components/TextWeather";

const openWeatherKey = "08111bff9b3841ae3ce10ba8c373abbb"; // API Key
const LAT = "30.0933"; // Correct Latitude for Prairie View, TX
const LON = "-95.9877"; // Correct Longitude for Prairie View, TX

console.log(Platform.OS);

const Weather = () => {
  //declares weather component and sets up state variables for forecast, clouds, wind, and sky
  interface Forecast {
    temp: number;
    feels_like: number;
    sea_level: number;
    temp_max: number;
    temp_min: number;
    pressure: number;
    grnd_level: number;
    humidity: number;
  }

  //useState is a hook that allows you to add state to functional components
  //useState takes an initial state value and returns an array with two elements: the current state value and a function to update it.

  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [clouds, setClouds] = useState<number | null>(null);
  const [wind, setWind] = useState<number | null>(null);
  const [sky, setSky] = useState<string | null>(null);
  const {
    temp,
    feels_like,
    sea_level,
    temp_max,
    temp_min,
    pressure,
    grnd_level,
    humidity,
  } = forecast || {};

  const [refreshing, setRefreshing] = useState(false); //.

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
      // console.log("Full API Response:", data);log the entire api response

      setForecast(data.main);
      setClouds(data.clouds.all);
      setWind(data.wind.speed);
      setSky(data.weather[0].description); //sets the sky to the value from the API response

      //sets the temperature to the value from the API response
      // Save data to state
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []); // Runs when the component mounts

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.weatherTitle}>Weather in Prairie View, TX:</Text>
      {forecast ? (
        <View style={styles.weatherContainerInfo}>
          <TextWeather
            title="Temperature"
            info={`${temp?.toFixed(0) ?? 0}º F`}
          ></TextWeather>
          <TextWeather
            title="Feels Like"
            info={`${feels_like?.toFixed(0) ?? 0}º F`}
          ></TextWeather>

          <TextWeather
            title="Max Temperature"
            info={`${temp_max?.toFixed(0) ?? 0}º F`}
          ></TextWeather>
          <TextWeather
            title="Min Temperature"
            info={`${temp_min?.toFixed(0) ?? 0}º F`}
          ></TextWeather>
          <TextWeather title="Sky" info={sky ?? ""}></TextWeather>
          <Text>{` `}</Text>
          <TextWeather title="Sea Level" info={sea_level ?? 0}></TextWeather>
          <TextWeather title="Pressure" info={pressure ?? 0}></TextWeather>
          <TextWeather
            title="Ground Level"
            info={grnd_level ?? 0}
          ></TextWeather>
          <TextWeather title="Humidity" info={humidity ?? 0}></TextWeather>
          <TextWeather title="Clouds" info={clouds ?? 0}></TextWeather>
          <TextWeather title="Wind" info={wind ?? 0}></TextWeather>

          <TextWeather title="Latitude" info={LAT ?? 0}></TextWeather>

          <TextWeather title="Longitude" info={LON ?? 0}></TextWeather>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Weather;
