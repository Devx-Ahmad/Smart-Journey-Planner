import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const StartScreen = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current; // for dot indicators if needed
  const slider = useRef(null); // Ref to the FlatList
  const [images] = useState([
    {id: '1', uri: require('../images/2.jpg')},
    {id: '2', uri: require('../images/2.jpeg')},
    {id: '3', uri: require('../images/4.jpg')},
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        if (slider.current) {
          slider.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 4000); // Change image every 3 seconds

    return () => clearInterval(interval);
  });

  return (
    <ScrollView style={styles.container}>
      <Animated.FlatList
        ref={slider}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={images}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Image source={item.uri} style={styles.backgroundImage} />
        )}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => {
          // Update the index when scrolling stops
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Plan Your Journey</Text>

        <TouchableOpacity onPress={() => navigation.navigate('maps')}>
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.button}>
            <Text style={styles.buttonText}>Plan Route</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.titleWithIcon}>
          <Image
            source={require('../icons/map.png')}
            style={styles.searchIcon}
          />
        </View>
      </View>

      <View style={styles.infoCard1}>
        <Text style={styles.infoCardTitle}>View Your Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.button}>
            <Text style={styles.buttonText}>Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.titleWithIcon}>
          <Image
            source={require('../icons/verified.png')}
            style={styles.searchIcon}
          />
        </View>
      </View>
      <View style={styles.infoCard4}>
        <Text style={styles.infoCardTitle}>Report Any Problems</Text>

        <TouchableOpacity onPress={() => navigation.navigate('ReportProblem')}>
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.button}>
            <Text style={styles.buttonText}>Report Issues</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.titleWithIcon}>
          <Image
            source={require('../icons/report.png')}
            style={styles.searchIcon}
          />
        </View>
      </View>
      <View style={styles.infoCard3}>
        <Text style={styles.infoCardTitle}>About SJP</Text>

        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.button}>
            <Text style={styles.buttonText}>About Us</Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.titleWithIcon}>
          <Image
            source={require('../icons/about-us.png')}
            style={styles.searchIcon}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  buttonContainer: {
    // Center the buttons vertically and horizontally
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white for visibility
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    backgroundColor: '#007AFF', // Attractive blue
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10, // Space between buttons
    alignItems: 'center', // Center text horizontally
    width: 200, // Set a fixed width for each button
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold', // Make the text bold
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black for visibility
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '2%', // Adjust based on your layout
    width: '90%', // Make it stand out
  },
  infoCard4: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black for visibility
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '71%', // Adjust based on your layout
    width: '90%', // Make it stand out
  },
  infoCard1: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black for visibility
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '25%', // Adjust based on your layout
    width: '90%', // Make it stand out
  },
  infoCard3: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black for visibility
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '48%', // Adjust based on your layout
    width: '90%', // Make it stand out
  },
  infoCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 16,
    color: '#fff',
  },
  searchIcon: {
    marginLeft: 220,
    marginTop: -65,
    width: 60,
    height: 60,
  },
});

export default StartScreen;
