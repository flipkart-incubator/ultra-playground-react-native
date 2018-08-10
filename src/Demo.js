import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, TextInput, Text, BackHandler, ScrollView } from 'react-native';
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
            contact: '',
            accessToken: '',
            paymentToken: ''
        };
        this.fkPlatform = new FKPlatform("playground");
        this.userResouceHelper = new UserResourceHelper(this.fkPlatform);
    }

    //This methods return CalenderRoot inside a completely stretched parent container.
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Demo</Text>
                    <Text style={styles.subTitle}>This demo will only work within the flipkart android app ultra's container. Click on Get Token button to request a token.</Text>
                    <Text style={styles.subTitle}>Permission scope: </Text>
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
                    <Text style={styles.subTitle}>Access token: </Text>
                    <TextInput
                        style={styles.permissionInput}
                        onChangeText={(text) => this.setState({ accessToken: text })}
                        value={this.state.accessToken}
                    />
                    <TouchableHighlight style={styles.getToken} onPress={this.getPaymentToken}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Get Payment token
                    </Text>
                    </TouchableHighlight>
                    <TextInput
                        style={styles.permissionInput}
                        onChangeText={(text) => this.setState({ paymentToken: text })}
                        value={this.state.paymentToken}
                    />
                    <TouchableHighlight style={styles.getToken} onPress={this.startPayment}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Start Payment
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
            </ScrollView>
        );
    }

    getPermission = async () => {
        let scopeReq = this.state.text;
        this.setState({
            tokenOutput: 'fetching grant token...'
        });
        let grantToken = await this.userResouceHelper.getTokenForCreds(scopeReq);
        this.setState({
            tokenOutput: 'fetching identity token...'
        });
        let tokens = await this.userResouceHelper.getIdentityToken(grantToken);
        let userInfoScope = ["user.mobile", "user.email", "user.accountId"];
        this.setState({
            tokenOutput: 'fetching user information...',
            accessToken: tokens.accessToken
        });
        let userInfo = await this.userResouceHelper.getUserInfo(userInfoScope, tokens.accessToken);
        this.setState({
            tokenOutput: JSON.stringify(userInfo)
        });
    }

    exitSession = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.exitSession();
    }

    exitToHomePage = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.exitToHomePage();
    }

    pickContact = () => {
        let contactModule = this.fkPlatform.getModuleHelper().getContactsModule()
        contactModule.pickPhoneNumber().then(function (response) {
            this.setState({
                contact: JSON.stringify(response.result)
            });
        }.bind(this));
    }

    getPaymentToken = async () => {
        let paymentToken = await this.userResouceHelper.startPayment(this.state.accessToken);
        this.setState({
            paymentToken: paymentToken
        });
    }

    startPayment = () => {
        this.userResouceHelper.openPayments(this.state.paymentToken);
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
