import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import Header from './components/Header.js';

const App = () => {
    const subModules = [
        {id: "1",
        name: "notes"},
        {id: "2",
        name: "draw"}
    ];

    const [activeModule, setActiveModule] = useState(""); // still using strings, should enumerate
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const selectModule = ( selectedModule ) => {
        setActiveModule(selectedModule);
    }

    return (
        <View style={ styles.container }>
            <Header
                activeModule={ activeModule }
                selectModule={ selectModule }
                menuOpen={ menuOpen }
                toggleMenu={ toggleMenu }
                subModules={ subModules } />
        </View>
    )
}

const styles = StyleSheet.create({
});

export default App;