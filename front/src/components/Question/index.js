import React from 'react';

import Answer from './sub-components/Answer';
import './index.css'

class Question extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            question: this.props.question,
            answer: this.props.answer,
            A: this.props.A,
            B: this.props.B,
            C: this.props.C,
            D: this.props.D,
            editMode: false
        }
    }   

    edit = e => {
        // this function edits the entire question
        this.setState({editMode: !this.state.editMode})
        if(this.state.editMode)
            this.props.editQuestion({
                id: this.props.id,
                question: this.state.question,
                answer: this.state.answer,
                A: this.state.A,
                B: this.state.B,
                C: this.state.C,
                D: this.state.D,
            })
    }

    // a better approach would be to assign data-id to everything that will not make question displaer
    displayQuestion = e => {
        if(this.state.editMode) 
            return;
        const id = e.target.getAttribute('data-id');
        if(id === 'action'){
            return
        }

        // if id starts with digit we must use getElementById
        let question = document.getElementById(`${this.props.id}`);
        question.classList.toggle('hide');
    }

    editQuestion = e => this.setState({question: e.target.value});
    editAnswer = value => this.setState({answer: value});
    editA = e => this.setState({A: e.target.value});
    editB = e => this.setState({B: e.target.value});
    editC = e => this.setState({C: e.target.value});
    editD = e => this.setState({D: e.target.value});

    render(){
        return (
            <div className="question hide" id={`${this.props.id}`} onClick={this.displayQuestion}>
                <div className="index">{this.props.index + 1})</div>
                <div className="arrow-up arrows" data-id="action" onClick={() => this.props.moveQuestionUp(this.props.index)}></div>
                <div className="arrow-down arrows" data-id="action" onClick={() => this.props.moveQuestionDown(this.props.index)}></div>
                <div className="question-box added">
                    <label>Question:</label>
                    {
                        this.state.editMode == false ?
                        <input type="text" className="question-input" id={`${this.props.id}-question`} value={this.state.question} readOnly />
                        :
                        <input type="text" className="question-input color" id={`${this.props.id}-question`} value={this.state.question} onChange={this.editQuestion} />
                    }
                </div>
                <div className="content">
                    <div className="question-box added">
                        <div className="answer-box">
                            <label>A)</label>
                            {
                                this.state.editMode == false ?
                                <input type="text" className="question-input" id={`${this.props.id}-A`} value={this.state.A} readOnly />
                                :
                                <input type="text" className="question-input color" id={`${this.props.id}-A`} value={this.state.A} onChange={this.editA} />
                            }
                        </div>
                        <div className="answer-box">
                            <label>B)</label>
                            {
                                this.state.editMode == false ?
                                <input type="text" className="question-input" id={`${this.props.id}-B`} value={this.state.B} readOnly />
                                :
                                <input type="text" className="question-input color" id={`${this.props.id}-B`} value={this.state.B} onChange={this.editB} />
                            }
                        </div>
                        <div className="answer-box">
                            <label>C)</label>
                            {
                                this.state.editMode == false ?
                                <input type="text" className="question-input" id={`${this.props.id}-C`} value={this.state.C} readOnly />
                                :
                                <input type="text" className="question-input color" id={`${this.props.id}-C`} value={this.state.C} onChange={this.editC} />
                            }
                        </div>
                        <div className="answer-box">
                            <label>D)</label>
                            {
                                this.state.editMode == false ?
                                <input type="text" className="question-input" id={`${this.props.id}-D`} value={this.state.D} readOnly />
                                :
                                <input type="text" className="question-input color" id={`${this.props.id}-D`} value={this.state.D} onChange={this.editD} />
                            }
                        </div>
                    </div>
                    <div className="question-box align added">
                        <label>Corrent answer:</label>
                        <div>
                        <Answer data-id="action" answer={this.props.answer} editMode={this.state.editMode} editAnswer={this.editAnswer} />
                        </div>
                    </div>
                    <div className="question-box">
                        <button className="classic-btn" data-id="action" onClick={this.edit}>{this.state.editMode ? 'Save' : 'Edit'}</button>
                    </div>
                </div>
                <button className="del-btn" data-id="action" onClick={() => this.props.removeQuestion(this.props.id)}>&times;</button>
            </div>
        )
    }
}

export default Question;