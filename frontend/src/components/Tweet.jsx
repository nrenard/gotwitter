import React from 'react';

import like from '../like.svg';

import './Tweet.css';

const Tweet = props => {
    const { tweet } = props;

    const permissionRemove = localStorage.getItem('@GoTwitter:username') === tweet.author;

    return (
        <li className="tweet">
            {permissionRemove &&
                <div className="remove-tweet" onClick={props.handleRemoveTweet.bind(null, tweet._id)}>
                </div>
            }
            <strong>{tweet.author}</strong>
            <p>{tweet.content}</p>
            <button type="button" onClick={props.handleLike.bind(null, tweet._id)}>
                <img src={like} alt="Like" />
                {tweet.likes}
            </button>
        </li>
    );
}

export default Tweet;