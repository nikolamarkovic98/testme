import React from 'react';

import QuestionBox from '../QuestionBox';
import './index.css';

import myContext from '../../context/context';
import { sendAuthHTTP } from '../../requests';
import {createStr, redirectHome, displayMessage} from '../../helpers';

class TakeTest extends React.Component{
    static contextType = myContext;

    constructor(props){
        super(props);
        this.state = {
            id: this.props.match.params.id,
            completed: false,
            test: null,
            time: {
                minutes: 0,
                seconds: 0
            },
            interval: null
        }
    }

    componentDidMount = async () => {
        // get test
        const query = {
            query: `query{test(_id: "${this.state.id}"){_id title desc questions{_id question answer A B C D} createdAt msg}}`
        }

        const res = await sendAuthHTTP(query, this.context.token);
        if(res === undefined || res === null)
            return;
        if(res.data.test !== undefined){
            if(res.data.test.msg === 'Success'){
                // set state and start stopwatch
                this.setState({test: res.data.test});
                this.state.interval = setInterval(this.stopWatchLogic, 1000);
            }
        }
    }

    stopWatchLogic = () => {
        if(this.state.time.seconds === 59){
            const time = this.state.time;
            time.minutes = this.state.time.minutes + 1;
            time.seconds = 0;
            this.setState({time: time});
            return;
        }
        const time = this.state.time;
        time.seconds = time.seconds + 1;
        this.setState({time: time});
    }

    rateTest = async e => {
        if(this.state.completed){
            displayMessage('msg', 'You already completed test!', 'green');
            return;
        }

        clearInterval(this.state.interval);
        
        const minutes = this.state.time.minutes < 10 ? `0${this.state.time.minutes}` : `${this.state.time.minutes}`;
        const seconds = this.state.time.seconds < 10 ? `0${this.state.time.seconds}` : `${this.state.time.seconds}`;

        // I could even create a new object without questions because I dont really need that on server... later
        const query = {
            query: `mutation{rateTest(test:"${createStr(JSON.stringify(this.state.test))}",minutes:"${minutes}",seconds:"${seconds}")}`
        }

        // maybe I could like show the result of test after submitting...
        const res = await sendAuthHTTP(query, this.context.token);
        if(res === undefined || res === null)
            return;
        if(res.data.rateTest !== undefined){
            if(res.data.rateTest === 'Success'){
                displayMessage('msg', 'You successfuly completed test. You can see details on your profile. :)', 'green');
                this.setState({completed: true});
                this.context.loadTests();
            } else {
                displayMessage('msg', 'An error occurred', 'red');
            }
        }
    }

    setAnswer = (questionId, answer) => {
        let test = this.state.test;
        test.questions.forEach(question => {
            if(question._id === questionId)
                question.answer = answer;
        });
        this.setState({test: test});
    }

    render(){
        let questions;
        if(this.state.test){
            questions = this.state.test.questions.map(question => {
                return (
                    <QuestionBox key={question._id} id={question._id} question={question.question} A={question.A} B={question.B} C={question.C} D={question.D} setAnswer={this.setAnswer} />
                )
            });
        }

        const minutes = this.state.time.minutes < 10 ? `0${this.state.time.minutes}` : this.state.time.minutes;
        const seconds = this.state.time.seconds < 10 ? `0${this.state.time.seconds}` : this.state.time.seconds;

        return(
            <>
            {
                this.state.test &&
                <div className="take-test">
                    <div className="content-wrap">
                        <h1>{this.state.test.title} - Test</h1>
                        <p>You can go ahead and start answering questions, best of luck!</p>
                        <div className="questions">
                            {questions}
                        </div>
                        <div className="take-test-options">
                            <button className="cancel-btn" onClick={e => redirectHome(e, this.context.history, this.state.completed)}>Cancel</button>
                            <button className="classic-btn" onClick={this.rateTest}>Finish</button>
                            <div className="time">{`${minutes}:${seconds}`}</div>
                        </div>
                        <p id="msg" className="msg"></p>
                    </div>
                </div>
            }
            </>
        )   
    }
}

export default TakeTest;