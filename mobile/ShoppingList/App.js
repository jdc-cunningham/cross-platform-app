import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import Header from './components/Header.js';
import ListItem from './components/ListItem.js';
import AddItem from './components/AddItem.js';
import uuid from 'uuid-random';

const App = () => {
    const [items, setItems] = useState([
        {id: uuid(), text: 'Milk'},
        {id: uuid(), text: 'Eggs'},
        {id: uuid(), text: 'Break'},
        {id: uuid(), text: 'Chips'},
    ]);

    const deleteItem = ( itemId ) => {
        console.log('delete', itemId);
        setItems(prevItems => {
            return prevItems.filter(item => item.id !== itemId);
        });
    }

    const addItem = ( itemTitle ) => {
        if (!itemTitle) {
            Alert.alert('Error', 'Please enter an item', [{text: 'Ok'}], {cancelable: true});
            return;
        }

        setItems(prevItems => {
            prevItems.push({
                id: uuid(),
                text: itemTitle
            });
            return prevItems;
        })
    }

    return (
        <View style={styles.container}>
            <Header title="Shopping List" />
            <AddItem addItem={ addItem } />
            <FlatList
                data={ items }
                renderItem={ ({item}) => (
                    <ListItem item={ item } deleteItem={ deleteItem } />
                )}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default App;