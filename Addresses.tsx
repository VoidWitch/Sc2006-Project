import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';

interface AddressItemProps {
    address: string;
    onEdit: () => void;
    onDelete: () => void;
}

const AddressItem: React.FC<AddressItemProps> = ({ address, onEdit, onDelete }) => (
    <View style={styles.addressItem}>
        <Text style={styles.addressText}>{address}</Text>
        <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.button}>
            <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        </View>
    </View>
);
 
const SavedAddressesScreen = () => { 
    const [addresses, setAddresses] = useState<string[]>([]); // Explicitly define the type as an array of strings
    const [newAddress, setNewAddress] = useState(''); 
 
    const handleAddAddress = () => { 
        if (newAddress.trim() !== '') { 
        setAddresses([...addresses, newAddress]); 
        setNewAddress(''); 
        } else { 
        Alert.alert('Error', 'Please enter a valid address.'); 
        } 
    }; 
 
    const handleDeleteAddress = (index: number) => { // Explicitly define the type as number
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this address?', [ 
        { text: 'Cancel' }, 
        { 
            text: 'Delete', onPress: () => { 
            const updatedAddresses = addresses.filter((_, i) => i !== index); 
            setAddresses(updatedAddresses); 
            } 
        }, 
        ]); 
    };
 
    const handleEditAddress = (index: number) => { // Explicitly define the type as number
        const addressToEdit = addresses[index]; 
        // For simplicity, we'll just prompt for now. You might want to open a new screen or modal for editing. 
        Alert.prompt( 
        'Edit Address', 
        'Update your address.', 
        [ 
            { text: 'Cancel' }, 
            { 
            text: 'Save', 
            onPress: (text) => {
                const updatedAddresses = [...addresses];
                updatedAddresses[index] = text ?? ''; // Use '' if text is undefined
                setAddresses(updatedAddresses);
            },
            }, 
        ], 
        'plain-text', 
        addressToEdit 
    ); 
};
 
  return ( 
    <View style={styles.container}> 
        <TextInput 
            style={styles.input} 
            placeholder="Add a new address" 
            value={newAddress} 
            onChangeText={setNewAddress} 
        /> 
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}> 
            <Text style={styles.buttonText}>Add Address</Text> 
        </TouchableOpacity> 
        <FlatList 
            data={addresses} 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={({ item, index }) => ( 
            <AddressItem 
                address={item} 
                onEdit={() => handleEditAddress(index)} 
                onDelete={() => handleDeleteAddress(index)} 
            /> 
            )} 
        /> 
    </View> 
    ); 
}; 
 
const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: '#fff', 
    }, 
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        padding: 10, 
        marginBottom: 10, 
    }, 
    addButton: { 
        backgroundColor: 'blue', 
        borderRadius: 5, 
        padding: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 20, 
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
        backgroundColor: 'blue', 
        marginLeft: 5, 
        padding: 5, 
        borderRadius: 5, 
    }, 
    buttonText: { 
        color: '#fff', 
        fontSize: 14, 
    }, 
}); 
 
export default SavedAddressesScreen;