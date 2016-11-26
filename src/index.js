/**
 * Created by ggoma on 2016. 11. 25..
 */
import Exponent from 'exponent';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import DigitalMagazine from './components/digital-magazine';

export default class App extends React.Component {


    state = {
        appIsReady: false,
    }

    async componentWillMount() {
        try {
            await Exponent.Font.loadAsync({cursive: require('../assets/dancingscript.ttf')});
            this.setState({appIsReady: true});
        } catch(e) {
            // console.warn(
            //     'There was an error caching assets (see: main.js), perhaps due to a ' +
            //     'network timeout, so we skipped caching. Reload the app to try again.'
            // );
            // console.log(e.message);
        }
    }



    render() {
        if (!this.state.appIsReady) {
            return (
                <Exponent.Components.AppLoading />
            );
        }

        return (
            <View style={styles.container}>
                <DigitalMagazine
                    images={[require('./img/page1.jpg'), require('./img/page2.jpg'), require('./img/page3.jpg')]}
                    items={
                    [
                        {page: 0, color: '#ca2214', publisher:'ANIMELDELSE',
                        highlight: 'SICARIO',
                        title: ', OUTSTANDING WORK FROM EMILY BLUNT AND BENICIO DEL TORO', author: 'Af Thomas Tanggaard'},
                        {page: 1, color: '#3db3db', publisher:'NYHED',
                        title: "BEVERYLY HILLS' BRANDON HAR HOVEDROLLEN I NY KRIMIKOMEDIE", author: 'Af Thomas Tanggaard'},
                        {page: 2, color: '#ca2214', publisher:'ANIMELDELSE',
                        highlight: 'STRANGER THINGS\n',
                        title: 'WHEN IS SEASON 2 COMING OUT PLEASE COME OUT ALREADY', author: 'Af Thomas Tanggaard'},
                    ]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});