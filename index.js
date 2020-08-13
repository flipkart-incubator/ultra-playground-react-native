/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import Demo from './src/Demo'

navigator.geolocation = require('@react-native-community/geolocation');


//Everything starts from here, registering app component which'll launch initially
AppRegistry.registerComponent('playground.react', () => Demo);
AppRegistry.registerComponent('playground.home', () => Demo);
