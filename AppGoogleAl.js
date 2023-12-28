import { useEffect, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View, Text, StyleSheet, SafeAreaView} from "react-native";
import axios from "axios";

const AppGoogleAl = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    
    // const url = `https://api.openweathermap.org/data/2.5/find?q=${searchText}&appid=${API_key}`;
    // `https://api.openweathermap.org/data/2.5/find?q=${searchText}&appid=afc3adf29eb378563b6a29cc90b5c437`;
    
    // const API_key = "afc3adf29eb378563b6a29cc90b5c437";
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${searchText}&appid=afc3adf29eb378563b6a29cc90b5c437`
                );
                console.log(response.data.list);
                setSuggestions(response.data.list);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        }
        fetchSuggestions();
    },[searchText]);

    const handleSearchChangeText = (text) => {
        setSearchText(text);
    };

    const handleCitySelect = async (cityId) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=afc3adf29eb378563b6a29cc90b5c437`
            );
            setWeatherData(response.data);
        } catch (error) {
            console.error('Error fetching city: ', error);
        }
    };

    const renderSuggestionsItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => handleCitySelect(item.id) }>
                <Text>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    if (!weatherData) {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.container}
                    placeholder="Search city...."
                    onChangeText={handleSearchChangeText}
                />
                <FlatList
                    data={suggestions}
                    renderItem={renderSuggestionsItem}
                    keyExtractor={(item) => item.id.toString() }
                />
                <Text>Loading.........</Text>
            </View>
        );
    }
    
    return (
        <SafeAreaView>
                <TextInput
                    placeholder="Search city...."
                    onChangeText={handleSearchChangeText}
                />
                <FlatList
                    data={suggestions}
                    renderItem={renderSuggestionsItem}
                    keyExtractor={(item) => item.id.toString() }
                />
            <Text>City: {weatherData.name} </Text>
            <Text>Temperature: {weatherData.main.temp} </Text>
            <Text>Humidity: {weatherData.main.humidity} </Text>
            <Text>Description: {weatherData.weather[0].description} </Text> 
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: '#000',
    //   color: 'white',
    //   marginTop: 10,
    },
    // result_container: {
    //   borderWidth: 1,
    // },
    // result_text: {
    //   paddingVertical: 10,
    //   paddingHorizontal: 10,
    // }
});

export default AppGoogleAl;