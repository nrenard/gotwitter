import React, { Component } from 'react';

import twitterLogo from '../twitter.svg'

import './Login.css'

export default class Login extends Component {

    state = {
        username: ""
    };

    onChangeInput = ({ target }) => {
        this.setState({
            username: target.value
        });
    }

    submitForm = event => {
        event.preventDefault();

        const { username } = this.state;

        if (!username.length) return;

        localStorage.setItem('@GoTwitter:username', username);

        this.props.history.push('/timeline');
    }

    render() {

        const { username } = this.state;

        return (
            <div className="login-wrapper">
                <img src={twitterLogo} alt="GoTwitter" />

                <form onSubmit={this.submitForm}>
                    <input
                        type="text"
                        placeholder="Nome de user"
                        value={username}
                        onChange={this.onChangeInput}
                    />
                    <button type="submit">Entrar</button>
                </form>
            </div>
        );
    }
}
