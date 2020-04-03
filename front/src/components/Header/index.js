import React, {useState} from 'react';
import './index.css';

import ContactIcon from './contact_icon.svg';
import TestIcon from './test-icon.png';
import { Link } from 'react-router-dom';
import {sendHTTP} from '../../requests';
import myContext from '../../context/context';

const animation = loading => {
    if(loading.innerHTML.slice(7, 7+3) === '...'){
        loading.innerHTML = 'Loading';
        return;
    }
    loading.innerHTML += '.';
}

// checks if input is empty and resets lists - I need this as function because onChange bugs a little so I need additional check on onFocus
const check = (e, setTests, setUsers) => {
    if(e.target.value === ''){
        setUsers([]);
        setTests([]);
        return true;
    }
    return false;
}

const search = async (e, setTests, setUsers) => {
    if(check(e, setTests, setUsers))
        return;

    const query = {
        query: `query{search(search:"${e.target.value}"){users{username firstName lastName} tests{_id title} msg}}`
    }

    const loading = document.querySelector('#loading');

    loading.style.display = 'inline-block';
    const interval = setInterval(() => animation(loading), 200);
    const res = await sendHTTP(query);
    clearInterval(interval);
    loading.style.display = 'none';

    if(res === undefined || res === null)
            return;
    if(res.data.search !== undefined){
        if(res.data.search.users.length !== 0){
            // I dont want more than three items in search
            if(res.data.search.users.length > 3){
                setUsers(res.data.search.users.splice(0, 3));
            } else {
                setUsers(res.data.search.users)
            }
        }
        else 
            setUsers([]);
            
        if(res.data.search.tests.length !== 0){
            // I dont want more than three items in search
            if(res.data.search.tests.length > 3){
                setTests(res.data.search.tests.splice(0, 3));
            } else {
                setTests(res.data.search.tests)
            }
        }
        else
            setTests([]);
    }
}

const Header = props => {
    const [tests, setTests] = useState([]);
    const [users, setUsers] = useState([]);

    return (
        <myContext.Consumer>
            { context => {
                return (
                    <header>
                        <div className="content-wrap">
                            <div className="header-box">
                                <h2 className="logo"><Link to='/'>testMe</Link></h2>
                            </div>
                            <div className="header-box header-box-search">
                                <div className="flex">
                                    <input type="text" onChange={e => search(e, setTests, setUsers)} onFocus={e => check(e, setTests, setUsers)} placeholder="Search" data-id="search" />
                                    <span id="loading">Loading</span>
                                </div>
                                {
                                    <ul id="search">
                                    {
                                        // I actually want to display one user and one test and so on... I need a for loop for this
                                        users.map((user, index) => {
                                            return (
                                                <li key={Math.random()}>
                                                    <Link to={`/user/${user.username}`}>
                                                        <div>
                                                            <img src={ContactIcon} className="user-image" alt="Cant display contact icon" />
                                                        </div>
                                                        <div>
                                                            <p>{`${user.firstName} ${user.lastName}`}</p>
                                                            <p>{user.username }</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                    {
                                        tests.map(test => {
                                            return (
                                                <li key={test._id} className="search-test" onClick={e => context.showTest(test._id)}>
                                                    <img src={TestIcon} className="user-image" alt="Cant display contact icon" />
                                                    <span>{test.title}</span>
                                                </li>
                                            )
                                        })
                                    }
                                    </ul>
                                }
                            </div>
                            <div className="header-box">
                                {
                                    context.token == null ?
                                    <nav>
                                        <ul className="nav">
                                            <li className="auth-link"><Link to="/signup">SignUp</Link></li>
                                            <li className="auth-link"><Link to="/signin">SignIn</Link></li>
                                        </ul>
                                        <div className="toggle">
                                            <div className="hamburger" onClick={e => {
                                                document.querySelector('#hamburger-nav').classList.toggle('hide');
                                            }}>
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                            <ul id="hamburger-nav" className="hide">
                                                <li className="home"><Link to="/">Home</Link></li>
                                                <li className="auth-link"><Link to="/signup">SignUp</Link></li>
                                                <li className="auth-link"><Link to="/signin">SignIn</Link></li>
                                            </ul>
                                        </div>
                                    </nav>
                                    :
                                    <ul>
                                        <li>
                                            <span onClick={e => {
                                                document.querySelector('#logged').classList.toggle('hide');
                                            }}>{context.username} | &#8595;</span>
                                            <ul id="logged" className="hide">
                                                <li className="home"><Link to="/">Home</Link></li>
                                                <li><Link to={`/user/${context.username}`}>Your profile</Link></li
                                                ><li><Link to="/createtest">Create test</Link></li
                                                ><li onClick={context.logout}><Link to="/">SignOut</Link></li
                                            ></ul>
                                        </li>
                                    </ul>
                                }
                            </div>
                        </div>
                    </header>
            )}}
        </myContext.Consumer>
    )
}

export default Header;