import { Dimensions } from 'react-native';

// this is mutable in case the device rotates
let deviceWindow = Dimensions.get('window');
let deviceWidth = deviceWindow.width;
let deviceHeight = deviceWindow.height;

// these are used to specify a dimension by percent(most likely the case for me)
export const getPercent = (desiredPercentage) => {
    return (deviceWidth * (desiredPercentage * (1/100)));
}