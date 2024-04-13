import React, { useEffect, useState, useRef } from 'react';
import { Alert, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Clipboard from '@react-native-clipboard/clipboard'; // Import Clipboard

const Map = () => {
    const [location, setLocation] = useState<Region | null>(null);
    const [followUserLocation, setFollowUserLocation] = useState(false);
    const [participantsVisible, setParticipantsVisible] = useState(false); // Toggle visibility for participants

    // Define initial region here
    const initialRegion: Region = {
        latitude: 1.3521,
        longitude: 103.8198,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };
    const [region, setRegion] = useState<Region>(initialRegion);

    // Example participants' locations
    const participants = [
      { id: '1', name: 'Alice', latitude: 1.3521, longitude: 103.8198 },
      { id: '2', name: 'Bob', latitude: 1.3525, longitude: 103.8199 },
      { id: '3', name: 'Charlie', latitude: 1.3529, longitude: 103.8200 },
    ];

    useEffect(() => {
        requestPermissions(); // Automatically request permissions when component mounts
    }, []);

    // Function to copy the invite link to clipboard
    const copyInviteLink = () => {
        const inviteLink = "https://example.com/joinParty?partyId=123"; // Example link
        Clipboard.setString(inviteLink);
        Alert.alert("Link copied to clipboard!");
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position: { coords: { latitude: any; longitude: any; }; }) => {
                const newLocation: Region = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };
                setLocation(newLocation);
                if (followUserLocation) {
                    setRegion(newLocation);
                }
            },
            (error: any) => {
                console.log(error);
                Alert.alert('Error', 'Unable to fetch location');
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization(
                () => { // Modify this line, remove the argument 'status'
                    getCurrentLocation();
                },
                (error: any) => {
                    console.log(error);
                    Alert.alert('Error', 'Unable to request location permission');
                }
            );
        } else {
            const rationale = {
                title: 'Location Permission',
                message: 'This app needs access to your location.',
                buttonPositive: 'OK'
            };
    
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                rationale,
            );
    
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation();
            } else {
                Alert.alert('Permission Denied', 'Cannot access location');
            }
        }
    };
    

    return (
        <View style={styles.container}>
        <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={initialRegion}
            region={region}
            showsUserLocation={true}
            >
            {participants.map((participant) => (
                <Marker
                    key={participant.id}
                    coordinate={{ latitude: participant.latitude, longitude: participant.longitude }}
                    title={participant.name}
                />
            ))}
        </MapView>
        <TouchableOpacity onPress={copyInviteLink} style={styles.copyLinkButton}>
            <Text style={styles.copyLinkText}>Copy Invite Link</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setParticipantsVisible(!participantsVisible)} style={styles.participantsToggleButton}>
            <Text style={styles.participantsToggleText}>{participantsVisible ? 'Hide' : 'Show'} Participants</Text>
        </TouchableOpacity>
        {participantsVisible && (
            <View style={styles.participantsList}>
                <Text style={styles.participantsListHeader}>Participants:</Text>
                {participants.map((participant) => (
                    <Text key={participant.id} style={styles.participantName}>{participant.name}</Text>
                ))}
            </View>
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    copyLinkButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    copyLinkText: {
        color: '#ffffff',
        fontSize: 14,
    },
    participantsToggleButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
    },
    participantsToggleText: {
        color: '#ffffff',
        fontSize: 14,
    },
    participantsList: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 5,
        width: 200,
    },
    participantsListHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    participantName: {
        fontSize: 14,
    },
    // Add other styles here...
});

export default Map;
