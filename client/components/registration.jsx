import React from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

class Registration extends React.Component {
    constructor(props) {
        super(props);

        this.state = {regist: false};

        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.onChangeLastname = this.onChangeLastname.bind(this);
        this.onChangeRole = this.onChangeRole.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    onChangeLogin(e) {
        this.setState({login: e.target.value});
    }

    onChangePassword(e) {
        this.setState({password: e.target.value});
    }

    onChangeName(e) {
        this.setState({name: e.target.value});
    }

    onChangeSurname(e) {
        this.setState({surname: e.target.value});
    }

    onChangeLastname(e) {
        this.setState({lastname: e.target.value});
    }

    onChangeRole(e) {
        this.setState({role: e.target.value});
    }

    signUp() {
        let object = {
            login: this.state.login,
            password: this.state.password,
            name: this.state.name,
            surname: this.state.surname,
            lastname: this.state.lastname,
            role: this.state.role
        };

        fetch('/api/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(data => data.json()).then(res => {
            this.setState({regist: true});
        });
    }

    render(){
        if(!this.state.regist) {
            return (
                <div className="registration">
                    <label>Login:</label>
                    <input type="text" className="form-control" onChange={this.onChangeLogin}
                           placeholder="Enter login"/>
                    <label>Password:</label>
                    <input type="password" className="form-control" onChange={this.onChangePassword}
                           placeholder="Enter password"/>
                    <label>Name:</label>
                    <input type="text" className="form-control" onChange={this.onChangeName} placeholder="Enter name"/>
                    <label>Surname:</label>
                    <input type="text" className="form-control" onChange={this.onChangeSurname}
                           placeholder="Enter surname"/>
                    <label>Lastname:</label>
                    <input type="text" className="form-control" onChange={this.onChangeLastname}
                           placeholder="Enter lastname"/>
                    <label>Role:</label>
                    <select className="form-control" onChange={this.onChangeRole}>
                        <option value="null">Select role</option>
                        <option value="manager">Manager</option>
                        <option value="developer">Developer</option>
                    </select>

                    <button className="btn btn-default" onClick={this.signUp}>Sign up</button>
                </div>
            );
        } else
            return <Redirect to="/login" />
    }
}

module.exports = Registration;