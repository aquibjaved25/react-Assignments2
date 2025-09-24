import React, { useEffect, useState } from "react";
import { View, Text, Button, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import Geolocation from "react-native-geolocation-service";

const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // 🔑 Replace with your API key

const Assignment3 = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [weather, setWeather] = useState<{ temp: number; desc: string; city: string } | null>(null);

  // Request permission
  const requestPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app requires access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else if (Platform.OS === "ios") {
      // iOS specific request
      const auth = await Geolocation.requestAuthorization("whenInUse");
      return auth === "granted";
    }
    return false;
  };

  // Fetch weather based on lat/lon
  const fetchWeather = async (lat: number, lon: number) => {
    console.log(lat,lon);
    try {
        let api_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
        console.log('api_url', api_url);
      const response = await fetch(
        api_url
      );
      const data = await response.json();
      console.log('data', data);
      if (data.current) {
        setWeather({
          temp: data.current.temperature_2m,
          desc: data.current.time,
          city: data.current.wind_speed_10m,
        });
      } else {
        setErrorMsg("Unable to fetch weather data");
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      setErrorMsg("Weather API error");
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      setErrorMsg("Location permission denied");
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
        setErrorMsg(null);
        fetchWeather(latitude, longitude); // 🔥 fetch weather once location is available
      },
      (error) => {
        console.error("Location error:", error);
        setErrorMsg(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Location + Weather Example</Text>

      {location ? (
        <Text style={styles.location}>
          Latitude: {location.lat} {"\n"}
          Longitude: {location.lng}
        </Text>
      ) : (
        <Text style={styles.error}>{errorMsg || "Fetching location..."}</Text>
      )}

      {weather ? (
        <Text style={styles.weather}>
          🌆 {weather.city} {"\n"}
          🌡️ {weather.temp}°C {"\n"}
          ☁️ {weather.desc}
        </Text>
      ) : (
        <Text style={styles.info}>Fetching weather...</Text>
      )}

      <Button title="Refresh" onPress={getLocation} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "600",
  },
  location: {
    fontSize: 16,
    marginBottom: 20,
    color: "green",
  },
  weather: {
    fontSize: 16,
    marginBottom: 20,
    color: "blue",
    textAlign: "center",
  },
  error: {
    fontSize: 14,
    marginBottom: 20,
    color: "red",
  },
  info: {
    fontSize: 14,
    marginBottom: 20,
    color: "gray",
  },
});

export default Assignment3;