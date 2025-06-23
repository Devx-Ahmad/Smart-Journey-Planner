/* eslint-disable no-shadow */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

const StopInfo = ({
  stopName,
  boarding,
  unboarding,
  coordinates,
  mapRef,
  _panel,
}) => {
  const onPress = coordinates => {
    console.log('pressed the item');
    mapRef.current.animateToRegion({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
    _panel.hide();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(coordinates)}>
      <ImageBackground
        source={require('../images/2.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.stopInfo}>
          <Text style={styles.stopName}>{stopName}</Text>
          {boarding ? (
            <Text style={styles.busToBoard}>Enter Vehicle</Text>
          ) : null}
          {unboarding ? (
            <Text style={styles.busToBoard}>Exit Vehicle</Text>
          ) : null}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    borderWidth: 1,
    borderColor: 'black',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 23,
    overflow: 'hidden',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  stopInfo: {
    flex: 1,
    backgroundColor: 'rgba(66, 65, 65, 0.2)', // Transparent dark overlay
    padding: 30,
    borderRadius: 5,
  },
  stopName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  busToBoard: {
    fontSize: 16,
    color: 'white',
  },
});

export default StopInfo;
