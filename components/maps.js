/* eslint-disable react-native/no-inline-styles */
import {Platform, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Image} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';
import {request, PERMISSIONS} from 'react-native-permissions';
import Spinner from 'react-native-loading-spinner-overlay';
import SplashScreen from 'react-native-splash-screen';
import {useNavigation} from '@react-navigation/native';
import InputField from './InputField_v1';
import SlideUpPanel from './SlideUpPanel';
//import SlideUpPanel from './ScrollTest';

const API_KEY = '';

const BusTrackingMap = () => {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [isMapScrollable, setIsMapScrollable] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  const [origin, setOrigin] = useState({
    placeId: '',
    placeName: '',
    coords: null,
  });
  const [destination, setDestination] = useState({
    placeId: '',
    placeName: '',
    coords: null,
  });

  const [data, setData] = useState(null);
  const [driving, setDriving] = useState({distance: 0, duration: 0});
  const [walking, setWalking] = useState({distance: 0, duration: 0});
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 33.6956962780534,
    longitude: 73.02698497120006,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000, // Duration of one full rotation
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);
  const areCoordinatesEqual = (coords1, coords2) => {
    const tolerance = 0.0001; // This represents a tolerance of roughly 11 meters
    return (
      Math.abs(coords1.lat - coords2.lat) < tolerance &&
      Math.abs(coords1.lng - coords2.lng) < tolerance
    );
  };
  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    if (error === 'empty_route') {
      Alert.alert(
        'Route Under Development',
        'Current route is in Production and will soon be available',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {
            text: 'Report',
            onPress: () => {
              navigation.navigate('ReportProblem'); // Navigate to the Report screen
              setError(null);
            },
          },
        ],
      );
    }
  }, [error]);

  //map reference
  const mapRef = useRef(null);
  useEffect(() => {
    if (destination.coords != null) {
      fetchData();
    }
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, origin]);

  const ISLAMABAD_BOUNDS = {
    north: 33.8, //Margala Hills
    south: 33.45, //airport
    east: 73.25, //Residential Easetern
    west: 72.95, // Extend west to cover
  };

  //location handling
  const handleMapReady = () => {
    try {
      const result = request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );

      if (result === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            console.log(position.coords);

            // Set the initial region to the user's current location
            setInitialRegion({
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            // setOrigin({ placeId: 'nill', placeName: 'Current location', coords: { lat: latitude, lng: longitude } })
          },
          error => console.log(error),
          {enableHighAccuracy: false, timeout: 60000, maximumAge: 1000},
        );
      } else {
        // Permission denied
      }
      // eslint-disable-next-line no-catch-shadow
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  //Range Check
  const isInIslamabad = coords => {
    return (
      coords.lat >= ISLAMABAD_BOUNDS.south &&
      coords.lat <= ISLAMABAD_BOUNDS.north &&
      coords.lng >= ISLAMABAD_BOUNDS.west &&
      coords.lng <= ISLAMABAD_BOUNDS.east
    );
  };

  //Fetching Data
  const fetchData = async () => {
    try {
      setSpinner(true);
      // Check if the origin and destination are the same

      if (areCoordinatesEqual(origin.coords, destination.coords)) {
        Alert.alert(
          'Similar Locations',
          'Current location and destination cannot be the same.',
        );
        return;
      }
      if (!isInIslamabad(origin.coords) || !isInIslamabad(destination.coords)) {
        Alert.alert(
          'Out of Bounds',
          'One or more locations are outside the boundary of Islamabad.',
        );
        return;
      }
      const apiUrl = 'http://192.168.0.106:3000/routes/route';
      const requestBody = {
        sourceLatitude: origin.coords.lat,
        sourceLongitude: origin.coords.lng,
        destinationLatitude: destination.coords.lat,
        destinationLongitude: destination.coords.lng,
      };
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.pt_route.path.length === 0) {
        setError('empty_route');
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSpinner(false);
    }
  };
  const animateMap = (coordinate, delta) => {
    mapRef.current.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: delta,
      longitudeDelta: delta,
    });
  };
  const fitToCoordinates = (coordinate1, coordinate2) => {
    mapRef.current.fitToCoordinates([coordinate1, coordinate2], {
      edgePadding: {top: 0, right: 0, bottom: -200, left: 0},
      animated: true,
    });
  };
  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={'Fetching Route...'}
        textStyle={{
          color: '#FFF',
          fontSize: 18,
          fontWeight: 'bold',
        }}
        overlayColor="rgba(0, 0, 0, 0.7)"
        animation="fade"
        customIndicator={
          <Animated.Image
            source={require('../icons/load.png')}
            style={{
              width: 50,
              height: 50,
              transform: [{rotate: rotateInterpolation}],
            }}
          />
        }
      />
      {/* Input fields */}
      <View style={styles.inputContainer}>
        <InputField
          placeholder="Origin"
          iconPath={require('../icons/location-icon.png')}
          onLocationSelection={locObj => {
            setData(null);
            setError(null);
            setOrigin(locObj);
          }}
          value={origin.placeName}
          border={0}
          iconSize={[25, 25]}
        />
        <InputField
          placeholder="Destination"
          iconPath={require('../icons/search-location.png')}
          onLocationSelection={locObj => {
            setData(null);
            setError(null);
            setDestination(locObj);
          }}
          value={destination.placeName}
          iconSize={[25, 25]}
        />
      </View>
      {destination.coords == null && (
        <View style={styles.mainBoxContainer}></View>
      )}
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onMapReady={handleMapReady}
        scrollEnabled={isMapScrollable}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapPadding={{
          top: 200,
          right: 0,
          bottom: 250,
          left: 0,
        }}
        loadingEnabled={true}
        zoomEnabled={true}
        pointerEvents="auto">
        {/* Marker (trip starting point) */}
        {origin.coords && (
          <Marker
            coordinate={{
              latitude: origin.coords.lat,
              longitude: origin.coords.lng,
            }}
            title="Journey Start"
            pinColor="red"
          />
        )}
        {origin.coords &&
          !destination.coords &&
          animateMap(
            {latitude: origin.coords.lat, longitude: origin.coords.lng},
            // eslint-disable-next-line no-undef
            (delta = 0.01),
          )}
        {/* Marker (trip ending point) */}
        {destination.coords && (
          <Marker
            coordinate={{
              latitude: destination.coords.lat,
              longitude: destination.coords.lng,
            }}
            title="Journey End"
            pinColor="blue"
          />
        )}
        {destination.coords &&
          !origin.coords &&
          animateMap(
            {
              latitude: destination.coords.lat,
              longitude: destination.coords.lng,
            },
            // eslint-disable-next-line no-undef
            (delta = 0.01),
          )}
        {/* Markers (bus stops)*/}
        {data &&
          data.pt_route.path
            .filter(obj => obj.boarding === true || obj.unboarding === true)
            .map(marker => {
              return (
                <Marker
                  style={{width: 40, height: 40}}
                  key={marker.index}
                  coordinate={marker.coordinates}
                  title={marker.pt_stop}>
                  <Image
                    source={require('../icons/bus_stop.png')}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'contain',
                    }}
                  />
                </Marker>
              );
            })}

        {origin.coords &&
          destination.coords &&
          fitToCoordinates(
            {latitude: origin.coords.lat, longitude: origin.coords.lng},
            {
              latitude: destination.coords.lat,
              longitude: destination.coords.lng,
            },
          )}
        {/* Polylines (Start --- StartStop*/}
        {data && !error && (
          <MapViewDirections
            origin={data.trip_origin}
            destination={
              data.pt_route.path.find(obj => obj.index === 0).coordinates
            }
            mode="walking"
            apikey={API_KEY}
            strokeWidth={3}
            strokeColor="#3357FF"
            optimizeWaypoints={true}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min`);
              setWalking({
                distance: walking.distance + result.distance,
                duration: walking.duration + result.duration,
              });
            }}
          />
        )}
        {data && !error && (
          <Polyline
            coordinates={[
              {
                latitude: data.trip_origin.latitude,
                longitude: data.trip_origin.longitude,
              },
              {
                latitude: data.pt_route.path.find(obj => obj.index === 0)
                  .coordinates.latitude,
                longitude: data.pt_route.path.find(obj => obj.index === 0)
                  .coordinates.longitude,
              },
            ]}
            strokeColor="#3357FF"
            strokeWidth={7}
            lineDashPattern={[1, 8]} // Create a dotted line pattern
          />
        )}
        {/* Polylines (Driving)*/}
        {data &&
          data.pt_route.path
            .filter(obj => obj.boarding === true || obj.unboarding === true)
            .map((value, index, array) => {
              if (index < array.length - 1) {
                if (
                  value.unboarding != true ||
                  array[index + 1].boarding != true
                ) {
                  return [value, array[index + 1]];
                }
              }
              return null;
            })
            .filter(pair => pair !== null)
            .map(line => {
              return (
                <MapViewDirections
                  origin={line[0].coordinates}
                  destination={line[1].coordinates}
                  mode="driving"
                  apikey={API_KEY}
                  strokeWidth={3}
                  strokeColor="black"
                  optimizeWaypoints={true}
                  onReady={result => {
                    console.log(`Distance: ${result.distance} km`);
                    console.log(`Duration: ${result.duration} min`);
                    setDriving({
                      distance: walking.distance + result.distance,
                      duration: walking.duration + result.duration,
                    });
                  }}
                />
              );
            })}
        {/* Polylines (Shifts)*/}
        {data &&
          data.pt_route.path
            .filter(obj => obj.boarding === true || obj.unboarding === true)
            .map((value, index, array) => {
              if (index < array.length - 1) {
                if (
                  value.unboarding == true &&
                  array[index + 1].boarding == true
                ) {
                  return [value, array[index + 1]];
                }
              }
              return null;
            })
            .filter(pair => pair !== null)
            .map(line => {
              return (
                <MapViewDirections
                  origin={line[0].coordinates}
                  destination={line[1].coordinates}
                  mode="walking"
                  apikey={API_KEY}
                  strokeWidth={5}
                  strokeColor="#E74C3C"
                  optimizeWaypoints={true}
                  onReady={result => {
                    console.log(`Distance: ${result.distance} km`);
                    console.log(`Duration: ${result.duration} min`);
                    setWalking({
                      distance: walking.distance + result.distance,
                      duration: walking.duration + result.duration,
                    });
                  }}
                />
              );
            })}
        {/* unboarding */}
        {data &&
          data.pt_route.path
            .filter(obj => obj.boarding === true || obj.unboarding === true)
            .map((value, index, array) => {
              if (index < array.length - 1) {
                if (
                  value.unboarding == true &&
                  array[index + 1].boarding == true
                ) {
                  return [value, array[index + 1]];
                }
              }
              return null;
            })
            .filter(pair => pair !== null)
            .map(line => {
              return (
                <Polyline
                  coordinates={[
                    {
                      latitude: line[0].coordinates.latitude,
                      longitude: line[0].coordinates.longitude,
                    },
                    {
                      latitude: line[1].coordinates.latitude,
                      longitude: line[1].coordinates.longitude,
                    },
                  ]}
                  strokeColor="#E74C3C"
                  strokeWidth={7}
                  lineDashPattern={[1, 8]} // Create a dotted line pattern
                />
              );
            })}
        {/* Polylines (EndStop --- End*/}
        {data && (
          <MapViewDirections
            origin={data.trip_destination}
            destination={
              data.pt_route.path.reduce((maxObject, currentObject) => {
                return currentObject.index > maxObject.index
                  ? currentObject
                  : maxObject;
              }, data.pt_route.path[0]).coordinates
            }
            mode="walking"
            apikey={API_KEY}
            strokeWidth={3}
            strokeColor="#3357FF"
            optimizeWaypoints={true}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min`);
              setWalking({
                distance: walking.distance + result.distance,
                duration: walking.duration + result.duration,
              });
            }}
          />
        )}
        {data && (
          <Polyline
            coordinates={[
              {
                latitude: data.trip_destination.latitude,
                longitude: data.trip_destination.longitude,
              },
              {
                latitude: data.pt_route.path.reduce(
                  (maxObject, currentObject) => {
                    return currentObject.index > maxObject.index
                      ? currentObject
                      : maxObject;
                  },
                  data.pt_route.path[0],
                ).coordinates.latitude,
                longitude: data.pt_route.path.reduce(
                  (maxObject, currentObject) => {
                    return currentObject.index > maxObject.index
                      ? currentObject
                      : maxObject;
                  },
                  data.pt_route.path[0],
                ).coordinates.longitude,
              },
            ]}
            strokeColor="#3357FF"
            strokeWidth={7}
            lineDashPattern={[1, 8]}
          />
        )}
      </MapView>
      {/* Sliding-up panel */}
      {data ? (
        <SlideUpPanel
          data={data}
          walking={walking}
          driving={driving}
          mapScroll={x => setIsMapScrollable(x)}
          mapRef={mapRef}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 0,
  },
  inputContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    padding: 0,
    backgroundColor: 'rgba(2, 204, 254, 0.5)',
    borderRadius: 20,
    marginTop: 0,
  },
  mainBoxContainer: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 300,
    width: '100%',
  },
  map: {
    flex: 50,
    marginBottom: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mainBox: {
    zIndex: 1,
  },
});

export default BusTrackingMap;
