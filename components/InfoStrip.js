import React from 'react';
import {View, ImageBackground, Text, StyleSheet, Image} from 'react-native';

// Import the background image from the images folder
import backgroundImage from '../images/2.jpg';

const DistanceInfoStrip = ({walking, driving}) => {
  //One Km assumed to 12 min
  const walking_duration = walking.distance * 12;

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Image
            source={require('../icons/walk.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 40, width: 40}}
          />
          <Text style={styles.value}>{walking_duration.toFixed(0)} min</Text>
          <Text style={styles.duration}>
            ({walking.distance.toFixed(0)} km)
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Image
            source={require('../icons/bus.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 40, width: 40}}
          />
          <Text style={styles.value}>{driving.duration.toFixed(0)} min</Text>
          <Text style={styles.duration}>
            ({driving.distance.toFixed(0)} km)
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Image
            source={require('../icons/time.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 40, width: 40}}
          />
          <Text style={styles.value}>
            {(walking_duration + driving.duration).toFixed(0)} min
          </Text>
          <Text style={styles.duration}>
            ({(walking.distance + driving.distance).toFixed(0)}km)
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Image
            source={require('../icons/money.png')}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{height: 40, width: 40}}
          />
          <Text style={styles.value}>
            {/* Driving Distance to 10 for Approx Reading */}
            Rs. {(driving.distance * 10).toFixed()}
          </Text>
          <Text style={styles.duration}>(approx)</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    borderRadius: 15,
    overflow: 'hidden',
    padding: 15,
  },
  imageStyle: {
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 24, 24, 0.1)', // Transparent dark overlay
    borderRadius: 15,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: 35,
    color: 'white',
    marginBottom: 5,
  },
  value: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  duration: {
    color: 'lightgray',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 3,
  },
});

export default DistanceInfoStrip;
