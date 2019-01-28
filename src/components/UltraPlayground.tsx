import * as React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { styles } from '../resources/MainStyle';

export default class UltraPlayground extends React.Component {
    render() {
        return <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Ultra Playground Demo</Text>
            </View>
        </ScrollView>
    }
}
