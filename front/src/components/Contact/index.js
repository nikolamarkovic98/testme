import React from 'react';
import './index.css';
import {sendHTTP} from '../../requests';
import {displayMessage} from '../../helpers';

const sendEmail = async e => {
    e.preventDefault();
    
    const from = (document.querySelector('#from').value).trim();
    const subject = (document.querySelector('#subject').value).trim();
    const text = (document.querySelector('#text').value).trim();

    if(from === '' || subject === '' || text === ''){
        displayMessage('msg', 'All inputs are required!', 'red');
        return;
    }

    displayMessage('msg', 'Sending email...', '#000');

    const query = {
        query: `query{sendEmail(from:"${from}",subject:"${subject}",text:"${text}")}`
    }

    const res = await sendHTTP(query);
    if(res === undefined || res === null)
            return;
    if(res.data.sendEmail !== undefined){
        if(res.data.sendEmail === 'Success'){
            displayMessage('msg', res.data.sendEmail, 'green');
        } else {
            displayMessage('msg', 'An error occurred while sending email', 'red');
        }
    }
}

const Contact = props => {
    return (
        <div className="contact-wrapper">
            <div className="contact">
                <h1>Contact <span>me! :)</span></h1>
                <form>
                    <div className="form-box">
                        <input type="text" id="from" placeholder="Your email" />
                    </div>
                    <div className="form-box">
                        <input type="text" id="subject" placeholder="Subject" />
                    </div>
                    <div className="form-box">
                        <textarea id="text"></textarea>
                    </div>
                    <button type="submit" className="classic-btn" onClick={sendEmail}>Send email</button>
                </form>
                <p id="msg" className="msg"></p>
            </div>
        </div>
    )
}

export default Contact;