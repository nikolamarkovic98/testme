import React from 'react';
import './index.css';

import myContext from '../../context/context';
import {createStr, redirectHome, displayMessage} from '../../helpers';
import {sendAuthHTTP} from '../../requests';

import Question from '../Question';

const isURL = (string) => {
    // if it throws error its not a valid URL
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;  
    }
  }

// I definetly need state here because I am going to have a list of questions that I need to save...
// so whats left is to actually send request to server and create test, everything else works
// I should also implement functionality that you can like change the order of questions
class CreateTest extends React.Component {
    state = {
        testCreated: false,
        questions: [],
        resources: []
    }

    static contextType = myContext;

    createTestValidation = (title, desc) => {
        if(title === ''){
            displayMessage('msg', 'Title is required!', 'red');
            return true;
        }
        if(desc === ''){
            displayMessage('msg', 'Description is required!', 'red');
            return true;
        }
        if(this.state.questions.length === 0){
            displayMessage('msg', 'Test must have questions!', 'red');
            return true;
        }

        return false;
    }

    createTest = async e => {
        if(this.state.testCreated){
            displayMessage('msg', 'You already created test!', 'green');
            return;
        }

        const title = (document.querySelector('#title').value).trim();
        const desc = (document.querySelector('#desc').value).trim();

        // validation
        if(this.createTestValidation(title, desc))
            return;

        displayMessage('msg', '', 'red');

        // questions must be stringified
        const questions = createStr(JSON.stringify(this.state.questions));

        // since it's just string in db I dont need to send generated ids...
        let resources = '';
        this.state.resources.forEach((resource, index) => {
            if(resources.length-1 === index)
                resources += `${resource.URL}`;
            resources += `${resource.URL} `;
        });

        const query = {
            query: `mutation{createTest(testInput:{title:"${title}",desc:"${desc}",questions:"${questions}",resources:"${resources}"}){ msg }}`
        }

        const res = await sendAuthHTTP(query, this.context.token);
        if(res === undefined || res === null)
            return;
        if(res.data.createTest !== undefined){
            if(res.data.createTest.msg === 'Test created!'){
                displayMessage('msg', res.data.createTest.msg, 'green');
                this.setState({testCreated: true});
                this.context.loadTests();
            }
        }
    }

    handleSwitch = e => {
        switch(e.target.innerHTML){
            case 'General':
                e.target.classList.add('active');
                document.querySelector('.general-panel').classList.add('active');
                document.querySelector('#activate-add-question').classList.remove('active');
                document.querySelector('.question-panel').classList.remove('active');
                break;
            case 'Add Question':
                e.target.classList.add('active');
                document.querySelector('.question-panel').classList.add('active');
                document.querySelector('#activate-general').classList.remove('active');
                document.querySelector('.general-panel').classList.remove('active');
                break;
        }
    }

    reset = () => {
        document.querySelector('#question').value = '';
        document.querySelector('#answer').value = '';
        document.querySelector('#A').value = '';
        document.querySelector('#B').value = '';
        document.querySelector('#C').value = '';
        document.querySelector('#D').value = '';
    }

    addResource = e => {
        let URL = (document.querySelector('#resource-add').value).trim();
        document.querySelector('#resource-add').value = '';
        
        // validation
        if(URL === ''){
            displayMessage('resource-msg', 'Resource can\'t be empty', 'red');
            return;
        }

        if(!isURL(URL)){
            displayMessage('resource-msg', 'Not valid URL!', 'red');
            return;
        }

        displayMessage('resource-msg', '', 'red');

        let resources = this.state.resources;
        resources.push({
            id: Math.random(),
            URL: URL});
        this.setState({resources: resources});
    }

    removeResource = id => {
        let resources = this.state.resources;
        resources.forEach((resource, index) => {
            if(resource.id === id)
                resources.splice(index, 1);
        });
        this.setState({resources: resources});
    }

    addQuestion = e => {
        // add question to the list and init inputs again
        const question = document.querySelector('#question').value;
        const answer = document.querySelector('#answer').value;
        const A = document.querySelector('#A').value;
        const B = document.querySelector('#B').value;
        const C = document.querySelector('#C').value;
        const D = document.querySelector('#D').value;

        // validate question input
        if(question === '' || answer === '' || A === '' || B === '' || C === '' || D === ''){
            displayMessage('question-input-msg', 'All inputs are required!', 'red');
            return;
        }

        displayMessage('question-input-msg', '', 'red');

        let questions = this.state.questions;
        questions.push({
            id: Math.random(),
            question,
            answer,
            A, B, C, D
        });
        this.setState({questions:questions});
        this.reset();
        // next thing I should do is add question to question list actually but now I gotta go to store
    }

    editQuestion = question => {
        const questions = this.state.questions;
        for(let i = 0; i < questions.length; i++)
            if(questions[i].id === question.id)
                questions[i] = question;
        this.setState({questions:questions});
    }

