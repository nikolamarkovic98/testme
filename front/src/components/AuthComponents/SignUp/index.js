import React from 'react';
import '../index.css';

import {Link} from 'react-router-dom';
import { sendHTTP } from '../../../requests';

const handleSubmit = async e => {
    e.preventDefault();
    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    // validation
    if(!(firstName != '' && lastName != '' && username != '' &&
       password != '' && passwordConfirm != '')){
        document.querySelector('#msg').innerHTML = 'All fields are required!';
        return;
    }
    if(password != passwordConfirm){
        document.querySelector('#msg').innerHTML = 'Passwords need to match!';
        return;
    }

    // everything ok make request
    document.querySelector('#msg').innerHTML = '';
    const query = {
        query: `mutation{createUser(userInput:{firstName:"${firstName}",lastName:"${lastName}",username:"${username}",password:"${password}"}){msg}}`
    }

    const res = await sendHTTP(query);
    if(res.data.createUser.msg == 'Username already taken'){
        document.querySelector('#msg').innerHTML = `${res.data.createUser.msg}!`;
        return;
    }
    document.querySelector('#msg').innerHTML = `${res.data.createUser.msg}!`;
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
                        <label>Username:</label>
                        <input type="text" id="username" />
                    </div>
                    <div className="form-box">
                        <label>Password:</label>
                        <input type="text" id="password" />
                    </div>
                    <div className="form-box">
                        <label>Confirm password:</label>
                        <input type="text" id="password-confirm" />
                    </div>
                    <div className="form-box">
                        <button type="submit" className="classic-btn" onClick={handleSubmit}>SignUp</button>
                        <p className="or">Already have an account? <Link to="/signin">SignIn</Link></p>
                    </div>
                </form>
                <p id="msg"></p>
            </div>
        </div>
    )
}

export default SignUp;