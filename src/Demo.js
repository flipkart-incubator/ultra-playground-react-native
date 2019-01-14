import React, { Component } from 'react';
import { CameraRoll, View, StyleSheet, TouchableHighlight, TextInput, Text, NativeModules, ScrollView, AsyncStorage, Linking, ToastAndroid, DeviceEventEmitter, Geolocation, PermissionsAndroid } from 'react-native';
import FKPlatform from "fk-platform-sdk"
import UserResourceHelper from './UserResourceHelper';
import { CheckBox } from 'react-native-elements'
import { Travel } from "fk-platform-sdk/analytics";

export default class Demo extends Component {
    //Designed Calender root as a component that is reusable and not tightly knit with the application
    //Any other view or navigator can load it up, this not unnecessarily adding a nav library to the project

    locationWatchId; //for caching watch id across renders

    constructor(props) {
        super(props);
        this.state = {
            text: '[{"scope":"user.email","isMandatory":true,"shouldVerify":false},{"scope":"user.mobile","isMandatory":false,"shouldVerify":false},{"scope":"user.name","isMandatory":false,"shouldVerify":false}]',
            tokenOutput: '',
            pickedContact: '',
            fetchContactsForValue: '["+91-8861535657","+91-9731208001","+91-111222333"]',
            fetchedContactResult: '',
            identityToken: '',
            jusPayToken: '',
            phonePeToken: 'YTdhMDlmYTg5YWZkNWE5ZDcyYzVhM2FhMmRjNWU0OThhZTFkOTc1MGZiYzBmMmY5ZGZkZjc0MzM2Zjk3M2YzMmFmZGFiNjA4OTczNTYyOTA4Y2ViOGYxZGRhMGRmOTllNjUwY2Q5MGUyYjI1NGM0MmY0ZjFhZjNmNDEwNjM4MTY1ZjdjOWRlMjIwMGEwOTIxMzc5M2Uw',
            asyncStorageStringToSave: JSON.stringify({
                key: 'name',
                value: 'john'
            }),
            asyncStorageFetchResult: '',
            coordinates: '',
            permissionsList: [
                'android.permission.ACCESS_WIFI_STATE',
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.READ_CALENDAR',
                'android.permission.BLUETOOTH',
                'android.permission.CAMERA',
                'android.permission.READ_CALL_LOG',
                'android.permission.READ_SMS',
                'android.permission.ACCESS_COARSE_LOCATION'],
            permissions: [],
            asyncStorageKeyToFetch: 'name',
            notifyPageLocationChangeUrl: 'https://www.flipkart.com',
            observingLocation: '',
            isObservingLocation: false,
            navigateToFlipkartUrl: 'fapp://action?value={"params": {"screenName": "LOCKED_COINS","valid":true},"screenType": "multiWidgetPage","type":"NAVIGATION","url": "/locked-coins"}',
        };
        this.fkPlatform = new FKPlatform("playground");
        this.userResouceHelper = new UserResourceHelper(this.fkPlatform);
    }

