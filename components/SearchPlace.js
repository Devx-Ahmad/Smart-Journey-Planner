import React, {Component} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  PermissionsAndroid,
  Platform, // Import Platform
} from 'react-native';
// Device GPS
import Geolocation from '@react-native-community/geolocation';
import {BlurView} from '@react-native-community/blur';
import backgroundImage from '../images/2.jpg'; // Import the local image
import DeviceInfo from 'react-native-device-info'; // Import DeviceInfo

const API_KEY = '';
const PLACES_API_BASE_URL =
  '';
const PLACE_DETAILS_API_BASE_URL =
  '';

class SearchPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      predictions: [],
      errorMessage: '',
    };
  }

  //input changes and fetch call
  handleInputChange = text => {
    this.setState({inputValue: text}, () => {
      this.fetchPredictions();
    });
  };

  //fetch prediction
  fetchPredictions = async () => {
    const {inputValue} = this.state;

    if (inputValue.length > 0) {
      try {
        const response = await fetch(
          //URL CONSTRUCT FOR GET REQ TO GOOGLE
          `${PLACES_API_BASE_URL}?input=${inputValue}&components=country:PK&key=${API_KEY}`,
        );
        if (response.status === 200) {
          const data = await response.json();
          //UPDATE PREDICTION STATE
          this.setState({predictions: data.predictions});
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
        this.setState({
          errorMessage: 'Error fetching predictions. Please try again later.',
        });
      }
    } else {
      this.setState({predictions: []});
    }
  };

  //location permission
  checkLocationPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        //RUntime Permissions
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  //location service Enable Check
  checkLocationServices = async () => {
    const isLocationEnabled = await DeviceInfo.isLocationEnabled();
    if (!isLocationEnabled) {
      this.setState({
        errorMessage: 'Location services are off. Please enable them.',
      });
      return false;
    }
    //WHether app has permission or not
    const hasPermission = await this.checkLocationPermissions();
    if (!hasPermission) {
      this.setState({
        errorMessage:
          'Location permission denied. Please grant location access.',
      });
      return false;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(true),
        error => {
          this.setState({
            errorMessage:
              'Error getting current location. Please try again later.',
          });
          reject(error);
        },
        {enableHighAccuracy: false, timeout: 60000, maximumAge: 1000},
      );
    });
  };
  //PRediction PResses
  handlePredictionPress = async prediction => {
    if (prediction.isCurrentLocation) {
      try {
        const locationEnabled = await this.checkLocationServices();
        if (locationEnabled) {
          Geolocation.getCurrentPosition(
            position => {
              const {latitude, longitude} = position.coords;
              const {route} = this.props;
              //Linked to the Inpute SCreen
              route.params.callback({
                placeId: 'current_location',
                //Apearing Name
                placeName: 'Current location',
                coords: {lat: latitude, lng: longitude},
              });
              this.props.navigation.goBack();
            },
            error => {
              this.setState({
                errorMessage:
                  'Error getting current location. Please try again later.',
              });
            },
            {enableHighAccuracy: false, timeout: 60000, maximumAge: 1000},
          );
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    } else {
      try {
        const response = await fetch(
          `${PLACE_DETAILS_API_BASE_URL}?placeid=${prediction.place_id}&key=${API_KEY}`,
        );

        if (response.status === 200) {
          const data = await response.json();
          const {lat, lng} = data.result.geometry.location;
          const {route} = this.props;
          route.params.callback({
            placeId: prediction.place_id,
            placeName: data.result.name,
            coords: {lat, lng},
          });
          this.props.navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching place details:', error);
        this.setState({
          errorMessage: 'Error fetching place details. Please try again later.',
        });
      }
    }

    this.setState({inputValue: prediction.description, predictions: []});
  };
  //REnder As Touchable values
  renderPredictionItem = ({item}) => (
    <TouchableOpacity
      onPress={() => this.handlePredictionPress(item)}
      style={styles.predictionItem}>
      <Text style={styles.predictionText}>{item.description}</Text>
    </TouchableOpacity>
  );

  render() {
    const {inputValue, predictions, errorMessage} = this.state;
    //new Obj of Current loca
    const currentLocationItem = {
      description: 'Current Location',
      isCurrentLocation: true,
    };

    return (
      <ImageBackground
        source={backgroundImage} //local
        style={styles.backgroundImage}>
        <BlurView style={styles.absolute} blurType="dark" blurAmount={1} />
        <View style={styles.container}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Location"
            value={inputValue}
            placeholderTextColor="black" // Light gray for placeholder text
            onChangeText={this.handleInputChange}
          />
          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <FlatList
            data={[currentLocationItem, ...predictions]}
            renderItem={this.renderPredictionItem}
            keyExtractor={item =>
              item.isCurrentLocation ? 'current_location' : item.place_id
            }
            style={styles.predictionsList}
            contentContainerStyle={styles.predictionsContainer}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    borderWidth: 0,
    borderRadius: 30,
    paddingVertical: 13,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Slightly transparent white
    marginBottom: 12,
    color: 'black', // Black text for readability
    shadowColor: 'rgba(0, 0, 0, 0.4)', // Shadow for depth
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  predictionsList: {
    marginTop: 10,
  },
  predictionsContainer: {
    paddingBottom: 15,
  },
  predictionItem: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Slightly transparent white
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)', // Shadow for elevation effect
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  predictionText: {
    fontSize: 16,
    color: '#333333',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SearchPlaces;
