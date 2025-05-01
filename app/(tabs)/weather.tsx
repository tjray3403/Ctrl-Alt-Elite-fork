import {
  ImageBackground,
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../../config/styles";
import TextWeather from "@/components/TextWeather";
import { Dimensions, SafeAreaView } from "react-native";

const screenWidth = Dimensions.get("window").width;
const openWeatherKey = "08111bff9b3841ae3ce10ba8c373abbb"; // API Key
const LAT = "30.0933"; // Correct Latitude for Prairie View, TX
const LON = "-95.9877"; // Correct Longitude for Prairie View, TX

console.log(Platform.OS);

const Weather = () => {
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

  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [sky, setSky] = useState<string | null>(null);
  const [wind, setWind] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [sunrise, setSunrise] = useState<number | null>(null);
  const [sunset, setSunset] = useState<number | null>(null);

  // New state for the 5-day forecast and hourly forecast
  const [fiveDayForecast, setFiveDayForecast] = useState<any[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);

  const { temp } = forecast || {};

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return "--";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isDaytime = () => {
    const currentTime = Math.floor(Date.now() / 1000); // Hora actual en segundos (UNIX timestamp)
    if (sunrise && sunset) {
      return currentTime >= sunrise && currentTime < sunset; // Devuelve true si es de día
    }
    return false; // Por defecto, considera que es de noche si no hay datos
  };

  const getBackgroundImage = (description: string | null) => {
    const desc = description?.toLowerCase();
    if (isDaytime()) {
      return require("@/assets/backgrounds/clear.png");
    } else if (desc?.includes("clear"))
      return require("@/assets/backgrounds/clear.png");
    else if (desc?.includes("cloud"))
      return require("@/assets/backgrounds/clear.png");
    else if (desc?.includes("rain"))
      return require("@/assets/backgrounds/clear.png");
    else if (desc?.includes("thunderstorm"))
      return require("@/assets/backgrounds/clear.png");
    else if (desc?.includes("snow"))
      return require("@/assets/backgrounds/clear.png");
    else
      desc?.includes("mist") || desc?.includes("fog") || desc?.includes("haze");
    return require("@/assets/backgrounds/clear.png");
  };

  // Function to load current weather data
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

  // Function to load 5-day forecast (every 3 hours)
  const fiveDayThreeHourForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=prairieView&appid=${openWeatherKey}&units=imperial`
      );
      const data = await response.json();

      // Process the 5-day forecast
      const dailyForecast = [];
      let currentDate: number | null = null;
      let dailyHigh = -Infinity;
      let dailyLow = Infinity;

      // Process hourly forecast
      const hourlyForecast: React.SetStateAction<any[]> = [];

      data.list.forEach(
        (item: {
          dt: number | null;
          main: { temp: any; temp_max: number; temp_min: number };
        }) => {
          const date = item.dt ? new Date(item.dt * 1000) : new Date(); // Convert to JavaScript Date object or use current date if null
          const day = date.getDate();

          // Process hourly forecast for the current day
          if (date.getDate() === new Date().getDate()) {
            hourlyForecast.push({
              time: formatTime(item.dt),
              temp: item.main.temp,
            });
          }

          // Check if we are still on the same day or a new day
          if (currentDate !== day) {
            // If it's a new day, save the last day's forecast and reset
            if (currentDate !== null) {
              dailyForecast.push({
                date: new Date(item.dt * 1000).toDateString(),
                high: dailyHigh,
                low: dailyLow,
              });
            }

            // Reset for the new day
            currentDate = day;
            dailyHigh = -Infinity;
            dailyLow = Infinity;
          }

          // Update high and low temperatures for the current day
          if (item.main.temp_max > dailyHigh) dailyHigh = item.main.temp_max;
          if (item.main.temp_min < dailyLow) dailyLow = item.main.temp_min;
        }
      );

      // Add the last day's forecast
      dailyForecast.push({
        date: new Date(
          data.list[data.list.length - 1].dt * 1000
        ).toDateString(),
        high: dailyHigh,
        low: dailyLow,
      });

      setFiveDayForecast(dailyForecast); // Store the 5-day forecast in state
      setHourlyForecast(hourlyForecast); // Store hourly forecast in state
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    loadForecast();
    fiveDayThreeHourForecast(); // Fetch the 5-day forecast
  }, []);

  const emojiHandler = () => {
    return isDaytime() ? "☀️" : "🌙"; // Devuelve un emoji según sea de día o de noche
  };

  return (
    <ImageBackground
      source={getBackgroundImage(sky)}
      style={weatherstyles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 /*backgroundColor: "#89CFF0"*/ }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Location & Date */}
          <View style={weatherstyles.headerSection}>
            <Text style={weatherstyles.cityText}>Prairie View, TX</Text>
            <Text style={weatherstyles.dateText}>
              {new Date().toDateString()}
            </Text>
          </View>

          {/* Weather Icon + Temp + Condition */}
          <View style={weatherstyles.mainCard}>
            <Text style={weatherstyles.weatherIcon}>{emojiHandler()}</Text>
            <Text style={weatherstyles.temperatureText}>
              {temp?.toFixed(0) ?? 0}° F
            </Text>
            <Text style={weatherstyles.skyText}>
              Feels like {forecast?.feels_like?.toFixed(0) ?? "--"}°F
            </Text>
            <Text style={weatherstyles.skyText}>{sky}</Text>
          </View>

          {/* Hourly Forecast (Horizontal) */}
          <Text style={weatherstyles.subHeading}>Hourly Forecast</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hourlyForecast.length > 0 ? (
              hourlyForecast.map((hour, index) => (
                <View
                  key={index}
                  style={[weatherstyles.hourCard, { width: screenWidth * 0.2 }]}
                >
                  <Text style={weatherstyles.hourTime}>{hour.time}</Text>
                  <Text style={weatherstyles.hourTemp}>
                    {hour.temp.toFixed(0)}°F
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#fff" }}>Loading hourly forecast...</Text>
            )}
          </ScrollView>

          {/* 5-Day Forecast (Vertical List) */}
          <Text style={weatherstyles.subHeading}>5-Day Forecast</Text>
          <FlatList
            data={fiveDayForecast}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={weatherstyles.forecastCard}>
                <Text style={weatherstyles.forecastDate}>{item.date}</Text>
                <Text style={weatherstyles.forecastHighLow}>
                  High: {item.high}°F | Low: {item.low}°F
                </Text>
              </View>
            )}
            scrollEnabled={false} // Let parent ScrollView handle scrolling
          />

          {/* Stat Row: Humidity + Wind */}
          <View style={weatherstyles.statRow}>
            <View style={weatherstyles.statItem}>
              <Text style={weatherstyles.statLabel}>Humidity</Text>
              <Text style={weatherstyles.statValue}>{humidity ?? 0}%</Text>
            </View>
            <View style={weatherstyles.statItem}>
              <Text style={weatherstyles.statLabel}>Wind</Text>
              <Text style={weatherstyles.statValue}>{wind ?? 0} mph</Text>
            </View>
          </View>

          {/* Sunrise & Sunset */}
          <View style={weatherstyles.statRow}>
            <View style={weatherstyles.statItem}>
              <Text style={weatherstyles.statLabel}>Sunrise</Text>
              <Text style={weatherstyles.statValue}>{formatTime(sunrise)}</Text>
            </View>
            <View style={weatherstyles.statItem}>
              <Text style={weatherstyles.statLabel}>Sunset</Text>
              <Text style={weatherstyles.statValue}>{formatTime(sunset)}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const weatherstyles = StyleSheet.create({
  weatherScreen: {
    backgroundColor: "#89CFF0",
    padding: 20,
    justifyContent: "center",
  },
  background: {
    flex: 1,
    width: "100%",
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
    backdropFilter: "blur(15px)",
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
    justifyContent: "space-between",
    backdropFilter: "blur(15px)",
    marginBottom: 10,
    gap: 10,
  },
  statItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 20,
    flex: 1,
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

  // 5-Day Forecast Styles
  forecastCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(15px)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  forecastHighLow: {
    fontSize: 14,
    color: "#f0f0f0",
  },

  // Hourly Forecast Styles
  hourCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",

    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    alignItems: "center",
    width: 70,
  },
  hourTime: {
    fontSize: 12,
    color: "#fff",
  },
  hourTemp: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  // Subheading styles
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",

    color: "#fff",
    marginBottom: 10,
  },
});

export default Weather;
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
