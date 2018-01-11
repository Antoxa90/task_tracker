import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import Home from './components/home.jsx';
import NotFound from './components/notfound.jsx';
import Authorization from './components/authorization.jsx';
import Logout from './components/logout.jsx';
import Projects from './components/projects.jsx';
import Tasks from './components/tasks.jsx';
import Onetask from './components/onetask.jsx';
import Search from './components/search.jsx';
import Registration from './components/registration.jsx';

import '../public/css/style.css';
import '../public/css/bootstrap.min.css';

class Main extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            auth: localStorage.getItem('login') === ''
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.WrapperAuthorization = this.WrapperAuthorization.bind(this);
        this.WrapperLogout = this.WrapperLogout.bind(this);
    }

    handleLogin(value) {
        this.setState({auth: value});
    }

    renderRouteLink() {
        if(this.state.auth) {
            return (
                <div id="header">
                    <Redirect to="/login" />
                </div>
            );
        } else {
            return (
                <div id="header">
                    <Link to="/">Main</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/logout">Logout</Link>
                    <Link to="/search">Search</Link>
                </div>
            );
        }
    }

    WrapperAuthorization(props) {
        return (<Authorization {...props} onHandleLogin={this.handleLogin} />);
    }

    WrapperLogout(props) {
        return (<Logout {...props} onHandleLogin={this.handleLogin} />);
    }

    renderSwitchRoute() {
        if(this.state.auth) {
            return (
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={this.WrapperAuthorization} />
                    <Route path="/signup" component={Registration} />
                    <Route component={NotFound} />
                </Switch>
            );
        } else {
            return (
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/projects" component={Projects} />
                    <Route path="/tasks/:project/:task" component={Onetask} />
                    <Route path="/tasks/:project" component={Tasks} />
                    <Route path="/logout" component={this.WrapperLogout} />
                    <Route path="/search" component={Search} />
                    <Route component={NotFound} />
                </Switch>
            );
        }
    }

    render() {
        return (
            <Router>
                <div>
                    {this.renderRouteLink()}
                    {this.renderSwitchRoute()}
                </div>
            </Router>
        )
    }
}


ReactDOM.render(
    <Main />,
    document.getElementById("app")
);