import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, ImageBackground, Animated} from 'react-native';

const LoadingScreen = () => {
  //  holds the animated value for rerenders
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        //offloading work to the native
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground
      source={require('../images/2.jpg')}
      style={styles.background}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.text}>Smart Journey Planner</Text>
        <Animated.Image
          source={require('../images/tour.png')}
          style={[styles.icon, {transform: [{rotate: rotateInterpolation}]}]}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 8,
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default LoadingScreen;
