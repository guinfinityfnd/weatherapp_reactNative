import { useEffect, useRef, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, StatusBar, TextInput, View, Text, SafeAreaView, Button, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, ActivityIndicator, ScrollView, Keyboard, TouchableWithoutFeedback} from "react-native";
import _debounce from "lodash/debounce";
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

const iconsArray = {
  "01d" : require("./icons/01d.png"),
  "01n" : require("./icons/01n.png"),
  "02d" : require("./icons/02d.png"),
  "02n" : require("./icons/02n.png"),
  "03d" : require("./icons/03d.png"),
  "03n" : require("./icons/03n.png"),
  "04d" : require("./icons/04d.png"),
  "04n" : require("./icons/04n.png"),
  "09d" : require("./icons/09d.png"),
  "09n" : require("./icons/09n.png"),
  "10d" : require("./icons/10d.png"),
  "10n" : require("./icons/10n.png"),
  "11d" : require("./icons/11d.png"),
  "11n" : require("./icons/11n.png"),
  "13d" : require("./icons/13d.png"),
  "13n" : require("./icons/13n.png"),
  "50d" : require("./icons/50d.png"),
  "50n" : require("./icons/50n.png"),
  "unknown" : require("./icons/unknown.png"),
}; 

function App() {
  const [inputText, setInputText] = useState();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchCount, setFetchCount] = useState(0);
  const [forecast, setForecast] = useState();
  const inputRef = useRef(null);
  const image = './icons/sunny.jpg';  

  const API_key = 'afc3adf29eb378563b6a29cc90b5c437';

useEffect(() => {
  fetchApiData();
  setTimeout(() => {
    setLoading(false);
  }, 3000);
},[]);

useEffect(() => {
  if (apiData.id) {
    renderItem(apiData.id);
  };
},[apiData]);

