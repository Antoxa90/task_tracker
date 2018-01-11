import React from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

class Authorization extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login: '', password: '', auth: true};

        this.onChangeLabel = this.onChangeLabel.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

    }

    onChangeLabel(e) {
        let val = e.target.value;
        this.setState({login: val});
    }

    onChangePassword(e) {
        let val = e.target.value;
        this.setState({password: val});
    }

    handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem('login', '');
        localStorage.setItem('role', '');

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: this.state.login,
                password: this.state.password,
            })
        }).then(data => data.json()).then(res => {
            if(res.message === 'success') {
                localStorage.setItem('login', res.user.login);
                localStorage.setItem('role', res.user.role);
                this.setState({auth: false});
                this.handleLogin();
            }
        });
    }

    handleLogin(e) {
        let auth = this.state.auth;
        this.props.onHandleLogin(auth);
    }


    render() {
        if(this.state.auth) {
            return (
                <div id="authForm">
                    <label>Login: </label>
                    <input type="text" className="form-control" onChange={this.onChangeLabel}
                           placeholder="Enter email"/>
                    <label>Password</label>
                    <input type="password" className="form-control" onChange={this.onChangePassword}
                           placeholder="Enter password"/><br/>

                    <button className="btn btn-default" onClick={this.handleSubmit}>Log in</button>
                    <Link to="/signup"><button className="btn btn-default">Sign up</button></Link>
                </div>
            );
        }
        else {
            return <Redirect to="/" />;
        }
    }
}

module.exports = Authorization;