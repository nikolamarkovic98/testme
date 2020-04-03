import React from 'react';

/*
const Answer = props => {
    if(!props.editMode){
        return(
            <select id={`${props.id}-answer`} onChange={(e) => props.editAnswer(e.target.value)}>
                {
                props.answer == 'A' ?
                <option value="A" defaultValue="selected" disabled>A</option>
                :
                <option value="A" disabled>A</option>
                }
                {
                props.answer == 'B' ? 
                <option value="B" selected="selected" disabled>B</option>
                :
                <option value="B" disabled>B</option>
                }
                {
                props.answer == 'C' ? 
                <option value="C" selected="selected" disabled>C</option>
                :
                <option value="C" disabled>C</option>
                }
                {
                props.answer == 'D' ? 
                <option value="D" selected="selected" disabled>D</option>
                :
                <option value="D" disabled>D</option>
                }
            </select>
        )
    }
    return(
        <select id={`${props.id}-answer`} onChange={(e) => props.editAnswer(e.target.value)}>
            {
            props.answer == 'A' ? 
            <option value="A" selected="selected">A</option>
            :
            <option value="A">A</option>
            }
            {
            props.answer == 'B' ? 
            <option value="B" selected="selected">B</option>
            :
            <option value="B">B</option>
            }
            {
            props.answer == 'C' ? 
            <option value="C" selected="selected">C</option>
            :
            <option value="C">C</option>
            }
            {
            props.answer == 'D' ? 
            <option value="D" selected="selected">D</option>
            :
            <option value="D">D</option>
            }
        </select>
    )
}*/

const Answer = props => {
    if(!props.editMode){
        return(
            <select id={`${props.id}-answer`} defaultValue={props.answer} onChange={(e) => props.editAnswer(e.target.value)}>
                <option value="A" disabled>A</option>
                <option value="B" disabled>B</option>
                <option value="C" disabled>C</option>
                <option value="D" disabled>D</option>
            </select>
        )
    }
    return(
        <select id={`${props.id}-answer`} defaultValue={props.answer} onChange={(e) => props.editAnswer(e.target.value)}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
        </select>
    )
}

export default Answer;