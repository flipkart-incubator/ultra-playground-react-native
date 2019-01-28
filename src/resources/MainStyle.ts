import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 16
    },
    titleContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 16
    },
    headline: {
        fontSize: 18,
        alignSelf: 'center',
        color: '#000'
    },
    tag: {
        fontSize: 16,
        backgroundColor: '#cfcfcf',
        fontWeight: 'bold',
        color: '#000',
        padding: 12,
        marginTop: 16,
        marginLeft: -16,
        marginRight: -16
    },
    subtitle: {
        fontSize: 14,
        alignSelf: 'center',
        textAlign: 'center'
    },
    title: {
        fontSize: 16,
        color: '#000',
        marginTop: 12
    },
    buttonContainer: {
        backgroundColor: 'green',
        height: 48,
        elevation: 2,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        color: 'white',
        fontSize: 14
    },
    inputBox: {
        borderColor: '#dfdfdf',
        marginTop: 12,
        borderWidth: 2,
        fontSize: 16,
        height: 48
    },
});