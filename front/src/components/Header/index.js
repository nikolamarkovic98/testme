import React, {useState, useEffect} from 'react';
import './index.css';

import { Link } from 'react-router-dom';
import {sendHTTP} from '../../requests';
import myContext from '../../context/context';

const search = async (e, setTests, setUsers) => {
    if(e.target.value == ''){
        setUsers([]);
        setTests([]);   
        return;
    }

    const query = {
        query: `query{search(search:"${e.target.value}"){users{username firstName lastName} tests{title} msg}}`
    }

    const res = await sendHTTP(query);
    // console.log(res.data.search.users);
    if(res.data.search.users.length != 0)
        setUsers(res.data.search.users)
    if(res.data.search.tests.length != 0)
        setTests(res.data.search.tests)
}

const Header = props => {
    const [tests, setTests] = useState([]);
    const [users, setUsers] = useState([]);
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        console.log('Hello world');
    })

    return (
        <myContext.Consumer>
            { context => {
                return (
                    <header>
                        <div className="content-wrap">
                            <div className="header-box">
                                <h2 className="logo"><Link to='/'>testMe</Link></h2>
                            </div>
                            <div className="header-box">
                                <input type="text" onFocus={e => setFocus(true)} onChange={e => search(e, setTests, setUsers)} placeholder="Search (Not working yet)" />
                                {
                                    users.map(user => {
                                        return (
                                            <li><Link to={`/user/${user.username}`}>{user.username}</Link></li>
                                        )
                                    })
                                }
                            </div>
                            <div className="header-box">
                                {
                                    context.token == null ?
                                    <ul>
                                        <li className="auth-link"><Link to="/signup">SignUp</Link></li>
                                        <li className="auth-link"><Link to="/signin">SignIn</Link></li>
                                    </ul>
                                    :
                                    <ul>
                                        <li>
                                            {context.username} | &#8595;
                                            <ul>
                                                <li><Link to={`/user/${context.username}`}>Your profile</Link></li>
                                                <li><Link to="/createtest">Create test</Link></li>
                                                <li onClick={context.logout}><Link to="/">SignOut</Link></li>
                                            </ul>
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