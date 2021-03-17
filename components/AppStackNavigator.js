import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';
import BookDonateScreen from '../screens/BookDonateScreen';

export const appStackNavigator = createStackNavigator({
    bookDonateList : { 
        screen : BookDonateScreen,
        navigationOptions : {
            headerShown : false
        }
    },
    receiverDetails : {
        screen : ReceiverDetailsScreen,
        navigationOptions : {
            headerShown : false
        }
    }
}, {
    initialRouteName : 'bookDonateList'
});