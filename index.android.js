/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from '../../../Library/Caches/typescript/2.9/node_modules/@types/react';
import {AppRegistry} from 'react-native';
import Demo from './src/Demo'

//Everything starts from here, registering app component which'll launch initially
AppRegistry.registerComponent('ultra', () => Demo);
