import React from 'react';

import './index.css'

const QuestionBox = props => {
    return (
        <div className="question">
            <div className="question-box">
                <h2>{props.question}?</h2>
            </div>
            <div className="question-box">
                <label className="under">A)</label>
                <input type="radio" id={`answer-${props.id}`} name={`answer-${props.id}`} value="A"
                onChange={e => props.setAnswer(props.id, e.target.value)} />
                <label htmlFor={props.A}>{props.A}</label>
            </div>
            <div className="question-box">
                <label className="under">B)</label>
                <input type="radio" id={`answer-${props.id}`} name={`answer-${props.id}`} value="B"
                onChange={e => props.setAnswer(props.id, e.target.value)} />
                <label htmlFor={props.B}>{props.B}</label>
            </div>
            <div className="question-box">
                <label className="under">C)</label>
                <input type="radio" id={`answer-${props.id}`} name={`answer-${props.id}`} value="C"
                onChange={e => props.setAnswer(props.id, e.target.value)} />
                <label htmlFor={props.C}>{props.C}</label>
            </div>
            <div className="question-box">
                <label className="under">D)</label>
                <input type="radio" id={`answer-${props.id}`} name={`answer-${props.id}`} value="D"
                onChange={e => props.setAnswer(props.id, e.target.value)} />
                <label htmlFor={props.D}>{props.D}</label>
            </div>
        </div>
    )
}

export default QuestionBox;