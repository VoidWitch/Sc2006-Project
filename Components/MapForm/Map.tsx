import React, { useState, useEffect, useRef } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {regMobile} from '../LoginForm/Login';
import { StackNavigationProp } from '@react-navigation/stack';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { homeCoordinates } from '../AddressesForm/Addresses';
import MapViewDirections from 'react-native-maps-directions';



type RootStackParamList = {
    'FAQ': undefined;
    'Privacy Concerns': undefined;
    'Change Password' : undefined;
    'Login' : undefined;
    'Saved Addresses' : undefined;
};

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
    navigation: ScreenNavigationProp;
}

export let shelterFilter = false;
export let seeLotCounter = 0;

const GPSMap = ({navigation}:Props) => {

    const mapViewRef = useRef<MapView>(null);

    // RETURN DISTANCES BETWEEN COORDS
    const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
    };
      
    const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
    };
    
    // MAP REGION DETAILS
    const [region, setRegion] = useState({      // DEFAULT RENDER
        latitude: 1.3521,
        longitude: 103.8198,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });
    const [userCoordinates, setUserCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [locationCoordinates, setLocationCoordinates] = useState<{ latitude: number; longitude: number }>();

    useEffect(() => {
        console.log('Selected Location Coordinates Updated:', locationCoordinates);  // SHOW SELECTED LOCATION COORDS
    }, [locationCoordinates]);

    useEffect(() => {
        getLocation();      // SHOW INITIAL USER LOCATION WHEN MOUNTING
        return () => {
            Geolocation.clearWatch(watchID);        // CLEAN UP WHEN COMPONENT UNMOUNTS
        };
    }, []);

    let watchID: number;
    /*
    const [markers, setMarkers] = useState([
        
      ]);*/

    const [searchCoordinates, setSearchCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });

    const [parkingCoords1, setParkingCoords1] = useState({
        latitude: 0,
        longitude: 0,
    });
    useEffect(() => {
        console.log('Parking coords 1: ', parkingCoords1);
    }, [parkingCoords1]);

    const [parkingCoords2, setParkingCoords2] = useState({
        latitude: 0,
        longitude: 0,
    });
    useEffect(() => {
        console.log('Parking coords 2: ', parkingCoords2);
    }, [parkingCoords2]);

    const [parkingCoords3, setParkingCoords3] = useState({
        latitude: 0,
        longitude: 0,
    });
    useEffect(() => {
        console.log('Parking coords 3: ', parkingCoords3);
    }, [parkingCoords3]);

    const [parkingCoords4, setParkingCoords4] = useState({
        latitude: 0,
        longitude: 0,
    });
    useEffect(() => {
        console.log('Parking coords 4: ', parkingCoords4);
    }, [parkingCoords4]);

    const [parkingCoords5, setParkingCoords5] = useState({
        latitude: 0,
        longitude: 0,
    });
    useEffect(() => {
        console.log('Parking coords 5: ', parkingCoords5);
    }, [parkingCoords5]);

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setRegion({
                    ...region,
                    latitude,
                    longitude,
                });
                setUserCoordinates({    // GET USER COORDINATES TO USE IN APP
                    ...userCoordinates,
                    latitude,
                    longitude,
                });
            },
            (error) => console.log('Error. Unable to getLocation() of user.'),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        watchID = Geolocation.watchPosition(         // IRL LOCATION UPDATE
            (position) => {
                const { latitude, longitude } = position.coords;
                setRegion({
                    ...region,
                    latitude,
                    longitude,            
                });
            },
            (error) => console.log('Error. Unable to get live location updates.'),
        );
    };


    // SIDE PANEL CONTROLS
    const [showSidePanel, setShowSidePanel] = useState(false);
    const handleToggleSidePanel = () => {
        setShowSidePanel(!showSidePanel);
    };
    const handleCloseSidePanel = () => {
        setShowSidePanel(false);
    };


    // FILTER CONTROLS
    const [shelter, setShelterFilter] = useState(false);    // DEFAULT FALSE
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    useEffect(() => {
        console.log('Shelter bool: ', shelter);
    }, [shelter]);

    const toggleFilterDropdown = () => {
        setFilterDropdownVisible(!filterDropdownVisible);
    };

    const handleShelterFilter = () => {
        setShelterFilter(!shelter);
        // JUST IMPORT {SHELTERFILTER} FROM THIS COMPONENT
        shelterFilter = shelter;    // UPDATE SHELTER FILTER TO EXPORT TO OTHER COMPONENTS
    };


    const searchLots = async (lat: number, lon: number) => {
    // Constants and API
        const apiUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2';
        const accKey = 'xvBW6rA6TyGTNQlS8tK0Vg=='
        const shelterIndicator = "placeholder"; //to be fixed later
      
        const params = new URLSearchParams({
            Lat: lat,
            Long: lon,
            Dist: '1',      // Default radius in kilometers. Can change if needed.
        });
      

    // Implementation logic for bicycle lot search
        try {
            const response = await fetch(apiUrl + "?" + params.toString(), {
                headers: {
                    'AccountKey': accKey
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Await the resolution of the JSON promise
            const searchJSON = await response.json();

            // If shelterFilter is false, return all the parking lots
            if (!shelter) {
                return searchJSON;
            } else {
                // Filter searchJSON and only return parking lots that have attribute "ShelterIndicator": "Y"
                const filteredLots = searchJSON.value.filter((parkingLot: { ShelterIndicator: string; }) => parkingLot.ShelterIndicator === "Y");
                return { "odata.metadata": searchJSON["odata.metadata"], "value": filteredLots };
            }
        } catch (err) {
            // Handle errors
            console.error(err);
            throw err;
        }
    }

    // BICYCLE LOT IMPLEMENTATIONS
    const handleSearch = async () => {
        setDestinationBikeCoordinates({
            latitude: 0,
            longitude: 0,
        });
        seeLotCounter = 0;
        console.log('Handle search function executing...');
        const latitude = locationCoordinates?.latitude || 0;
        const longitude = locationCoordinates?.longitude || 0;
        setSearchCoordinates({ latitude, longitude });

        const finalJSON = await searchLots(latitude, longitude);       // SEARCHING BICYCLE LOTS
            console.log('Search lots function within handle search executing...');
            // UP TILL HERE THE FINAL JSON FILE IS CORRECT FOR BOTH SHELTER FILTER TYPES
            var disVal: any[] = [];
            // console.log(finalJSON);

            // ITERATES THROUGH ALL VALUES, CALCULATES THE DISTANCE TO LOCATION, AND STORES IT IN ARRAY
            for (var i in finalJSON.value) {
                var pointLat = finalJSON.value[i]["Latitude"];
                var pointLon = finalJSON.value[i]["Longitude"];
                disVal[disVal.length] = getDistanceFromLatLonInKm(latitude, longitude, pointLat, pointLon);
            }


            console.log('disval:', disVal);
            var indices = [...disVal.keys()]
            .sort((a, b) => disVal[a] - disVal[b])
            .slice(0, 5);

            for (var i in indices) {
                const latitude = finalJSON.value[indices[i]]["Latitude"];
                const longitude = finalJSON.value[indices[i]]["Longitude"];

                // console.log(pointLat, pointLon);

                if (i === "0") {
                    setParkingCoords1({ latitude, longitude });
                } else if (i === "1") {
                    setParkingCoords2({ latitude, longitude });
                } else if (i === "2") {
                    setParkingCoords3({ latitude, longitude });
                } else if (i === "3") {
                    setParkingCoords4({ latitude, longitude });
                } else if (i === "4") {
                    setParkingCoords5({ latitude, longitude });
                }
            }
        seeLotCounter = 5;
    };

    // const lotDirections = async (parkingCoords: { latitude: any, longitude: any; }) => {

    // };




    const [selectedLot, setSelectedLot] = useState(null); // State to store the selected parking lot
    const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
    const openModal = (parkingLot: any) => {
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
    };
    const ParkingLotDetails = ({ modalVisible, closeModal, parkingLot }: { modalVisible: boolean; closeModal: () => void; parkingLot: any }) => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {parkingLot && (
                            <View>
                                <Text style={styles.lotName}>{parkingLot.Description}</Text>
                                <Text>Rack Count: {parkingLot.RackCount}</Text>
                                <Text style={styles.shelterIndicatorText}>Shelter Indicator: {parkingLot.ShelterIndicator}</Text>
                            </View>
                        )}
                        <View style={styles.bottomContainer}>
                            {/* <TouchableOpacity style={styles.lotDirections} onPress={lotDirections(parkingLot.latitude, parkingLot.longitude)}>
                                <Text style={styles.closeModalText}>Directions</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
                                <Text style={styles.closeModalText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
        </Modal>
    );
    
    const [destinationBikeCoordinates, setDestinationBikeCoordinates] = useState({
        latitude: 0,
        longitude: 0,
    });
    useEffect(() => {
        console.log('Destination bike coords updated to: ', destinationBikeCoordinates);
    }, [destinationBikeCoordinates]);

    const displayLots = async (parkingCoords: { latitude: any; longitude: any; }) => {
        // Implementation logic for displaylot details
        setDestinationBikeCoordinates(parkingCoords);
        const apiUrl = 'http://datamall2.mytransport.sg/ltaodataservice/BicycleParkingv2';
        const accKey = 'xvBW6rA6TyGTNQlS8tK0Vg==';

        const params = new URLSearchParams({
            Lat: parkingCoords.latitude,
            Long: parkingCoords.longitude,
            Dist: '10',      // Default radius in kilometers. Can change if needed.
        });

        try {
            // Fetch parking lot data from the LTA API
            const response = await fetch(apiUrl + "?" + params.toString(), {
                headers: {
                  'AccountKey' : accKey
                }
              });

            if (!response.ok) {
                throw new Error('Failed to fetch parking lot data');
            } 

            const parkingLotData = await response.json();

            // Extract the parking lot values
            const parkingLots = parkingLotData.value;
            
            // find the parking lot value from parkingLots for the one with matching coordinate of parkingCoords passed in
             // Find the parking lot with coordinates matching parkingCoords
            const selectedParkingLot = parkingLots.find((parkingLot: { Latitude: any; Longitude: any; }) => (
                parkingLot.Latitude === parkingCoords.latitude && parkingLot.Longitude === parkingCoords.longitude
            ));

            if (selectedParkingLot) {
                // Display the selected parking lot
                console.log('Selected Parking Lot:', selectedParkingLot);
                setSelectedLot(selectedParkingLot);
                openModal(selectedLot);
                // Add frontend logic here to display the selected parking lot in your UI (its in the marker onpress)
            } else {
                console.log('No matching parking lot found for the given coordinates.');
            }

        } catch (error) {
            console.error('Error:', error);
            // Handle errors (e.g., display an error message to the user)
        }
    };

    const seeMoreLots = async () => {
        setDestinationBikeCoordinates({
            latitude: 0,
            longitude: 0,
        });
        try {
            // Get specified location coordinates
            const latitude = locationCoordinates?.latitude || 0;
            const longitude = locationCoordinates?.longitude || 0;
            setSearchCoordinates({ latitude, longitude });
    
            // Fetch nearby parking lot data from the API
            const searchJSON = await searchLots(latitude, longitude);
    
            // Calculate distances for all lots and store them in an array
            const disVal = searchJSON.value.map((lot: { Latitude: number; Longitude: number; }) => (
                getDistanceFromLatLonInKm(latitude, longitude, lot.Latitude, lot.Longitude)
            ));
    
            // Sort distances and get the indices of the next 5 nearest lots
            const sortedIndices = disVal.map((val: any, index: number) => ({ index, val }))
                .sort((a: { val: number; }, b: { val: number; }) => a.val - b.val)
                .map(({ index }: { index: number }) => index)
                .slice(seeLotCounter, seeLotCounter+5);
    
    
            // Iterate over the indices of the next 5 nearest lots
            for (let i: number = 0; i < sortedIndices.length; i++) {
                const latitude = searchJSON.value[sortedIndices[i]]["Latitude"];
                const longitude = searchJSON.value[sortedIndices[i]]["Longitude"];
    
                // console.log(pointLat, pointLon);
    
                if (i === 0) {
                    setParkingCoords1({ latitude, longitude });
                } else if (i === 1) {
                    setParkingCoords2({ latitude, longitude });
                } else if (i === 2) {
                    setParkingCoords3({ latitude, longitude });
                } else if (i === 3) {
                    setParkingCoords4({ latitude, longitude });
                } else if (i === 4) {
                    setParkingCoords5({ latitude, longitude });
                }
            }
    
        } catch (error) {
            console.error('Error fetching parking lot data:', error);
            // Handle errors (e.g., display an error message to the user)
        }
        seeLotCounter += 5;
    };
    
    const handleHomeAddress = () => {
        // // UPLOAD SELECTED LOCATION WITH HOME COORDINATES
        console.log('Home coordinates:', {homeCoordinates});
        console.log('Imported Home Coords: ', {homeCoordinates}, 'Location (not the same at first): ', locationCoordinates); 
        if (!{homeCoordinates}){
            Alert.alert('No home set.')
        }
        else{   // THIS WILL SET THE HOME COORDINATES IMMEDIATELY TO SELECTED LOCATION COORDINATES
            if (homeCoordinates) {
                const { latitude, longitude } = homeCoordinates;
                console.log('Extracted Latitude, Longitude from Home coords:', latitude, longitude);
                setLocationCoordinates({latitude, longitude});  
                console.log('Imported Home Coords: ', {homeCoordinates}, 'Location (should be same)): ', locationCoordinates);   
            } else {
                console.log('Home coordinates are null or undefined.');
            }
        }
    }


    // NAVIGATION IMPLEMENTATIONS
    const handleFAQ = () => {
        navigation.navigate('FAQ');
    };

    const handlePrivacyConcerns = () => {
        navigation.navigate('Privacy Concerns');
    };

    const handleChangePW = () => {
        navigation.navigate('Change Password');
    };

    const handleSavedAddress = () => {
        navigation.navigate('Saved Addresses');
    }

    const handleLogout = () => {
        navigation.replace('Login');
    };


//  AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY   -- Google Maps API key
    return (
        <View style={styles.container}>
            <MapView
                ref={mapViewRef}
                style={styles.map}
                region={region}
                showsUserLocation={true}
                followsUserLocation={true}      
            >
                {               
                    <Marker
                    coordinate={searchCoordinates}
                    title="Search Location"
                    pinColor="red"
                    />
                }
                <MapViewDirections

                    apikey="AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY"
                    { ...(destinationBikeCoordinates.latitude && destinationBikeCoordinates.longitude) && {
                        origin: userCoordinates,
                        destination: destinationBikeCoordinates,
                        mode: "BICYCLING",
                        strokeColor: '#48c289',
                        strokeWidth: 5,
                        apikey: "AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY"
                    }}
                />
                {
                    <Marker
                    coordinate={parkingCoords1}
                    title="Bike Parking 1"
                    pinColor="blue"
                    onPress={() => displayLots(parkingCoords1)}     // DISPLAY LOT DETAILS
                    />
                }
                {
                    <Marker
                    coordinate={parkingCoords2}
                    title="Bike Parking 2"
                    pinColor="blue"
                    onPress={() => displayLots(parkingCoords2)}
                    />
                }
                {
                    <Marker
                    coordinate={parkingCoords3}
                    title="Bike Parking 3"
                    pinColor="blue"
                    onPress={() => displayLots(parkingCoords3)}
                    />
                }
                {
                    <Marker
                    coordinate={parkingCoords4}
                    title="Bike Parking 4"
                    pinColor="blue"
                    onPress={() => displayLots(parkingCoords4)}
                    />
                }
                {
                    <Marker
                    coordinate={parkingCoords5}
                    title="Bike Parking 5"
                    pinColor="blue"
                    onPress={() => displayLots(parkingCoords5)}
                    />
                }
            </MapView>
            <ParkingLotDetails
                modalVisible={modalVisible}
                closeModal={closeModal}
                parkingLot={selectedLot}
            />

            {/* SEARCH BAR, FILTER BUTTON, SEARCH BUTTON */}
            {/* ALLOWS USER TO SEARCH AND SELECT A LOCATION, LOCATION COORDS UPDATED IN const(locationCoordinates) */}
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    placeholder="Search..."
                    onPress={(data, details = null) => {
                        if (details) {
                            const { lat, lng } = details.geometry.location as { lat: number; lng: number };
                            // console.log('Selected Location Coordinates:', lat, lng);
                            setLocationCoordinates({ latitude: lat, longitude: lng });
                        }
                    }}
                    query={{
                        key: 'AIzaSyDlRXMUhwmnCmDXpntaFkL66-vI6cMxWrY',
                        language: 'en',
                    }}
                    styles={{
                        listView: {
                            position: 'absolute',
                            top: 40,
                            backgroundColor: 'white',
                            zIndex: 1, // DROPDOWN APPEARS BEFORE MAP
                        },
                    }}
                    fetchDetails={true}
                />

                <TouchableOpacity style={styles.filterButton} onPress={toggleFilterDropdown}>
                    <Image source={require('./FilterLogo.png')} style={styles.filterIcon} resizeMode="contain" />
                </TouchableOpacity>
                {filterDropdownVisible && (
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.checkboxText}>Shelter</Text>
                        <TouchableOpacity style={[styles.checkbox, shelter && styles.filterChecked]} onPress={handleShelterFilter}>
                        </TouchableOpacity>
                    </View>
                )}
                {/* SEARCH BUTTON */}
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Image source={require('./SearchLogo.png')} style={styles.searchIcon} resizeMode="contain" />
                </TouchableOpacity>
            </View>

            
            {/* SIDE PANEL */}
            <View style={styles.DrawerContainer}>
                <TouchableOpacity style={styles.toggleSidePanelButton} onPress={handleToggleSidePanel}>
                    <Image source={require('./DrawerLogo.png')} style={styles.DrawerIcon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.HomeButton} onPress={handleHomeAddress}>
                    <Image source={require('./HomeLogo.png')} style={styles.HomeIcon} resizeMode="contain" />
                </TouchableOpacity>
            </View>
            {showSidePanel && (
                <>
                    <TouchableOpacity style={styles.overlay} onPress={handleCloseSidePanel} />
                    <View style={styles.sidePanel}>
                        <Text style={styles.sideHeader}>Account</Text>
                        <Text style={styles.userID}>User ID: {regMobile}</Text>
                        <Text style={styles.helpHeader}>Help</Text>
                        <TouchableOpacity style={styles.FAQButton} onPress={handleFAQ}>
                            <Text style={styles.panelText}>FAQ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.privacyConcernsButton} onPress={handlePrivacyConcerns}>
                            <Text style={styles.panelText}>Privacy Concerns</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.changePWButton} onPress={handleChangePW}>
                            <Text style={styles.panelText}>Change Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.savedAddressesButton} onPress={handleSavedAddress}>
                            <Text style={styles.panelText}>Saved Addresses</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Text style={styles.panelText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

        <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={styles.seeMoreLotsButton} onPress={seeMoreLots}>
                <Text style={styles.seeMoreLotsButtonText}>See More Lots</Text>
            </TouchableOpacity>
        </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        position: 'absolute',
        top: 280,
        width: '70%',
        left: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#48c289',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    lotName: {
        textAlign: 'left',
        fontWeight: 'bold',
    },
    shelterIndicatorText: {
        textAlign: 'left',
    },
    bottomContainer: {
        marginTop: 10, // Adjust as needed
        alignItems: 'center',
    },
    lotDirections: {
        width: '80%',
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    closeModalButton: {
        width: '80%',
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    closeModalText: {
        alignSelf: 'center',
        color: 'black',
    },
    searchContainer: {
        position: 'absolute',
        width: '88%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingVertical: 10,
        backgroundColor: 'transparent', 
    },
    searchBar: {
        height: 38,
        width: '88%',
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    filterButton: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    filterIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
    },
    dropdownContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'space-evenly',
        right: 20,
        height: 40,
        width: 100,
        top: 55,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 3,
        zIndex: 1,
    },
    checkboxText: {
        paddingTop: 10,
        fontSize: 16,
    },
    checkbox: {
        top: 10,
        borderColor: 'black',
        borderWidth: 1,
        height: 20,
        width: 20,
        backgroundColor: 'white',
    },
    filterChecked: {
        backgroundColor: '#48c289',
    },
    searchButton: { 
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
    },
    DrawerContainer: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        height: 130,
        width: 65,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#00000000',
        borderRadius: 20,
        borderColor: '#ccc',
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
    HomeButton: {
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
        width: 35,
        height: 35,
        tintColor: '#000',
    },
    HomeIcon: {
        top: 5,
        left: 3,
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    sidePanel: {
        zIndex: 2,
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
    FAQButton: {
        marginTop: 5,
    },
    changePWButton: {
        marginTop: 5,
    },
    savedAddressesButton:{
        marginTop: 5,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: '100%',
    },
    panelText: {
        fontSize: 14,
        marginLeft: 20,
        color: 'white',
        textDecorationLine: 'underline',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    seeMoreLotsButton: {
        backgroundColor: '#48c289',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    seeMoreLotsButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GPSMap;
