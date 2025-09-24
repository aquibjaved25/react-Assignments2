import React, { useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { stackScreens } from '../App'; 

const DATA = [
    { id: '1', title: 'Assignment 1' },
    { id: '2', title: 'Assignment 2' },
    { id: '3', title: 'Assignment 3' },
    { id: '4', title: 'Assignment 4' },
    { id: '5', title: 'Assignment 5' },
    { id: '6', title: 'Assignment 6' },
];



type propsType = NativeStackScreenProps<stackScreens, 'Home'>;

type DataType = {
    id: string;
    title: string;
};

const Home = (props:propsType) => {
    const [selectedId, setSelectedId] = useState<string>();
    const selectedList = (item: DataType) => {
        setSelectedId(item.id);
      
        switch(item.id) {
            case '1':
                props.navigation.navigate('Assignment1');
                break;
            case '2':
                props.navigation.navigate('Assignment2');
                break;
            case '3':
                props.navigation.navigate('Assignment3');
                break;
            case '4':
                props.navigation.navigate('Assignment4');
                break;
            case '5':
                props.navigation.navigate('Assignment5');
                break;
            case '6':
                props.navigation.navigate('Assignment6');
                break;
            default:
                break;
        }
    }

    return (
        <FlatList
            data={DATA}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[styles.item, { backgroundColor: item.id === selectedId ? '#6e3b6e' : '#f9c2ff' }]}
                    onPress={() => selectedList(item)}
                >
                    <Text style={[styles.title, { color: item.id === selectedId ? 'white' : 'black' }]}>{item.title}</Text>
                </TouchableOpacity>
            )}
            extraData={selectedId}
            keyExtractor={(item: DataType) => item.id}
        />
    );
};
const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
    },
});

export default Home;