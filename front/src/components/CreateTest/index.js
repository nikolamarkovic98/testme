import React from 'react';
import './index.css';

import myContext from '../../context/context';
import {createStr} from '../../helpers';
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
        questions: [],
        resources: []
    }

    static contextType = myContext;

    constructor(props){
        super(props);
    }

    createTest = async e => {
        const title = (document.querySelector('#title').value).trim();
        const desc = (document.querySelector('#desc').value).trim();
        // questions and resources must be stringified
        const questions = createStr(JSON.stringify(this.state.questions));
        // since it's just string in db I dont need to send generated ids...
        let resources = '';
        this.state.resources.forEach((resource, index) => {
            if(resources.length-1 == index)
                resources += `${resource.URL}`;
            resources += `${resource.URL} `;
        });

        const query = {
            query: `mutation{createTest(testInput:{title:"${title}",desc:"${desc}",questions:"${questions}",resources:"${resources}"}){ msg }}`
        }

        const res = await sendAuthHTTP(query, this.context.token);
        console.log(res);
        if(res.data.createTest.msg == 'Test created!')
            document.querySelector('#msg').innerHTML = res.data.createTest.msg;
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
        if(URL == ''){
            document.querySelector('#msg').innerHTML = 'Resource can\'t be empty';
            return;
        }

        if(!isURL(URL)){
            document.querySelector('#msg').innerHTML = 'Not valid URL!';
            return;
        }

        document.querySelector('#msg').innerHTML = '';

        let resources = this.state.resources;
        resources.push({
            id: Math.random(),
            URL: URL});
        this.setState({resources: resources});
    }

    removeResource = id => {
        let resources = this.state.resources;
        resources.forEach((resource, index) => {
            if(resource.id == id)
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
        /*if(question == '' || answer == '' || A == '' || B == '' || C == '' || D == ''){
            document.querySelector('#question-input-msg').innerHTML = 'All inputs are required!';
            return;
        }*/

        document.querySelector('#question-input-msg').innerHTML = '';

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
            if(questions[i].id == question.id)
                questions[i] = question;
        this.setState({questions:questions});
    }

    removeQuestion = id => {
        let questions = this.state.questions;
        for(let i = 0; i < questions.length; i++){
            if(questions[i].id == id){
                questions.splice(i, 1);
            }
        }
        this.setState({questions:questions});
    }

    moveQuestionUp = index => {
        if(index == 0 || this.state.questions.length == 0)
            return;
        let questions = this.state.questions;
        let x = this.state.questions[index];
        questions[index] = questions[index-1];
        questions[index-1] = x;
        this.setState({questions: questions});
    }
    
    moveQuestionDown = index => {
        if(index == this.state.questions.length-1 || this.state.questions.length == 0)
            return;
        let questions = this.state.questions;
        let x = this.state.questions[index];
        questions[index] = questions[index+1];
        questions[index+1] = x;
        this.setState({questions: questions});
    }

    render(){
        let questions;
        if(this.state.questions.length != 0){
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
                                <div className="question-box">
                                    <label>Title:</label>
                                    <input type="text" className="question-input color" id="title" maxLength="40" />
                                </div>
                                <div className="question-box">
                                    <label>Description:</label>
                                    <textarea className="question-input color" id="desc" maxLength="500"></textarea>
                                </div>
                                <div className="question-box">
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
                                </div>
                                <p id="msg"></p>
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
                                        <p id="question-input-msg"></p>
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
                        <button className="classic-btn remove-btn">Cancel</button>
                        <button className="classic-btn" onClick={this.createTest}>Create Test</button>
                    </div>
                    <p id="msg"></p>
                </div>
            </div>
        )
    }
}

export default CreateTest;