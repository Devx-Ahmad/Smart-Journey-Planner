import React, {useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import TopInfoStrip from './InfoStrip';
import StopInfo from './StopInfo';

const CustomScrollView = props => {
  const scrollViewRef = useRef(null);
  // eslint-disable-next-line no-undef
  screenHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => this._panel.show()}>
        <View>
          <Text>Show</Text>
        </View>
      </TouchableOpacity>
      <SlidingUpPanel
        ref={c => (this._panel = c)}
        draggableRange={{
          // eslint-disable-next-line no-undef
          top: screenHeight - 220,
          bottom: 110,
        }}>
        {dragHandler => (
          <View style={styles.container}>
            <View style={styles.dragHandler} {...dragHandler}>
              <TopInfoStrip walking={props.walking} driving={props.driving} />
            </View>
            <ImageBackground
              source={require('../images/2.jpg')}
              style={styles.backgroundImage}>
              <ScrollView
                ref={scrollViewRef}
                vertical
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={true}
                style={styles.list}>
                {props.data.pt_route.path.map((stop, index) => (
                  <StopInfo
                    key={index}
                    stopName={stop.pt_stop}
                    boarding={stop.boarding}
                    unboarding={stop.unboarding}
                    coordinates={stop.coordinates}
                    mapRef={props.mapRef}
                    _panel={this._panel}
                  />
                ))}
              </ScrollView>
            </ImageBackground>
          </View>
        )}
      </SlidingUpPanel>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dragHandler: {
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  list: {
    flex: 1,
    marginBottom: 185,
  },
});

export default CustomScrollView;
