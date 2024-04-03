import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Clipboard from '@react-native-clipboard/clipboard';

const RideSharingScreen = () => {
    const [destination, setDestination] = useState('');
    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number } | null>(null);
    const [shareLink, setShareLink] = useState('');

    useEffect(() => {
        fetchCurrentLocation();
    }, []);

    const fetchCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position: { coords: { latitude: number; longitude: number }; }) => {
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            },
            (error: any) => Alert.alert('Error', 'Unable to fetch current location'),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const generateShareLink = () => {
        if (!currentLocation || destination.trim() === '') {
            Alert.alert('Error', 'Current location or destination is missing');
            return;
        }
        const link = `https://myrideshareapp.com/share?destination=${encodeURIComponent(destination)}&lat=${currentLocation.latitude}&lng=${currentLocation.longitude}`;
        setShareLink(link);
    };

    const copyLinkToClipboard = () => {
        Clipboard.setString(shareLink);
        Alert.alert('Success', 'Link copied to clipboard!');
    };

    return (
        <View style={styles.container}>
            {currentLocation && (
                <MapView
                    style={styles.map}
                    initialRegion={currentLocation}
                    showsUserLocation={true}
                >
                    {/* Optional: Marker for destination if you want to show it on the map */}
                </MapView>
            )}
            <View style={styles.bottomPanel}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter destination"
                    value={destination}
                    onChangeText={setDestination}
                />
                <TouchableOpacity style={styles.button} onPress={generateShareLink}>
                    <Text style={styles.buttonText}>Generate Share Link</Text>
                </TouchableOpacity>
                {shareLink !== '' && (
                    <TouchableOpacity style={styles.button} onPress={copyLinkToClipboard}>
                        <Text style={styles.buttonText}>Copy Link</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '70%',
    },
    bottomPanel: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: '100%',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
    },
});

export default RideSharingScreen;
