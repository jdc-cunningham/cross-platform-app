import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { getPercent } from '../utils/math.js';

const Header = ({ activeModule, selectModule, menuOpen, toggleMenu, subModules }) => {
    return (
        <View style={ styles.column }>
            <View style={ styles.row }>
                <Icon style={ styles.menuIcon } name={ menuOpen ? "chevron-up" : "chevron-down" } size={ getPercent(8) } color="#282828" onPress={ toggleMenu } />
                <View style={ styles.menuTitleWrapper }>
                    <Text style={ styles.menuTitle }>{ activeModule ? activeModule : "Select app" }</Text>
                </View>
            </View>
            <View style={ menuOpen ? styles.subModuleMenu : styles.displayNone }>
                <FlatList
                    data={ subModules }
                    renderItem={ ({ item }) => (
                        <TouchableOpacity style={ styles.subModuleMenuRow } onPress={ () => selectModule(item.name) }>
                            <View key={ item.id } selectModule={ item.name }>
                                <Text style={ styles.subModuleMenuRowTitle }>{ item.name }</Text>
                            </View>
                        </TouchableOpacity>
                    )}/>
            </View>
        </View>
    )
}

Header.defaultProps = {
    title: "Shopping List"
}

const styles = StyleSheet.create({
    displayNone: {
        display: "none"
    },
    column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "black"
    },
    menuIcon: {
        flex: 0,
        padding: 2
    },
    menuTitleWrapper: {
        flex: 1,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: getPercent(1.5),
        paddingRight: getPercent(1.5),
    },
    menuTitle: {
        fontSize: 24
    },
    subModuleMenu: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    subModuleMenuRow: {
        display: "flex",
        flex: 1,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        width: getPercent(100),
        borderBottomWidth: 1,
        borderBottomColor: '#808080'
    },
    subModuleMenuRowTitle: {
        fontSize: 20
    }
});

export default Header;