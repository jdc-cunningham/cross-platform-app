import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Header from './components/Header.js';
import Notes from './modules/notes.js';
import Draw from './modules/draw.js';

const App = () => {
    const subModules = [
        {id: "1",
        name: "notes"},
        {id: "2",
        name: "draw"}
    ];

    const [activeModule, setActiveModule] = useState("notes"); // still using strings, should enumerate
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const selectModule = ( selectedModule ) => {
        setActiveModule(selectedModule);
        toggleMenu();
    }

    const getActiveModule = (() => {
        switch(activeModule) {
            case "notes":
                return <Notes />
            case "draw":
                return <Draw />
            default:
                return <Text style={ styles.defaultModuleText }>No app selected</Text>
        }
    })();

    return (
        <View style={ styles.container }>
            <Header
                activeModule={ activeModule }
                selectModule={ selectModule }
                menuOpen={ menuOpen }
                toggleMenu={ toggleMenu }
                subModules={ subModules } />
            { getActiveModule }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    defaultModuleText: {
        padding: 5,
        fontSize: 18
    }
});

export default App;