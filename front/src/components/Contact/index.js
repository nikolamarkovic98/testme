import React from 'react';
import './index.css';
import {sendHTTP} from '../../requests';

const sendEmail = async e => {
    e.preventDefault();
    
    const from = (document.querySelector('#from').value).trim();
    const subject = (document.querySelector('#subject').value).trim();
    const text = (document.querySelector('#text').value).trim();

    // validation

    document.querySelector('#msg').innerHTML = 'Sending email...';

    const query = {
        query: `query{sendEmail(from:"${from}",subject:"${subject}",text:"${text}")}`
    }

    const res = await sendHTTP(query);
    if(res.data.sendEmail == 'Success'){
        document.querySelector('#msg').innerHTML = res.data.sendEmail;
    } else {
        console.log('Error while sending email');
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
                <p id="msg"></p>
            </div>
        </div>
    )
}

export default Contact;