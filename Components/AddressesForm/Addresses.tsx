import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface AddressItemProps {
    address: string;
    coordinates: { latitude: number; longitude: number };
    onEdit: () => void;
    onDelete: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({ address, coordinates, onEdit, onDelete }) => (
    <View style={styles.addressItem}>
        <Text style={styles.addressText}>{address}</Text>
        <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onEdit} style={styles.button}>
                <Text style={styles.buttonText}>Set as Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.button}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export let homeCoordinates: { latitude: number, longitude: number } | null = null;

const SavedAddressesScreen = () => {
    const [addresses, setAddresses] = useState<{ address: string; coordinates: { latitude: number; longitude: number } }[]>([]);
    const [homeAddress, setHomeAddress] = useState<string | null>(null);

    const handleAddAddress = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
        if (details) {
            const { description } = data;
            const { geometry } = details;
            const { lat, lng } = geometry.location;

            const newAddress = {
                address: description,
                coordinates: {
                    latitude: lat,
                    longitude: lng,
                },
            };

            setAddresses(prevAddresses => [...prevAddresses, newAddress]);
        }
    };

    const handleDeleteAddress = (index: number) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this address?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                onPress: () => {
                    const updatedAddresses = [...addresses];
                    updatedAddresses.splice(index, 1);
                    setAddresses(updatedAddresses);
                },
            },
        ]);
        console.log('Deleted entry: ', homeCoordinates);
    };

    const handleSetHome = async (address: string, coordinates: { latitude: number; longitude: number }) => {
        homeCoordinates = coordinates;
        setHomeAddress(address);
        Alert.alert('Success', 'Location set as home.');
        console.log('Home Location set at: ', homeAddress, homeCoordinates);

        // Save homeAddress to AsyncStorage
        try {
            await AsyncStorage.setItem('homeAddress', address);
        } catch (error) {
            console.error('Error saving homeAddress:', error);
        }
    };

    useEffect(() => {
        // Load saved homeAddress from AsyncStorage when the component mounts
        const loadHomeAddress = async () => {
            try {
                const savedHomeAddress = await AsyncStorage.getItem('homeAddress');
                if (savedHomeAddress) {
                    setHomeAddress(savedHomeAddress);
                }
            } catch (error) {
                console.error('Error loading homeAddress:', error);
            }
        };
        loadHomeAddress();
    }, []);


    useEffect(() => {
        console.log('Use effect location set at: (should be undefined at the start of component mount)', homeAddress, homeCoordinates);
    }, [homeAddress, homeCoordinates]);
    
    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder="Search for an address"
                onPress={(data, details = null) => {
                    handleAddAddress(data, details);
                }}
                query={{
                    key: 'AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY',
                    language: 'en',
                }}
                styles={{
                    listView: {
                        position: 'absolute',
                        top: 70,
                        backgroundColor: 'white',
                        zIndex: 1,
                    },
                }}
                fetchDetails={true}
            />
            <FlatList
                data={addresses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <AddressItem
                        address={item.address}
                        coordinates={item.coordinates}
                        onEdit={() => handleSetHome(item.address, item.coordinates)}
                        onDelete={() => handleDeleteAddress(index)}
                    />
                )}
            />
            {homeAddress && (
                <Text style={styles.homeText}>
                    Home: {homeAddress}
                </Text>
            )}
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    addressItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addressText: {
        flex: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#48c289',
        marginLeft: 5,
        padding: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    homeText: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default SavedAddressesScreen;