    //This methods return CalenderRoot inside a completely stretched parent container.
    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.title}>Welcome to React-Native Demo</Text>
                    <Text style={styles.subTitle}>This demo will only work within the flipkart android app ultra's container. Click on Get Token button to request a token.</Text>
                    <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 12 }}>Permission scope: </Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                    />
                    <Text style={{ fontSize: 14 }}> Token output:</Text>
                    <TextInput
                        style={styles.permissionInput}
                        onChangeText={(text) => this.setState({ tokenOutput: text })}
                        value={this.state.tokenOutput}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.getPermission}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Get Token
                        </Text>
                    </TouchableHighlight>

                    {/** Identity Token **/}
                    <Text style={{ fontSize: 14, marginBottom: 12, marginTop: 12 }}>Identity token: </Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ identityToken: text })}
                        value={this.state.identityToken}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.getPaymentToken}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Get Payment token
                    </Text>
                    </TouchableHighlight>

                    {/** JusPay Payments **/}
                    <Text style={styles.title}>JusPay Payment</Text>
                    <Text style={{ fontSize: 14, marginBottom: 12 }}>Token:</Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ jusPayToken: text })}
                        value={this.state.jusPayToken}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.startJusPayPayment}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Start Payment
                        </Text>
                    </TouchableHighlight>

                    {/** PhonePe Payments **/}
                    <Text style={styles.title}>PhonePe Payment</Text>
                    <Text style={{ fontSize: 14, marginBottom: 12 }}>Token:</Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ phonePeToken: text })}
                        value={this.state.phonePeToken}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.startPhonePePayment}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Start Payment
                        </Text>
                    </TouchableHighlight>

                    {/** Navigations **/}
                    <Text style={styles.title}>Navigation</Text>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.exitSession}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Exit Session
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={[styles.buttonContainer, { marginTop: 8 }]} onPress={this.exitToHomePage}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Exit to Home
                        </Text>
                    </TouchableHighlight>

                    {/** Pick Contacts **/}
                    <Text style={styles.title}>Pick Contact</Text>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.pickContact}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Pick a contact
                        </Text>
                    </TouchableHighlight>
                    <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 12 }}>Result:</Text>
                    <Text style={[styles.permissionInput, { marginTop: 0 }]}>{this.state.pickedContact}</Text>

                    {/** Fetch Contacts **/}
                    <Text style={styles.title}>Fetch Contacts</Text>
                    <Text style={{ fontSize: 14 }}>Enter numbers to fetch:</Text>
                    <TextInput
                        style={styles.permissionInput}
                        onChangeText={(text) => this.setState({ fetchContactsForValue: text })}
                        value={this.state.fetchContactsForValue}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.fetchContacts}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Fetch Contacts
                        </Text>
                    </TouchableHighlight>
                    <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 12 }}>Result:</Text>
                    <Text style={[styles.permissionInput, { marginTop: 0 }]}>{this.state.fetchedContactResult}</Text>

                    {/** Intents **/}
                    <Text style={styles.title}>Intents</Text>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.sendSms}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Send SMS
                        </Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, { marginTop: 8 }]} onPress={this.callNumber}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Call a number
                        </Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, { marginTop: 8 }]} onPress={this.sendEmail}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Send Email
                        </Text>
                    </TouchableHighlight>

                    {/** Async Storage **/}
                    <Text style={styles.title}>Async Storage</Text>
                    <Text style={{ fontSize: 14, marginBottom: 12 }}>Information to store:</Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ asyncStorageStringToSave: text })}
                        value={this.state.asyncStorageStringToSave}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.storeInformation}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Save to AsyncStorage
                        </Text>
                    </TouchableHighlight>
                    <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 12 }}>Enter key to fetch:</Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ asyncStorageKeyToFetch: text })}
                        value={this.state.asyncStorageKeyToFetch}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.getInformation}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Fetch from AsyncStorage
                        </Text>
                    </TouchableHighlight>
                    <Text style={{ fontSize: 14, marginTop: 12, marginBottom: 12 }}>Result:</Text>
                    <Text style={[styles.permissionInput, { marginTop: 0 }]}>{this.state.asyncStorageFetchResult}</Text>

                    {/** Navigate to Flipkart **/}
                    <Text style={styles.title}>Navigate to Flipkart</Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ navigateToFlipkartUrl: text })}
                        value={this.state.navigateToFlipkartUrl}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.navigateToFlipkart}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Navigate To Flipkart
                        </Text>
                    </TouchableHighlight>

                    {/** Notify Page Location Changed **/}
                    <Text style={styles.title}>Notify Page Location Changed</Text>
                    <TextInput
                        style={[styles.permissionInput, { marginTop: 0 }]}
                        onChangeText={(text) => this.setState({ notifyPageLocationChangeUrl: text })}
                        value={this.state.notifyPageLocationChangeUrl}
                    />
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.notifyPageLocationChange}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Notify Page Location Changed
                        </Text>
                    </TouchableHighlight>

                    {/** Location **/}
                    <Text style={styles.title}>Location</Text>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.requestLocation}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Get location permission
                        </Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={[styles.buttonContainer, { marginTop: 8 }]} onPress={this.fetchLocation}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Fetch user location
                        </Text>
                    </TouchableHighlight>
                    <Text style={[styles.permissionInput, { marginTop: 8 }]}>{this.state.coordinates}</Text>

                    <TouchableHighlight style={[styles.buttonContainer, { marginTop: 8 }]} onPress={this.startObservingLocation}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Start observing location
                        </Text>
                    </TouchableHighlight>
                    <Text style={[styles.permissionInput, { marginTop: 8 }]}>{this.state.observingLocation}</Text>

                    {/** Camera **/}
                    <Text style={styles.title}>Camera roll</Text>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.getPhotos}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Get Photos
                        </Text>
                    </TouchableHighlight>

                    {/** Permissions **/}
                    <Text style={styles.title}>Permissions</Text>
                    {this.state.permissionsList.map(permission => {
                        return <CheckBox
                            title={permission}
                            key={permission}
                            checked={this.state.permissions.indexOf(permission) > -1}
                            onPress={() => this.onPermissionChecked(permission)}
                        />
                    })}
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.getPermissions}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Get Permissions
                        </Text>
                    </TouchableHighlight>
                    <Text style={styles.title}>Events</Text>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.sendTravelSearchBreadcrumbEvent}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Send Travel-Search Event
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.sendTravelSelectBreadcrumbEvent}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Send Travel-Select Event
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.sendTravelPayBreadcrumbEvent}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Send Travel-Pay Event
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.buttonContainer} onPress={this.sendInvalidEvent}>
                        <Text style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', color: 'white', fontSize: 14 }}>
                            Send Invalid Event
                        </Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        );
    }

    onPermissionChecked = (permission) => {
        const grantedPerms = []
        this.state.permissions.map((perm) => {
            grantedPerms.push(perm)
        })
        const index = grantedPerms.indexOf(permission);
        const notInList = index === -1
        if (notInList) {
            grantedPerms.push(permission)
            this.setState({ permissions: grantedPerms })
        } else {
            if (index > -1) {
                this.setState({ permissions: grantedPerms.filter(item => item !== permission) })
            }
        }
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
            identityToken: tokens.identityToken
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

    navigateToFlipkart = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.navigateToFlipkart(this.state.navigateToFlipkartUrl);
    }

    notifyPageLocationChange = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.notifyPageLocationChange(this.state.notifyPageLocationChangeUrl, false);
    }

    exitToHomePage = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.exitToHomePage();
        this.fkPlatform.getModuleHelper().getNavigationModule().notifyPageLocationChange(this.state.notifyPageLocationChangeUrl, false)
    }

    pickContact = async () => {
        let contactModule = this.fkPlatform.getModuleHelper().getContactsModule();
        let response;
        try {
            response = (await contactModule.pickPhoneNumber()).result;
        } catch (e) {
            response = e.message
        }
        this.setState({
            pickedContact: JSON.stringify(response)
        });
    }

    fetchContacts = async () => {
        let contactModule = this.fkPlatform.getModuleHelper().getContactsModule();
        let response;
        try {
            response = (await contactModule.getContactInfo(JSON.parse(this.state.fetchContactsForValue))).result;
        } catch (e) {
            response = e.message
        }
        this.setState({
            fetchedContactResult: JSON.stringify(response)
        });
    }

    getPaymentToken = async () => {
        let paymentToken = await this.userResouceHelper.startPayment(this.state.identityToken);
        this.setState({
            paymentToken: paymentToken
        });
    }

    startJusPayPayment = () => {
        this.userResouceHelper.openPayments(this.state.jusPayToken);
    }

    startPhonePePayment = () => {
        // debugger;
        NativeModules.PhonePeModule.startPayment("test", '{"redirectURL":"/app","gatewayURL":"/app","params":[{"key":"token","value":"' + this.state.phonePeToken + '"}],"package":null}', "onPhonePe")
        // ToastAndroid.show('not supported yet !!', ToastAndroid.SHORT);
        DeviceEventEmitter.addListener("loadUri", (response) => {
            ToastAndroid.show(response.loadUri, ToastAndroid.SHORT);
        })
    }

    storeInformation = async () => {
        try {
            let storedInfo = JSON.parse(this.state.asyncStorageStringToSave);
            await AsyncStorage.setItem(storedInfo.key, storedInfo.value, () => {
                ToastAndroid.show('Saved to AsyncStorage', ToastAndroid.SHORT);
            });
        } catch (e) {
            this.setState({
                storedInfo: JSON.stringify(e)
            });
        }
    }

    getInformation = async () => {
        try {
            let response = await AsyncStorage.getItem(this.state.asyncStorageKeyToFetch);
            this.setState({
                asyncStorageFetchResult: JSON.stringify({
                    key: this.state.asyncStorageKeyToFetch,
                    value: response
                })
            });
        } catch (e) {
            this.setState({
                asyncStorageFetchResult: JSON.stringify(e)
            });
        }
    }

    sendSms = async () => {
        Linking.openURL('smsto:8888888888');
    }

    callNumber = async () => {
        Linking.openURL('tel:8888888888');
    }

    sendEmail = async () => {
        Linking.openURL('mailto:abc@gmail.com');
    }

    requestLocation = () => {
        PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION");
    }

    fetchLocation = () => {
        navigator.geolocation.getCurrentPosition((success) => {
            this.setState({
                coordinates: success.coords.latitude + " : " + success.coords.longitude
            })
        }, (positionError) => {
            this.setState({
                coordinates: positionError.message
            })
        })
    }

    startObservingLocation = () => {
        if (!this.state.isObservingLocation) {
            this.locationWatchId = navigator.geolocation.watchPosition((success) => {
                this.setState({
                    observingLocation: success.coords.latitude + " : " + success.coords.longitude,
                    isObservingLocation: true
                })
            }, (positionError) => {
                navigator.geolocation.clearWatch(this.locationWatchId);
                this.setState({
                    observingLocation: positionError.message,
                    isObservingLocation: false
                })
            })
        } else {
            navigator.geolocation.clearWatch(this.locationWatchId);
            this.locationWatchId = undefined;
            this.setState({
                isObservingLocation: false
            });
        }
    }

    getPhotos = () => {
        CameraRoll.getPhotos({
            first: 1
        })
    }

    getPermissions = () => {
        PermissionsAndroid.requestMultiple(this.state.permissions)
    }

    sendTravelSearchBreadcrumbEvent = () => {
        const search = new Travel.Search("BLR", ["DEL"], [new Date()], false, 1);
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(search);
    }

    sendTravelSelectBreadcrumbEvent = () => {
        const select = new Travel.Select('john', 'domestic', '12000');
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(select);
    }

    sendTravelPayBreadcrumbEvent = () => {
        const payEvent = new Travel.ProceedToPay(12000, 100, 200, 10);
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(payEvent);
    }

    sendInvalidEvent = () => {
        const search = new Travel.Search(null, ["DEL"], [new Date()], false, 1);
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(search);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    title: {
        fontSize: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginTop: 16,
        paddingBottom: 12
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
    buttonContainer: {
        backgroundColor: 'green',
        height: 48,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    permissionInput: {
        borderColor: 'black',
        marginTop: 12,
        marginBottom: 16,
        borderWidth: 2,
        fontSize: 16,
        height: 48
    },
    subTitle: {
        fontSize: 14,
        marginTop: 16,
        marginBottom: 16
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
    }
});
