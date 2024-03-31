import React, { useEffect, useState, useRef } from 'react';
import { Alert, Image, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { mobile } from '../LoginForm/Login';
import Geolocation from '@react-native-community/geolocation';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    // Add other screens if needed
    'FAQ': undefined;
    'Privacy Concerns': undefined;
    'Change Password' : undefined;
    'Login' : undefined;
};

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
  
interface Props {
	navigation: ScreenNavigationProp;
}

const Map = ({navigation}:Props) => {
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [location, setLocation] = useState<Region | null>(null); // Updated user location state
    const [region, setRegion] = useState<Region | null>(null); // map display region
    const initialRegion: Region = {
        latitude: 1.3521,
        longitude: 103.8198,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };
    const [followUserLocation, setFollowUserLocation] = useState(false); // Flag to follow user location
    const locationUpdateTimer = useRef<NodeJS.Timeout | null>(null);

    const handleToggleSidePanel = () => {
        setShowSidePanel(!showSidePanel);
    };

    const handleCloseSidePanel = () => {
        setShowSidePanel(false);
    };

    const [markerVisible, setMarkerVisible] = useState(false);

    useEffect(() => {
        setMarkerVisible(false); // Marker not visible when component mounts since not user location
        return () => {
            stopLocationUpdates(); // Cleanup function to stop location updates when component unmounts
        };
    }, []);

    const handleGPSpress = () => {
        if (!followUserLocation) {
            requestPermissions();
        } else {
            startLocationUpdates(); // get current location and center the map on user's location
            setRegion(location);
        }
    }

    const handleMapPress = () => {
        setFollowUserLocation(false);   //map not centred on user's location
    }

    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    startLocationUpdates();
                } else {
                    Alert.alert('Permission Denied', 'Cannot access location');
                }
            } else {
                startLocationUpdates(); // Directly attempt to fetch on iOS as permission prompt is automatic
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const startLocationUpdates = () => {
        if (!locationUpdateTimer.current) {
            locationUpdateTimer.current = setInterval(getCurrentLocation, 2000); // Update location every 2 seconds
        }
    };

    const stopLocationUpdates = () => {
        if (locationUpdateTimer.current) {
            clearInterval(locationUpdateTimer.current);
            locationUpdateTimer.current = null;
        }
    };

    const getCurrentLocation = () => {
        setFollowUserLocation(true); // Center the map on the user's location
        Geolocation.getCurrentPosition(
            (position: { coords: { latitude: any; longitude: any; }; }) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                });
                setMarkerVisible(true);
            },
            (error: any) => {
                Alert.alert('Error', 'Unable to fetch location');
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 10 },
        );
    };

    const handleSearch = () => {
        // Implementation logic for bicycle search
        // Get user input location -> convert to coordinates and compare with bicycle lots
    };

    const filterSearch = () => {
        // Implementation logic for filter
        // Get user input and then filter for number of lots to search then display
    };

    const displayLots = () => {
        // Implementation logic for display
        // After retrieving nearest 5, display on gmaps
    };

    const seeMoreLots = () => {
        // Implementation logic to get next 5 lots
        // Call display lots function to display them
    };

    const handleFAQ = () => {
        navigation.navigate('FAQ');
    }

    const handlePrivacyConcerns = () => {
        navigation.navigate('Privacy Concerns');
    }

    const handleChangePW = () => {
        navigation.navigate('Change Password');
    }

    const handleLogout = () => {
        navigation.replace('Login');
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region ? region : initialRegion} // Update map region to user location else initial render
                onRegionChange={handleMapPress}
                onRegionChangeComplete={newRegion => {
                    if (!followUserLocation) {
                        setRegion(newRegion);
                    }
                }}
                followsUserLocation={followUserLocation} // Center the map on user's location if needed
                showsUserLocation={followUserLocation} // Show user's location on the map if needed
            >
                {markerVisible && location && <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />}
            </MapView>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search location" />

                {/* Need to implement dropdown for filter */}
                <TouchableOpacity style={styles.filterButton} onPress={filterSearch}>
                    <Image source={require('./FilterLogo.png')} style={styles.filterIcon} resizeMode="contain" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Image source={require('./SearchLogo.png')} style={styles.searchIcon} resizeMode="contain" />
                </TouchableOpacity>
            </View>

            <View style={styles.DrawerAndGPSContainer}>
                <TouchableOpacity style={styles.GPSButton} onPress={handleGPSpress}>
                    <Image source={require('./gpsLogo.png')} style={styles.GPSIcon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toggleSidePanelButton} onPress={handleToggleSidePanel}>
                    <Image source={require('./DrawerLogo.png')} style={styles.DrawerIcon} resizeMode="contain" />
                </TouchableOpacity>
            </View>

            {showSidePanel && (
                <>
                    <TouchableOpacity style={styles.overlay} onPress={handleCloseSidePanel} />
                    <View style={styles.sidePanel}>
                        <Text style={styles.sideHeader}>Account</Text>
                        <Text style={styles.userID}>User ID: {mobile}</Text>
                        <Text style={styles.helpHeader}>Help</Text>
                        <TouchableOpacity style={styles.FAQButton} onPress={handleFAQ}>
                            <Text style={styles.FAQButtonText}>FAQ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.privacyConcernsButton} onPress={handlePrivacyConcerns}>
                            <Text style={styles.privacyButtonText}>Privacy Concerns</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.changePWButton} onPress={handleChangePW}>
                            <Text style={styles.changePWText}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.logoutText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative', // To allow absolute positioning inside the container
    },
    map: {
        ...StyleSheet.absoluteFillObject, // Map covers the whole page
    },
    searchBarContainer: {
        position: 'absolute',
        top: 15,
        left: 20,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
    },
    searchBar: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 100,
        marginRight: 10,
        paddingLeft: 20,
    },
    filterButton: {
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'transparent',
    },
    searchButton: {
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'transparent',
    },
    filterIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
    },
    DrawerAndGPSContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        height: 125,
        width: 65,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#00000000',
        borderRadius: 20,
        borderColor: '#ccc',
    },
    GPSButton: {
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        width: 60,
        height: 60,
        borderColor: '#ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    GPSIcon: {
        top: 5,
        left: 3,
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    toggleSidePanelButton: {
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        top: 5,
        width: 60,
        height: 60,
        borderColor: '#ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    DrawerIcon: {
        top: 5,
        left: 3,
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    sidePanel: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#213948',
        width: 200,
        padding: 3,
        borderRightColor: '#ccc',
    },
    sideHeader: {
        fontSize: 18,
        marginTop: 50,
        marginLeft: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    userID: {
        fontSize: 14,
        marginLeft: 20,
        marginTop: 5,
        color: 'white',
    },
    helpHeader: {
        fontSize: 18,
        marginTop: 50,
        marginLeft: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    privacyConcernsButton: {
        marginTop: 5,
    },
    privacyButtonText: {
        fontSize: 14,
        marginLeft: 20,
        color: 'white',
        textDecorationLine: 'underline',
    },
    FAQButton: {
        marginTop: 5,
    },
    FAQButtonText: {
        fontSize: 14,
        marginLeft: 20,
        color: 'white',
        textDecorationLine: 'underline',
    },
    changePWButton: {
        marginTop: 5,
    },
    changePWText: {
        fontSize: 14,
        marginLeft: 20,
        color: 'white',
        textDecorationLine: 'underline',
    },
    logoutButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: '100%',
    },
    logoutText: {
        fontSize: 18,
        marginLeft: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    },
});

export default Map;
