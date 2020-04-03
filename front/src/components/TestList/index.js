import React from 'react';
import {Link} from 'react-router-dom';
import TestBox from '../TestBox';
import './index.css';

const TestList = props => {
    let tests = [];
    if(props.tests){
        tests = props.tests.map(test => {
            // I need to check the way I get num_of_passedTests because I send it differently in App and in User components
            let num_of_passedTests;
            if(test.creator.passedTests !== undefined)
                num_of_passedTests = test.creator.passedTests.length;
            else if(props.num_of_passedTests !== undefined)
                num_of_passedTests = props.num_of_passedTests;

            return (
                <TestBox key={test._id} _id={test._id} title={test.title} desc={test.desc} resources={test.resources}
                questions={test.questions} resources={test.resources}
                creator={test.creator} createdAt={test.createdAt} num_of_passedTests={num_of_passedTests} />
            )
        });
    }

    let userComponent = false;
    if(window.location.href.includes('/user'))
        userComponent = true;

    return(
        <div className="test-list">
            {
                /*
                * I use this component in landing page and in user page
                * - in landing page I also pass text as prop that displays as h1
                * - in user profile I do not pass text but I use it to display tests
                */ 
                props.h1 && <h1>{props.h1}</h1>
            }
            <div className="list">
                {
                    
                    !tests.length && userComponent ?
                    <h1>Empty</h1> : <></>
                }
                <Link to="/createtest" className="classic-btn">Create Test</Link>
                {tests}
            </div>
        </div>
    )
}

export default TestList;