import React, { Component } from 'react';
import api from '../services/api';
import socket from 'socket.io-client';

import twitterLogo from '../twitter.svg';
import './Timeline.css';

import Tweet from '../components/Tweet';

export default class Timeline extends Component {

    state = {
        content: '',
        tweets: []
    };

    componentDidMount() {
        this.subscribeToEvents();
        this.getTweets();
    }

    subscribeToEvents = () => {
        const io = socket('http://localhost:3000');

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

    handleChange = ({ target }) =>
        this.setState({
            content: target.value
        });

    handleContent = async (e) => {
        const { content } = this.state;

        if (e.keyCode === 13 && content.trim() !== "") {
            const author = localStorage.getItem('@GoTwitter:username');


            await api.post('/tweets', {
                author,
                content
            }).then(res => {
                this.setState({
                    content: ""
                });
            })
            .catch(err => console.log(err))
        }
    }

    getTweets = async () => {
        await api.get('/tweets').then(res => {
            this.setState({
                tweets: res.data
            });
        }).catch(err => console.log('err: ', err));
    }

    handleLike = async (id) => {
        await api.post(`/likes/${id}`);
    }

    handleRemoveTweet = async (id) => {
        await api.delete(`/tweets/${id}`);
    }

    render() {

        const { content, tweets } = this.state;

        return (
            <div className="timeline-wrapper">
                <img height={24} src={twitterLogo} alt="twitterLogo"/>

                <form>
                    <textarea
                        onChange={this.handleChange}
                        value={content}
                        onKeyDown={this.handleContent}
                        placeholder="O que esta acontecendo?"
                    />
                </form>

                {tweets.length !== 0 &&
                    <ul className="tweet-list">
                        {tweets.map(tweet =>
                            <Tweet 
                                key={tweet._id} 
                                tweet={tweet} 
                                handleLike={this.handleLike}
                                handleRemoveTweet={this.handleRemoveTweet}
                            />
                        )}
                    </ul>
                }
            </div>
        );
    }
}