    removeQuestion = id => {
        let questions = this.state.questions;
        for(let i = 0; i < questions.length; i++){
            if(questions[i].id === id){
                questions.splice(i, 1);
            }
        }
        this.setState({questions:questions});
    }

    moveQuestionUp = index => {
        if(index === 0 || this.state.questions.length === 0)
            return;
        let questions = this.state.questions;
        let x = this.state.questions[index];
        questions[index] = questions[index-1];
        questions[index-1] = x;
        this.setState({questions: questions});
    }
    
    moveQuestionDown = index => {
        if(index === this.state.questions.length-1 || this.state.questions.length === 0)
            return;
        let questions = this.state.questions;
        let x = this.state.questions[index];
        questions[index] = questions[index+1];
        questions[index+1] = x;
        this.setState({questions: questions});
    }

    render(){
        let questions;
        if(this.state.questions.length !== 0){
            questions = this.state.questions.map((question, index) => {
                return (
                    <Question key={question.id} id={question.id} index={index} question={question.question}
                              A={question.A} B={question.B} C={question.C} D={question.D} answer={question.answer}
                              moveQuestionUp={this.moveQuestionUp} moveQuestionDown={this.moveQuestionDown}
                              editQuestion={this.editQuestion} removeQuestion={this.removeQuestion} />
                )
            });
        }

        const resources = this.state.resources.map(resource => {
            return (
                <p className="resource" key={resource.id}>
                    <a href={`${resource.URL}`} target="_blank">{resource.URL}</a>
                    <button onClick={e => this.removeResource(resource.id)} className="remove-btn">Remove</button>
                </p>
            )
        });

        return (
            <div className="create-test">
                <div className="content-wrap">
                    <div className="info">
                        <h1>Create Test</h1>
                        <p>Here you can create your own tests that other people could try to solve!</p>
                    </div>
                    <div className="panel">
                        <div className="panel-box">
                            <nav>
                                <div onClick={this.handleSwitch} id="activate-general" className="active">General</div
                                ><div onClick={this.handleSwitch} id="activate-add-question">Add Question</div>
                            </nav>
                            <div className="general-panel wrapper active">
                                <h2>General</h2>
                                <p>Here you can set some of general information about the test you are about to create such as title and description.</p>
                                <div className="general-panel-box">
                                    <label>Title:</label>
                                    <input type="text" className="question-input color" id="title" maxLength="40" />
                                </div>
                                <div className="general-panel-box">
                                    <label>Description:</label>
                                    <textarea className="question-input color" id="desc" maxLength="500"></textarea>
                                </div>
                                <div className="general-panel-box resources-wrapper">
                                    <p>If you know any useful literature that could help users pass the test, you can add it here:</p>
                                    <div className="resources">
                                        <div className="added-resources">
                                            {resources}
                                        </div>
                                        <div className="control">
                                            <input type="text" className="question-input color" id="resource-add" placeholder="Link" />
                                            <button className="classic-btn" onClick={this.addResource}>Add</button>
                                        </div>
                                    </div>
                                    <p id="resource-msg" className="msg"></p>
                                </div>
                            </div>
                            <div className="question-panel wrapper">
                                <h2>Add Question</h2>
                                <div className="question-box"> 
                                    <label>Question:</label>
                                    <input type="text" className="question-input color" id="question" placeholder="(2+2)" />
                                </div>
                                <div className="question-box">
                                    <div className="answer-box">
                                        <label>A)</label>
                                        <input type="text" className="question-input color" id="A" placeholder="1" />
                                    </div>
                                    <div className="answer-box">
                                        <label>B)</label>
                                        <input type="text" className="question-input color" id="B" placeholder="2" />
                                    </div>
                                    <div className="answer-box">
                                        <label>C)</label>
                                        <input type="text" className="question-input color" id="C" placeholder="3" />
                                    </div>
                                    <div className="answer-box">
                                        <label>D)</label>
                                        <input type="text" className="question-input color" id="D" placeholder="4" />
                                    </div>
                                </div>
                                <div className="question-box">
                                    <label>Corrent answer:</label>
                                    <div>
                                    <select id="answer">
                                        <option></option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="question-box align">
                                    <button className="classic-btn" onClick={this.addQuestion}>Add Question</button>
                                    <div>
                                        <p id="question-input-msg" className="msg"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel-box wrapper">
                            <h2>Questions review</h2>
                            {questions}
                        </div>
                    </div>
                    <div className="create-test-options">
                        <button className="cancel-btn" onClick={e => redirectHome(e, this.context.history, this.state.testCreated)}>Cancel</button>
                        <button className="classic-btn" onClick={this.createTest}>Create Test</button>
                    </div>
                    <p id="msg" className="msg"></p>
                </div>
            </div>
        )
    }
}

export default CreateTest;