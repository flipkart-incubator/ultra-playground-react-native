import * as React from 'react';
import { Text, View, ScrollView, TextInput, TouchableHighlight, NativeModules, DeviceEventEmitter, ToastAndroid, Linking, AsyncStorage, PermissionsAndroid } from 'react-native';
import { styles } from '../resources/MainStyle';
import UserResourceHelper from '../UserResourceHelper';
import FKPlatform from 'fk-platform-sdk';
import { CheckBox } from 'react-native-elements';

//@ts-ignore
import { Travel } from "fk-platform-sdk/analytics";

interface PlaygroundState {
    permissionScopeText: string;
    permissionTokenOutput?: string;
    identityToken?: string;
    paymentToken?: string;
    jusPayToken?: string;
    phonePeToken?: string;
    notifyPageLocationChangeUrl: string;
    pickedContact?: string;
    fetchedContactResult?: string;
    fetchContactsForValue: string;
    asyncStorageStringToSave: string;
    asyncStorageKeyToFetch?: string;
    asyncStorageFetchResult?: string;
    navigateToFlipkartUrl: string;
    locationCoordinates?: string;
    observingLocation?: string;
    isObservingLocation?: boolean;
    permissionsList: string[];
    permissions?: string[];
}

interface PlaygroundProps { }

export default class UltraPlayground extends React.Component<PlaygroundProps, PlaygroundState> {
    userResouceHelper: UserResourceHelper;
    fkPlatform: FKPlatform;
    locationWatchId: number = -1;

    constructor(props: PlaygroundProps) {
        super(props)
        this.state = {
            permissionScopeText: '[{"scope":"user.email","isMandatory":true,"shouldVerify":false},{"scope":"user.mobile","isMandatory":false,"shouldVerify":false},{"scope":"user.name","isMandatory":false,"shouldVerify":false}]',
            notifyPageLocationChangeUrl: 'https://www.flipkart.com',
            fetchContactsForValue: '["+91-8861535657","+91-9731208001","+91-111222333"]',
            asyncStorageStringToSave: JSON.stringify({
                key: 'name',
                value: 'john'
            }),
            navigateToFlipkartUrl: 'fapp://action?value={"params": {"screenName": "LOCKED_COINS","valid":true},"screenType": "multiWidgetPage","type":"NAVIGATION","url": "/locked-coins"}',
            permissionsList: [
                'android.permission.ACCESS_WIFI_STATE',
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.READ_CALENDAR',
                'android.permission.BLUETOOTH',
                'android.permission.CAMERA',
                'android.permission.READ_CALL_LOG',
                'android.permission.READ_SMS',
                'android.permission.ACCESS_COARSE_LOCATION'],
        }
        this.fkPlatform = new FKPlatform("playground");
        this.userResouceHelper = new UserResourceHelper(this.fkPlatform);
    }

    render() {
        return <ScrollView>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.headline}>Welcome to Ultra Playground</Text>
                    <Text style={styles.subtitle}>We develop crazy features here 😎</Text>
                    <Text style={[styles.subtitle, { marginTop: 12 }]}>This demo will only work within flipkart android app's ultra container.</Text>
                </View>

