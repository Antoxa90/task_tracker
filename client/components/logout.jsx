import React from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

class Logout extends React.Component {
    constructor(props){
        super(props);
        fetch('/logout').then(data => {
           localStorage.setItem('login', '');
           localStorage.setItem('role', '');
        });
    }

    handleLogin(e) {
        this.props.onHandleLogin(true);
    }

    render() {
        this.handleLogin();
        return <Redirect to="/" />;
    }
}

module.exports = Logout;