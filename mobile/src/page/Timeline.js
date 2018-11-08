import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import socket from 'socket.io-client';

import api from '../services/api';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from 'react-native';

import Tweet from '../components/Tweet'

export default class Timeline extends Component {

    static navigationOptions = ({ navigation, }) => ({
        title: 'Inicio',
        headerRight: (
            <TouchableOpacity onPress={() => { navigation.navigate('New') }}>
                <Icon
                    style={{ marginRight: 20 }}
                    name="add-circle-outline"
                    size={24}
                    color="#4bb0ee"
                />
            </TouchableOpacity>
        )
    });

    state = {
        tweets: []
    };

    async componentDidMount() {
        const response = await api.get('tweets');

        this.setState({
            tweets: response.data
        });

        this.subscribeToEvents();
    }

    subscribeToEvents = () => {
        const io = socket('http://10.0.2.2:3000');

        io.on('tweet', data => {
            this.setState({
                tweets: [
                    data,
                    ...this.state.tweets,
                ]
            })
        });

        io.on('delete-tweet', data => {
            const tweets = this.state.tweets.filter(tweet => {
                if (tweet._id !== data._id)
                    return tweet
            });

            this.setState({ tweets });
        });

        io.on('like', data => {
            this.setState({
                tweets: this.state.tweets.map(tweet => {
                    if (tweet._id === data._id)
                        return data;

                    return tweet
                })
            })
        });
    }

    handleLike = async (id) => {
        await api.post(`/likes/${id}`);
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.tweets}
                    keyExtractor={tweet => tweet._id}
                    renderItem={({ item }) => <Tweet tweet={item} handleLike={this.handleLike} />}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    }
});