                {/** Scope and Payments Flow */}
                <Text style={styles.tag}>Scopes and Payments</Text>
                <Text style={styles.title}>Permission scope</Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => this.setState({ permissionScopeText: text })}
                    value={this.state.permissionScopeText}
                />
                <TextInput
                    style={styles.inputBox}
                    placeholder={'Output will appear here'}
                    onChangeText={(text) => this.setState({ permissionTokenOutput: text })}
                    value={this.state.permissionTokenOutput}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._getPermission}>
                    <Text style={styles.buttonText}>
                        Get Token
                    </Text>
                </TouchableHighlight>

                <Text style={styles.title}>Identity token</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder={'Enter identity token'}
                    onChangeText={(text) => this.setState({ identityToken: text })}
                    value={this.state.identityToken}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._getPaymentToken}>
                    <Text style={styles.buttonText}>
                        Get Payment token
                    </Text>
                </TouchableHighlight>

                <Text style={styles.title}>JusPay Payment</Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder={'Enter payment token'}
                    onChangeText={(text) => this.setState({ jusPayToken: text })}
                    value={this.state.jusPayToken}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._startJusPayPayment}>
                    <Text style={styles.buttonText}>
                        Start Payment
                    </Text>
                </TouchableHighlight>

                <Text style={styles.title}>PhonePe Payment</Text>
                <TextInput
                    placeholder={'Enter payment token'}
                    style={styles.inputBox}
                    onChangeText={(text) => this.setState({ phonePeToken: text })}
                    value={this.state.phonePeToken}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._startPhonePePayment}>
                    <Text style={styles.buttonText}>
                        Start Payment
                    </Text>
                </TouchableHighlight>

                {/** Navigation Module Flow */}
                <Text style={styles.tag}>Navigation Module</Text>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._exitSession}>
                    <Text style={styles.buttonText}>
                        Exit Session
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._exitToHomePage}>
                    <Text style={styles.buttonText}>
                        Exit to Home
                    </Text>
                </TouchableHighlight>
                <Text style={styles.title}>Navigate to Flipkart</Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => this.setState({ navigateToFlipkartUrl: text })}
                    value={this.state.navigateToFlipkartUrl}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._navigateToFlipkart}>
                    <Text style={styles.buttonText}>
                        Navigate To Flipkart
                    </Text>
                </TouchableHighlight>
                <Text style={styles.title}>Notify Page Location Changed</Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => this.setState({ notifyPageLocationChangeUrl: text })}
                    value={this.state.notifyPageLocationChangeUrl}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this.notifyPageLocationChange}>
                    <Text style={styles.buttonText}>
                        Notify Page Location Changed
                    </Text>
                </TouchableHighlight>

                {/** Contacts Flow */}
                <Text style={styles.tag}>Contacts</Text>
                <Text style={styles.title}>Pick Contact</Text>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._pickContact}>
                    <Text style={styles.buttonText}>
                        Pick a contact
                    </Text>
                </TouchableHighlight>
                <Text style={styles.inputBox}>{this.state.pickedContact}</Text>

                <Text style={styles.title}>Fetch Contacts</Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => this.setState({ fetchContactsForValue: text })}
                    value={this.state.fetchContactsForValue}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._fetchContacts}>
                    <Text style={styles.buttonText}>
                        Fetch Contacts
                    </Text>
                </TouchableHighlight>
                <Text style={styles.inputBox}>{this.state.fetchedContactResult}</Text>

                {/** Intent Flow */}
                <Text style={styles.tag}>Intents</Text>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._sendSms}>
                    <Text style={styles.buttonText}>
                        Send SMS
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight style={[styles.buttonContainer, { marginTop: 8 }]} onPress={this._callNumber}>
                    <Text style={styles.buttonText}>
                        Call a number
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight style={[styles.buttonContainer, { marginTop: 8 }]} onPress={this._sendEmail}>
                    <Text style={styles.buttonText}>
                        Send Email
                    </Text>
                </TouchableHighlight>

                {/** Async Storage Flow **/}
                <Text style={styles.tag}>Async Storage</Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={(text) => this.setState({ asyncStorageStringToSave: text })}
                    value={this.state.asyncStorageStringToSave}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._storeInformation}>
                    <Text style={styles.buttonText}>
                        Save to AsyncStorage
                    </Text>
                </TouchableHighlight>
                <TextInput
                    style={styles.inputBox}
                    placeholder={'Enter key to fetch:'}
                    onChangeText={(text) => this.setState({ asyncStorageKeyToFetch: text })}
                    value={this.state.asyncStorageKeyToFetch}
                />
                <TouchableHighlight style={styles.buttonContainer} onPress={this._getInformation}>
                    <Text style={styles.buttonText}>
                        Fetch from AsyncStorage
                    </Text>
                </TouchableHighlight>
                <Text style={styles.inputBox}>{this.state.asyncStorageFetchResult}</Text>

                {/** Permissions Flow */}
                <Text style={styles.tag}>Permissions</Text>
                <Text style={styles.title}>Location</Text>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._requestLocation}>
                    <Text style={styles.buttonText}>
                        Get location permission
                    </Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.buttonContainer} onPress={this._fetchLocation}>
                    <Text style={styles.buttonText}>
                        Fetch user location
                    </Text>
                </TouchableHighlight>
                <Text style={styles.inputBox}>{this.state.locationCoordinates}</Text>

                <TouchableHighlight style={styles.buttonContainer} onPress={this._startObservingLocation}>
                    <Text style={styles.buttonText}>
                        Start observing location
                    </Text>
                </TouchableHighlight>
                <Text style={styles.inputBox}>{this.state.observingLocation}</Text>

                <Text style={styles.title}>Permissions</Text>
                {this.state.permissionsList.map(permission => {
                    return <CheckBox
                        title={permission}
                        key={permission}
                        checked={this.state.permissions ? this.state.permissions.indexOf(permission) > -1 : false}
                        onPress={() => this._onPermissionChecked(permission)}
                    />
                })}
                <TouchableHighlight style={styles.buttonContainer} onPress={this._getPermissions}>
                    <Text style={styles.buttonText}>
                        Get Permissions
                    </Text>
                </TouchableHighlight>

                {/** Breadcrumb Event Flow */}
                <Text style={styles.tag}>Breadcrumb Events</Text>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._sendTravelSearchBreadcrumbEvent}>
                    <Text style={styles.buttonText}>
                        Send Travel-Search Event
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._sendTravelSelectBreadcrumbEvent}>
                    <Text style={styles.buttonText}>
                        Send Travel-Select Event
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._sendTravelPayBreadcrumbEvent}>
                    <Text style={styles.buttonText}>
                        Send Travel-Pay Event
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonContainer} onPress={this._sendInvalidEvent}>
                    <Text style={styles.buttonText}>
                        Send Invalid Event
                    </Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    }

    private _onPermissionChecked = (permission: string) => {
        const grantedPerms: string[] = []
        this.state.permissions && this.state.permissions.map((perm) => {
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

    private _getPermission = async () => {
        let scopeReq = this.state.permissionScopeText;
        this.setState({
            permissionTokenOutput: 'fetching grant token...'
        });
        let grantToken = await this.userResouceHelper.getTokenForCreds(scopeReq);
        this.setState({
            permissionTokenOutput: 'fetching identity token...'
        });
        let tokens = await this.userResouceHelper.getIdentityToken(grantToken);
        let userInfoScope = ["user.mobile", "user.email", "user.accountId"];
        this.setState({
            permissionTokenOutput: 'fetching user information...',
            identityToken: tokens.identityToken
        });
        let userInfo = await this.userResouceHelper.getUserInfo(userInfoScope, tokens.accessToken);
        this.setState({
            permissionTokenOutput: JSON.stringify(userInfo)
        });
    }

    private _getPaymentToken = async () => {
        let paymentToken = await this.userResouceHelper.startPayment(this.state.identityToken);
        this.setState({
            paymentToken: paymentToken
        });
    }

    private _startJusPayPayment = () => {
        this.userResouceHelper.openPayments(this.state.jusPayToken);
    }

    private _startPhonePePayment = () => {
        NativeModules.PhonePeModule.startPayment("test", '{"redirectURL":"/app","gatewayURL":"/app","params":[{"key":"token","value":"' + this.state.phonePeToken + '"}],"package":null}', "onPhonePe")
        DeviceEventEmitter.addListener("loadUri", (response) => {
            ToastAndroid.show(response.loadUri, ToastAndroid.SHORT);
        })
    }

    private _exitSession = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.exitSession();
    }

    private notifyPageLocationChange = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.notifyPageLocationChange(this.state.notifyPageLocationChangeUrl, false);
    }

    private _exitToHomePage = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.exitToHomePage();
        this.fkPlatform.getModuleHelper().getNavigationModule().notifyPageLocationChange(this.state.notifyPageLocationChangeUrl, false)
    }

    private _pickContact = async () => {
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

    private _fetchContacts = async () => {
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

    private _sendSms = async () => {
        Linking.openURL('smsto:8888888888');
    }

    private _callNumber = async () => {
        Linking.openURL('tel:8888888888');
    }

    private _sendEmail = async () => {
        Linking.openURL('mailto:abc@gmail.com');
    }

    private _storeInformation = async () => {
        try {
            let storedInfo = JSON.parse(this.state.asyncStorageStringToSave);
            await AsyncStorage.setItem(storedInfo.key, storedInfo.value, () => {
                ToastAndroid.show('Saved to AsyncStorage', ToastAndroid.SHORT);
            });
        } catch (e) {

        }
    }

    private _getInformation = async () => {
        try {
            let response = this.state.asyncStorageKeyToFetch && await AsyncStorage.getItem(this.state.asyncStorageKeyToFetch);
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

    private _navigateToFlipkart = () => {
        let navigationModule = this.fkPlatform.getModuleHelper().getNavigationModule();
        navigationModule.navigateToFlipkart(this.state.navigateToFlipkartUrl);
    }

    private _requestLocation = () => {
        PermissionsAndroid.request("android.permission.ACCESS_FINE_LOCATION");
    }

    private _fetchLocation = () => {
        navigator.geolocation.getCurrentPosition((success) => {
            this.setState({
                locationCoordinates: success.coords.latitude + " : " + success.coords.longitude
            })
        }, (positionError) => {
            this.setState({
                locationCoordinates: positionError.message
            })
        })
    }

    private _startObservingLocation = () => {
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
            this.locationWatchId = -1;
            this.setState({
                isObservingLocation: false
            });
        }
    }

    private _getPermissions = () => {
        this.state.permissions && PermissionsAndroid.requestMultiple(this.state.permissions)
    }

    private _sendTravelSearchBreadcrumbEvent = () => {
        const search = new Travel.Search("BLR", ["DEL"], [new Date()], false, 1);
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(search);
    }

    private _sendTravelSelectBreadcrumbEvent = () => {
        const select = new Travel.Select('john', 'domestic', '12000');
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(select);
    }

    private _sendTravelPayBreadcrumbEvent = () => {
        const payEvent = new Travel.ProceedToPay(12000, 100, 200, 10);
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(payEvent);
    }

    private _sendInvalidEvent = () => {
        const search = new Travel.Search(null, ["DEL"], [new Date()], false, 1);
        this.fkPlatform.getModuleHelper().getAnalyticsModule().pushEvent(search);
    }
}
