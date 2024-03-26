//  AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY   -- Google Maps API key

import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { mobile } from './../LoginForm/Login';

const Map = () => {
    const [showSidePanel, setShowSidePanel] = useState(false);

    const handleToggleSidePanel = () => {
        setShowSidePanel(!showSidePanel);
    };

    const handleSearch = () => {
        //implementation logic for bicycle search
        //get user input location -> convert to coordinates and compare with bicycle lots
    };

    const filterSearch = () => {
        //implementation logic for filter
        //get user input and then filter for number of lots to search then display
    };

    const displayLots = () => {
        //implementation logic for display
        //after retrieving nearest 5, display on gmaps
    };

    const seeMoreLots = () => {
        //implementation logic to get next 5 lots
        //call display lots function to display them
    };

    const handleCloseSidePanel = () => {
        setShowSidePanel(false);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                latitude: 1.3521,
                longitude: 103.8198,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }}/>
            <View style={styles.searchBarContainer}>
                <TextInput
                style={styles.searchBar}
                placeholder="Search location"/>

                {/* need to implement dropdown for filter */}
                <TouchableOpacity style={styles.filterButton} onPress={filterSearch}>
                    <Image source={require('./FilterLogo.png')} style={styles.filterIcon} resizeMode="contain"/>
                </TouchableOpacity>
        
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Image source={require('./SearchLogo.png')} style={styles.searchIcon} resizeMode="contain"/>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.toggleSidePanelButton} onPress={handleToggleSidePanel}>
                <Image source={require('./DrawerLogo.png')} style={styles.DrawerIcon} resizeMode="contain"/>
            </TouchableOpacity>

            {showSidePanel && (
                <>
                <TouchableOpacity style={styles.overlay} onPress={handleCloseSidePanel} />
                <View style={styles.sidePanel}>
                    <Text style={styles.sideHeader}>Account</Text>
                    <Text style={styles.userID}>User ID: {mobile}</Text>
                    <TouchableOpacity style={styles.helpItem}>
                        <Text style={styles.sideText}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingsItem}>
                        <Text style={styles.sideText}>Settings</Text>
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
    toggleSidePanelButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 40,
        left: 10,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    DrawerIcon: {
        width: 30,
        height: 30,
        tintColor: '#000',
        paddingTop: 55,
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
    helpItem: {
        marginLeft: 20,
        paddingVertical: 50,
    },
    settingsItem: {
        marginLeft: 20,
        paddingTop: 50,
    },
    sideText: {
        // textDecorationLine: 'underline',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black overlay
    },
});

export default Map;
