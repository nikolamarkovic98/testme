import React from 'react';
import '../index.css';

import {Link} from 'react-router-dom';
import { sendHTTP } from '../../../requests';
import {displayMessage} from '../../../helpers';

const handleSubmit = async e => {
    e.preventDefault();
    const firstName = (document.querySelector('#first-name').value).trim();
    const lastName = (document.querySelector('#last-name').value).trim();
    const email = (document.querySelector('#email').value).trim();
    const username = (document.querySelector('#username').value).trim();
    const password = (document.querySelector('#password').value).trim();
    const passwordConfirm = (document.querySelector('#password-confirm').value).trim();

    // validation
    if(!(firstName !== '' && lastName !== '' && username !== '' &&
       password !== '' && passwordConfirm !== '' && email !== '')){
        displayMessage('msg', 'All fields are required!', 'red');
        return;
    }
    if(password !== passwordConfirm){
        displayMessage('msg', 'Passwords need to match!', 'red');
        return;
    }

    // everything ok make request
    document.querySelector('#msg').innerHTML = '';
    const query = {
        query: `mutation{createUser(userInput:{firstName:"${firstName}",lastName:"${lastName}", email:"${email}", username:"${username}",password:"${password}"}){msg}}`
    }

    const res = await sendHTTP(query);
    if(res === undefined || res === null)
            return;
    if(res.data.createUser !== undefined){
        if(res.data.createUser.msg === 'Username already taken' || res.data.createUser.msg === 'Email already taken'){
            displayMessage('msg', res.data.createUser.msg, 'red');
            return;
        }
        displayMessage('msg', res.data.createUser.msg, 'green');
    }
}

const SignUp = props => {
    return (
        <div className="auth-wrapper">
            <div className="sign-up auth">
                <h1>Sign<span className="span-color">Up</span></h1>
                <form>
                    <div className="form-box">
                        <label>First Name:</label>
                        <input type="text" id="first-name" />
                    </div>
                    <div className="form-box">
                        <label>Last Name:</label>
                        <input type="text" id="last-name" />
                    </div>
                    <div className="form-box">
                        <label>Email:</label>
                        <input type="email" id="email" />
                    </div>
                    <div className="form-box">
                        <label>Username:</label>
                        <input type="text" id="username" />
                    </div>
                    <div className="form-box">
                        <label>Password:</label>
                        <input type="password" id="password" />
                    </div>
                    <div className="form-box">
                        <label>Confirm password:</label>
                        <input type="password" id="password-confirm" />
                    </div>
                    <div className="form-box">
                        <button type="submit" className="classic-btn" onClick={handleSubmit}>SignUp</button>
                        <p className="or">Already have an account? <Link to="/signin">SignIn</Link></p>
                    </div>
                </form>
                <p id="msg" className="msg"></p>
            </div>
        </div>
    )
}

export default SignUp;