const fetchApiData = async () => {
  let city_name = 'Japan';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const res = await response.json();
    setApiData(res);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
///////This City function is currently used.
const city = async (cityName) => {
  try {
    Keyboard.dismiss();
    // ... (your existing logic)
    const wordsInInput = cityName.toLowerCase().trim(' ');
    const urlName = `https://api.openweathermap.org/data/2.5/weather?q=${wordsInInput}&appid=${API_key}`;
    
    // Check if it's the third or subsequent attempt
    if (fetchCount >= 3) {
      setLoading(true); // Set loading state to true for the delay

      // Delay fetching for 3 seconds
      setTimeout(async () => {
        const response = await fetch(urlName);
        const nameRes = await response.json();
        setInputText(null);
        setApiData(nameRes);
        setLoading(false); // Set loading state back to false after fetching
      }, 3000);
    } else {
      // Fetch immediately for the first two attempts
      const response = await fetch(urlName);
      const nameRes = await response.json();
      setInputText(null);
      setApiData(nameRes);
      setLoading(false);
    }
    // Update the fetch count
    setFetchCount(fetchCount + 1);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }
};

// const debouncedCitySearch = _debounce((cityName) => {
//   city(cityName);
// },600);

// const city = async (cityName) => {
//   try {
//     // ... (your existing logic)
//     const wordsInInput = cityName.toLowerCase().split(' ');
//     const urlName = `https://api.openweathermap.org/data/2.5/weather?q=${wordsInInput}&appid=${API_key}`;
    
//     const response = await fetch(urlName);
//     const nameRes = await response.json();
//     setInputText('');
//     setApiData(nameRes);
//     setLoading(false); 
//     debouncedCitySearch(cityName);
//   } catch (error) {
//     setError(error.message);
//     setLoading(false);
//   }
// };

const handleChange = (text) => {
  setInputText(text);
  if (text.trim() === '') {
    // Clear API data if the input is empty
    setApiData([]);
    return;
  }
};

const renderItem = async ( cityId ) => {
  const forcestUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${API_key}`;
  try {
    const response = await fetch(forcestUrl);
    if (!response.ok) {
      throw new error('this is error because of Network issues ...');
    }
    const results = await response.json();
    const res5 = results.list.slice(0,7);
    // setForecast(prevForecast => [...prevForecast, res5]);
    setForecast(res5);
  }
  // **************  This Catch function was disabled it causes error 'TypeError: constructor is not callable' ************* //
  catch (error) {
    console.error("This is error: ", error);
  }
};

const handleContainerPress = () => {
  Keyboard.dismiss();
};

const handleInputPress = () => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
};

const formatSunriseTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const formatSunsetTime = (unixTimestamp) => {
  const date = new Date( unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${formattedHours}:${formattedMinutes} ${period}`;
};

const dt = (dt_txt) => {
  const date = dt_txt.split(' ');
  return date[0];
};

return (
  <>
    <StatusBar backgroundColor='#FDBC16'/>
    <KeyboardAvoidingView style={{ flex: 1}}>
        <ImageBackground source={require(image)} style={{ flex:1, resizeMode: 'cover'}} blurRadius={20}>
            <View style={styles.viewContainer}>
              <TextInput
                ref={inputRef}
                style={styles.searchBox}
                placeholder="search city..."
                value={inputText}
                maxLength={20}
                // onChangeText={(text) => setInputText(text)}
                onChangeText={handleChange}
                onTouchStart={handleInputPress}
              />
              {inputText !== null && 
                <TouchableOpacity onPress={() => city(inputText)} style={styles.toca}>
                  <Ionicons name="search-outline" size={20} color="black" />
                </TouchableOpacity>
              }   
              {/* <TouchableOpacity onPress={() => city(inputText)} style={{borderWidth: 1, borderColor: 'red'}}>
                    <Ionicons name="search-outline" size={20} color="black" />
              </TouchableOpacity> */}
            </View>
            <ScrollView>
            {loading ? (<ActivityIndicator size='large'/>):
            error ?  (<Text>Error : {error}</Text>) :
            apiData && apiData.name && apiData.sys.sunrise ? (              
              <View style={styles.resultContainer}>
                <Text style={styles.resultName}>{apiData.name.toUpperCase()}</Text>
                <Text style={styles.resultTemp}>{Math.round((apiData.main.feels_like - 273.15))} °C</Text>
                <Text style={styles.resultTemp}>
                <MaterialCommunityIcons name="coolant-temperature" size={24} color="black" /> {Math.round((apiData.main.temp_min - 273.15))} °C /  <FontAwesome5 name="temperature-high" size={24} color="black" /> {Math.round((apiData.main.temp_max - 273.15))} °C</Text>
                <View style={styles.imgContainer}>
                  <Image
                    source={iconsArray[apiData.weather[0].icon]}
                    style={styles.img}
                  />
                </View>
                <Text style={styles.resultHumidity}>
                  Humidity : {apiData.main.humidity} / {apiData.weather[0].description}
                </Text>
                <View style={styles.forcest}>
                  <Text style={{color: 'hsl(43, 82%, 52%)', fontWeight: "bold", fontSize: 20}}> 
                    <EvilIcons name="calendar" size={30} color="black" style={{ alignSelf: "baseline" }}/>
                    7-Day Forecast
                  </Text>
                  <View style={styles.sunrise}> 
                    <Feather name="sunrise" size={20} color="#ff0000" style={{ alignSelf:"center"}}/>
                    <Text style={styles.clock}>
                      {formatSunriseTime(apiData.sys.sunrise)}
                    </Text>
                  </View>
                  <View style={styles.sunrise}> 
                    <Feather name="sunset" size={20} color="#ff0000" style={{ alignSelf:"center"}}/>
                    <Text style={styles.clock}>
                      {formatSunsetTime(apiData.sys.sunset)}
                    </Text>
                  </View>
                </View>
                <TouchableWithoutFeedback onPress={handleContainerPress}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={forecast}
                  renderItem={({item}) => {
                    return(
                      <View style={styles.cardOne}>
                          <Text style={styles.forcestName}>{item.weather[0].description}</Text> 
                          <Text style={styles.forcestWind}>
                            <Feather name="wind" size={20} color="black" /> {item.wind.speed} <Text style={{color: 'grey'}}>m/s</Text>
                          </Text>
                          <Text style={styles.forcestTemp}>
                            <MaterialCommunityIcons name="coolant-temperature" size={20} color="black" /> {Math.round(((item.main.temp - 273.15 ) * 9/5 + 32))} °F 
                          </Text>
                          <Image source={iconsArray[item.weather[0].icon]} style={styles.forcestImg}/>
                          <Text style={{ fontWeight:"bold", color: 'hsl(0, 89%, 38%)' }}>{dt(item.dt_txt)}</Text>
                      </View>
                  ); 
                  }}
                  ListEmptyComponent={<Text>Please Type a City.....</Text>}
                />
            </TouchableWithoutFeedback>
              </View>
            ) : <Text style={{alignSelf: 'center', marginTop: 40}}>
                  <FontAwesome5 name="cloudsmith" size={40} color="black" />
                  Type A City...!
                </Text>
            }
            </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
  </>
);
}

const styles = StyleSheet.create({
  searchBox: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'hsl(43, 98%, 100%)',
    padding: 15,
  },
  viewContainer: {
    // backgroundColor: 'grey',
  },  
  toca: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 20,
  },
  resultName: {
    textAlign: 'center',
    marginTop: 50,
    fontWeight: 'bold',
    color: 'hsl(43, 98%, 90%)',
    fontSize: 40,
  },
  resultTemp: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  resultHumidity: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  forcest: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    padding:14,
    marginTop: 20,
    justifyContent: 'space-around',
  },
  imgContainer: {
    // borderWidth: 1,
    // borderRadius: 10,
  },
  img: {
    alignSelf: 'center',
    objectFit: 'contain',
  },
  cardOne: {
    borderWidth: 2,
    margin: 5,
    maxWidth: 130, 
    padding: 10,
    borderRadius: 10,
  },
  forcestName: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
  forcestImg: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    objectFit: 'contain',
  },
  forcestWind: {
    fontWeight: 'bold',
  },
  forcestTemp: {
    fontWeight: 'bold',
    color: "#ff0000",
  },
  clock: {
    fontWeight: 'bold',
    fontSize: 10,
  }
});

export default App;