import React from 'react';
import TestList from '../TestList';
import Landing from '../Landing';

import './index.css';

const Home = props => {
    return (
        <div className="home">
            <Landing />
            <div className="content-wrap">
                <div className="home-wrapper">
                    <TestList tests={props.tests} h1={props.h1} />
                </div>
            </div>
        </div>
    )
}

export default Home;