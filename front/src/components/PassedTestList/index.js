import React from 'react';
import PassedTestBox from '../PassedTestBox';

const PassedTestList = props => {
    let passedTests = [];
    if(props.passedTests){
        passedTests = props.passedTests.map(passedTest => {
            return (
                <PassedTestBox key={passedTest._id} _id={passedTest._id} title={passedTest.title} resources={passedTest.resources}
                grade={passedTest.grade} score={passedTest.score} minutes={passedTest.minutes} seconds={passedTest.seconds} 
                creator={passedTest.creator} createdAt={passedTest.createdAt} num_of_passed_tests={props.passedTests.length} />
            )
        });
    }

    let userComponent = false;
    if(window.location.href.includes('/user'))
        userComponent = true;

    return(
        <div className="passed-test-list">
            <div className="list">
                {
                    !passedTests.length && userComponent ?
                    <h1>Empty</h1> : <></>
                }
                {passedTests}
            </div>
        </div>
    )
}

export default PassedTestList;