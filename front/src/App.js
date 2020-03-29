import React from 'react';
import './App.css'
import {BrowserRouter as Router, Route, Switch, Link, Redirect, withRouter} from 'react-router-dom';

import myContext from './context/context';
import {sendHTTP} from './requests';

import Header from './components/Header';
import Contact from './components/Contact';
import SignUp from './components/AuthComponents/SignUp';
import SignIn from './components/AuthComponents/SignIn';
import CreateTest from './components/CreateTest';
import User from './components/User';
import Home from './components/Home';
import TakeTest from './components/TakeTest';
import Footer from './components/Footer';

class App extends React.Component{
    state = {
        token: null,
        userId: null,
        username: null,
        tests: []
    }

    constructor(props){
        super(props);
    }

    componentDidMount = async () => {
        const query = {
            query: `query{tests{_id title desc resources creator{username createdTests{_id} passedTests{_id}} createdAt}}`
        }
        const res = await sendHTTP(query);
        // console.log(res.data.tests);
        this.setState({tests:res.data.tests});
    }

    login = (token, userId, username) => {
        this.setState({
            token: token,
            userId: userId,
            username: username
        });
    }

    logout = () => {
        this.setState({
            token: null,
            userId: null,
            username: null
        });
    }

    render(){
        return(
            <myContext.Provider value={{token: this.state.token, userId: this.state.userId, username: this.state.username, login: this.login, logout: this.logout}}>
                <div className="app">
                    <Router>
                        <Header />
                        <main>
                            <Switch>
                                {this.state.token && <Redirect from="/signin" to="/" exact />}
                                {this.state.token && <Redirect from="/signup" to="/" exact />}
                                {/*!this.state.token && <Redirect from="/createtest" to="/signin" exact />*/}
                                {/*!this.state.token && <Redirect from="/taketest/:id" to="/signin" />*/}
                                <Route path="/" component={() =>
                                    <Home tests={this.state.tests} h1={this.state.tests.length ? 'Most popular tests' : 'There are no tests yet'}
                                />} exact />
                                <Route path="/contact" component={Contact} />
                                <Route path="/signup" component={SignUp} />
                                <Route path="/signin" component={SignIn} />
                                <Route path="/createtest" component={CreateTest} />
                                <Route path="/taketest/:id" component={TakeTest} />
                                <Route path="/user/:id" component={User} />
                            </Switch>
                        </main>
                        <Footer />
                    </Router>
                </div>
            </myContext.Provider>
        )
    }
}

export default App;