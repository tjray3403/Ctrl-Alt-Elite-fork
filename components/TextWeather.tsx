import { styles } from "@/config/styles";
import React from "react";
import { Text } from "react-native";

interface TextWeatherProps {
  title: string;
  info: any;
}

const TextWeather: React.FC<TextWeatherProps> = ({ title, info }) => {
  return (
    <Text style={styles.textWeather}>
      {title}: <Text style={styles.infoWeather}>{info}</Text>
    </Text>
  );
};

export default TextWeather;
