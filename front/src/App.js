import React from 'react';
import './App.css'
import {Router} from 'react-router';
import {Route, Switch, Redirect} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

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
import TestBox from './components/TestBox';

let history = createHistory();

class App extends React.Component{
    state = {
        token: null,
        userId: null,
        username: null,
        test: null,
        tests: []
    }

    componentDidMount = async () => {
        this.loadTests();
    }

    loadTests = async () => {
        const query = {
            query: `query{tests{_id title desc resources creator{username createdTests{_id} passedTests{_id}} createdAt}}`
        }

        const res = await sendHTTP(query);
        if(res === undefined || res === null)
            return;
        if(res.data.tests !== undefined)
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

    showSearch = e => {
        // if user is viewing single test
        // everything with data-id == dialog will make dialog disappear
        const id = e.target.getAttribute('data-id');
        if(id === 'dialog'){
            this.setState({test: null});
            return;
        }

        // if user clicked on search
        if(id === 'search'){
            // if this is true then it means we did click on search
            const searchResult = document.querySelector('#search');
            searchResult.style.display = 'block';
        } else {
            const searchResult = document.querySelector('#search');
            searchResult.style.display = 'none';
        }
    }

    // this method gets called when someone clicks on test in search - then it fetches test and updates state 
    // displaying test over page
    showTest = async _id => {
        const query = {
            query: `query{test(_id:"${_id}"){_id title desc resources creator{username createdTests{_id} passedTests{_id}} createdAt}}`
        }

        const res = await sendHTTP(query);
        if(res === undefined || res === null)
            return;
        if(res.data.test !== undefined)
            this.setState({test: res.data.test});
    }

    render(){
        const test = this.state.test;
        return(
            <myContext.Provider value={{
                token: this.state.token, userId: this.state.userId, username: this.state.username, history: history,
                login: this.login, logout: this.logout, showTest: this.showTest, loadTests: this.loadTests
            }}>
                <div className="app" onClick={e => this.showSearch(e)}>
                    <Router history={history}>
                        {
                            // test dialog
                            this.state.test &&
                            <div className="dialog-wrapper" data-id="dialog">
                                <div className="dialog-second-wrapper" data-id="dialog">
                                    <div className="dialog-flex" data-id="dialog">
                                        <TestBox key={test._id} _id={test._id} title={test.title} desc={test.desc} 
                                        questions={test.questions} resources={test.resources}
                                        creator={test.creator} createdAt={test.createdAt} num_of_passedTests={test.creator.passedTests.length} />
                                    </div>
                                </div>
                            </div>
                        }
                        <Header />
                        <main>
                            <Switch>
                                {this.state.token && <Redirect from="/signin" to="/" exact />}
                                {this.state.token && <Redirect from="/signup" to="/" exact />}
                                {!this.state.token && <Redirect from="/createtest" to="/signin" exact />}
                                {!this.state.token && <Redirect from="/taketest/:id" to="/signin" />}
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