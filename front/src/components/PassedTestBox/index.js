import React from 'react';
import {Link} from 'react-router-dom';
import UserImage from '../TestBox/contact_icon.svg';
import {getDate} from '../../helpers';

const PassedTestBox = props => {
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

    return(
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
                <Link to={`/user/${props.creator.username}`} className="user-panel-box">
                    <p><img className="user-image" src={UserImage} alt="Can't load user image" /></p>
                    <div>
                        <p className="test-creator">{props.creator.username}</p>
                        <p>Created tests: {props.creator.createdTests.length}</p>
                        <p>Passed tests: {props.num_of_passed_tests}</p>
                    </div>
                </Link>
                <div className="user-panel-box">
                    <div></div
                    ><div></div
                    ><div></div>
                </div>
            </div>
            <div className="test-panel">
                {/*<nav>
                    <div>About Test</div>
                    <div>Resources</div>
                </nav>*/}
                <h2>{props.title}</h2>
                <p className="date">{getDate(props.createdAt)}</p>
                <hr />
                <p>Percentage of correct answers: {props.score}</p>
                <p>Test complete duration: {`${props.minutes}:${props.seconds}`}</p>
                {/* grade could be image because why not, and it should be string probably */}
                <p>Grade: {props.grade}</p>
            </div>
        </div>
    )
}

export default PassedTestBox;