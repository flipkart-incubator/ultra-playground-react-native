import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, TextInput, Text, BackHandler } from 'react-native';
import FKPlatform from "fk-platform-sdk"
import LinearGradient from 'react-native-linear-gradient';
import UserResourceHelper from './UserResourceHelper';

export default class Demo extends Component {
    //Designed Calender root as a component that is reusable and not tightly knit with the application
    //Any other view or navigator can load it up, this not unnecessarily adding a nav library to the project

    constructor(props) {
        super(props);
        this.state = {
            text: '[{"scope":"user.email","isMandatory":true,"shouldVerify":false},{"scope":"user.mobile","isMandatory":false,"shouldVerify":false},{"scope":"user.name","isMandatory":false,"shouldVerify":false}]',
            tokenOutput: '',
            contact: ''
        };
        this.getPermission = this.getPermission.bind(this);
        this.exitSession = this.exitSession.bind(this);
        this.exitToHomePage = this.exitToHomePage.bind(this);
        this.pickContact = this.pickContact.bind(this);
        this.stateChange = this.stateChange.bind(this);
        this.fkPlatform = new FKPlatform("playground");
        this.userResouceHelper = new UserResourceHelper(this.fkPlatform);
    }

    stateChange(state) {
        this.setState({
            tokenOutput: state
        });
    }
    //This methods return CalenderRoot inside a completely stretched parent container.
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Demo</Text>
                <Text style={styles.subTitle}>This demo will only work within the flipkart android app ultra's container. Click on Get Token button to request a token.</Text>
                <TextInput
                    style={styles.permissionInput}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                />
                <Text style={{ marginLeft: 16, marginRight: 16, marginBottom: 0, fontSize: 14 }}> Token output:</Text>
                <TextInput
                    style={styles.permissionInput}
                    onChangeText={(text) => this.setState({ tokenOutput: text })}
                    value={this.state.tokenOutput}
                />
                <TouchableHighlight style={styles.getToken} onPress={this.getPermission}>
                    <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                        Get Token
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.getToken} onPress={this.exitSession}>
                    <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                        Exit Session
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.getToken} onPress={this.exitToHomePage}>
                    <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                        Exit to Home
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.getToken} onPress={this.pickContact}>
                    <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                        Pick Contacts
                    </Text>
                </TouchableHighlight>
                <TextInput
                    style={styles.permissionInput}
                    onChangeText={(text) => this.setState({ contact: text })}
                    value={this.state.contact}
                />
            </View>
        );
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
            // Typically you would use the navigator here to go to the last state.

            return false;
        });
    }

    getPermission() {
        let scopeReq = this.state.text;
        // this.fkPlatform.getModuleHelper().getPermissionsModule().getToken(JSON.parse(scopeReq)).then(
        //     function (e) {
        //         console.log("Your grant token is: " + e.grantToken);
        //         this.setState({
        //             tokenOutput: e.grantToken
        //         });
        //     }.bind(this)).catch(
        //         function (e) {
        //             console.log(e.message);
        //             this.setState({
        //                 tokenOutput: e.message
        //             });
        //         }.bind(this));
        this.userResouceHelper.getToken(scopeReq, this.stateChange);
    }

    exitSession() {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.exitSession();
    }

    exitToHomePage() {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.exitToHomePage();
    }

    pickContact() {
        let contactModule = this.fkPlatform.getModuleHelper().getContactsModule()
        contactModule.pickPhoneNumber().then(function (response) {
            this.setState({
                contact: JSON.stringify(response.result)
            });
        }.bind(this));
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    title: {
        fontSize: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        fontWeight: 'bold',
        margin: 16,
    },
    getToken: {
        backgroundColor: 'green',
        borderColor: 'white',
        borderWidth: 1,
        height: 48,
        marginLeft: 16,
        marginRight: 16,
        zIndex: 2,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    permissionInput: {
        borderColor: 'black',
        marginLeft: 16,
        marginRight: 16,
        marginTop: 12,
        marginBottom: 16,
        borderWidth: 2,
        fontSize: 16,
        height: 48
    },
    subTitle: {
        fontSize: 14,
        margin: 16
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});
