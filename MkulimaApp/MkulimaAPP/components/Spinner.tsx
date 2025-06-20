import { StyleSheet, ActivityIndicator, View, Text, Image } from 'react-native';
import React from 'react';

const Spinner = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Image source={require("../assets/logo/splash-icon.png")} style={{ width: 24}}/>
            <View style={styles.poweredByContainer}>
                <Text>Powered by</Text>
                <Text>Moran</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
    },
    poweredByContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Spinner;
