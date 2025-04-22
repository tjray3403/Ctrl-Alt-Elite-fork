import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";

const openWeatherKey = "08111bff9b3841ae3ce10ba8c373abbb"; 
const LAT = "30.0933"; 
const LON = "-95.9877"; 

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [sky, setSky] = useState(null);
  const [wind, setWind] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const { width, height } = Dimensions.get("window"); // Get screen dimensions

  const loadForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${openWeatherKey}&units=imperial`
      );
      const data = await response.json();
      setForecast(data.main);
      setSky(data.weather[0].description);
      setWind(data.wind.speed);
      setHumidity(data.main.humidity);
      setSunrise(data.sys.sunrise);
      setSunset(data.sys.sunset);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const loadHourlyForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=prairieView&appid=${openWeatherKey}&units=imperial`
      );
      const data = await response.json();
      setHourlyForecast(data.list);
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
    }
  };

  useEffect(() => {
    loadForecast();
    loadHourlyForecast();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "--";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[styles.weatherScreen, { width }]}>
        {/* Location & Date */}
        <View style={styles.headerSection}>
          <Text style={styles.cityText}>Prairie View, TX</Text>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        {/* Weather Icon + Temp + Condition */}
        <View style={styles.mainCard}>
          <Text style={styles.weatherIcon}>🌤️</Text>
          <Text style={styles.temperatureText}>
            {forecast?.temp?.toFixed(0) ?? 0}° F
          </Text>
          <Text style={styles.skyText}>{sky}</Text>
        </View>

        {/* Stat Row: Humidity + Wind */}
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statValue}>{humidity ?? 0}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Wind</Text>
            <Text style={styles.statValue}>{wind ?? 0} mph</Text>
          </View>
        </View>

        {/* Sunrise & Sunset */}
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sunrise</Text>
            <Text style={styles.statValue}>{formatTime(sunrise)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sunset</Text>
            <Text style={styles.statValue}>{formatTime(sunset)}</Text>
          </View>
        </View>

        {/* 5 Day Forecast */}
        <View style={styles.forecastContainer}>
          {hourlyForecast.slice(0, 5).map((hour, index) => {
            const date = new Date(hour.dt * 1000);
            return (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDay}>{date.toLocaleDateString()}</Text>
                <Text style={styles.forecastTemp}>
                  {hour.main.temp_max.toFixed(0)}° / {hour.main.temp_min.toFixed(0)}°
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Weather;

const styles = StyleSheet.create({
  weatherScreen: {
    flex: 1,
    backgroundColor: "#89CFF0",
    padding: 20,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  cityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#e0e0e0",
  },
  mainCard: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
  },
  weatherIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  temperatureText: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
  },
  skyText: {
    fontSize: 18,
    color: "#f0f0f0",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  statItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 20,
    width: "40%",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#f5f5f5",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  forecastContainer: {
    marginTop: 30,
  },
  forecastItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  forecastDay: {
    fontSize: 16,
    color: "#fff",
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
/*
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

  //useState is a hook that  allows you to add state to functional components
  //useState takes an initial state value and returns an array with two elements: the current state value and a function to update it.
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [sunset, setSunset] = useState<number | null>(null);
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
      console.log("Full API Response:", data); //log the entire api response

      setForecast(data.main);
      setSunset(data.sys.sunset); //sets the sunset to the value from the API response
      setClouds(data.clouds.all);
      setWind(data.wind.speed);
      setSky(data.weather[0].description); //sets the sky to the value from the API response

      //sets the temperature to the value from the API response
      // Save data to state
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const forecast30Days = async () => {
    try {
      const response = await fetch(
        `https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${LAT}&lon=${LON}&appid=${openWeatherKey}`
      );
      const data = await response.json();
      console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAA:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fiveDayThreeHourForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=prairieView&appid=08111bff9b3841ae3ce10ba8c373abbb`
      );
      const data = await response.json();
      console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAA:", data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    loadForecast();
    forecast30Days(); // Calls the function to fetch weather data when the component mounts
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
*/
