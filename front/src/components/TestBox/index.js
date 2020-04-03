import React from 'react';
import {Link} from 'react-router-dom';
import UserImage from './contact_icon.svg';
import {getDate} from '../../helpers';
import {sendAuthHTTP} from '../../requests';
import MyContext from '../../context/context';

import './index.css';

const removeTest = async (_id, context) => {
    if(window.confirm('Are you sure you want to delete this test?')){
        const query = {
            query: `mutation{removeTest(_id:"${_id}")}`
        }
        const res = await sendAuthHTTP(query, context.token);
        if(res === undefined || res === null)
            return;
        if(res.data.removeTest !== undefined){
            if(res.data.removeTest === 'Removed')
                context.loadTests();
        }
    }
}

const takeTest = async (e, testId, context) => {
    e.preventDefault();
    if(context.token){
        // znaci ako ima token to znaci da je user login
        const query = {
            query: `query{user(username:"${context.username}"){passedTests{_id}}}`
        }
        const res = await sendAuthHTTP(query, context.token);
        if(res === undefined || res === null)
            return;
        if(res.data.user !== undefined){
            const passedTests = res.data.user.passedTests;
            let match = false;
            if(passedTests.length !== 0)
                for(let i = 0; i < passedTests.length && !match; i++)
                    if(passedTests[i]._id === testId)
                        match = true;

            // if match znaci da je vec polagao ovaj test
            if(match){
                if(window.confirm('You already completed this test. Are you sure you want to pass it again?')){
                    context.history.push(`/taketest/${testId}`);
                }
            } else {
                context.history.push(`/taketest/${testId}`);
            }
        }
    } else {
        context.history.push(`/signin`);
    }
}

const TestBox = props => {
    let resources = [], _resources;
    if(props.resources !== null && props.resources !== undefined && props.resources !== ''){
        _resources = props.resources.split(' ');
        resources = _resources.map((resource, index) => {
            if(_resources.length-1 === index)
                return;
            return (
                <div key={Math.random()} className="resource">&#8594; <a href={resource} target="_blank">{resource}</a></div>
            )
        });
    }

    return (
        <MyContext.Consumer>
            {
            context => {
                return (
                    <div className="test-box">
                        <div className="resource-box">
                            <div className="resource-header" 
                                onClick={e => {
                                        if(e.target.innerHTML === '⇩')
                                            e.target.innerHTML = '&#8679;';
                                        else
                                            e.target.innerHTML = '&#8681;';
                                        
                                        e.target.parentElement.classList.toggle('display')
                                    }}>
                                &#8681;
                            </div>
                            <div className="resource-wrapper">
                                <h2>List of sites that you could find useful:</h2>
                                <div className="resources">
                                    {
                                        resources.length === 0 ?
                                        <div>Empty</div> :
                                        resources
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="user-panel">
                            <Link to={`/user/${props.creator.username}`} className="user-panel-box" data-id="dialog">
                                <img className="user-image" data-id="dialog" src={UserImage} alt="Can't load user image" />
                                <div data-id="dialog">
                                    <p><span className="test-creator" data-id="dialog">{props.creator.username}</span></p>
                                    <p data-id="dialog">Created tests: {props.creator.createdTests.length}</p>
                                    <p data-id="dialog">Passed tests: {props.num_of_passedTests}</p>
                                </div>
                            </Link>
                            <div className="user-panel-box">
                                {
                                    context.username === props.creator.username ?
                                    <span onClick={e => removeTest(props._id, context)}>&times;</span> : ''
                                }
                            </div>
                        </div>
                        <div className="test-panel">
                            <h2>{props.title}</h2>
                            <p className="date">{getDate(props.createdAt)}</p>
                            <p className="desc">{props.desc}</p>
                            <div className="options">
                                <Link to={`/taketest/${props._id}`} className="taketest-btn"
                                 onClick={e => takeTest(e, props._id, context)} data-id="dialog">
                                     Take Test
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }}
        </MyContext.Consumer>
    )
}

export default TestBox;