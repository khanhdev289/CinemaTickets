import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const WelComeNew = () => {
  const navigation = useNavigation();
  const position = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: -50,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/Avengers.jpg')}
        style={[
          styles.image,
          {
            transform: [{translateX: position}, {scale: scale}],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: width * 1.1,
    height: height,
    resizeMode: 'cover',
  },
});

export default WelComeNew;