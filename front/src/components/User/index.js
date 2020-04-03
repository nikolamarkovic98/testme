import React from 'react';

import TestList from '../TestList';

import './index.css';
import PassedTestList from '../PassedTestList';
import { sendHTTP } from '../../requests';

class User extends React.Component {
    constructor(props){
        // with function we use useParams and with class this.props.match.params.id
        super(props);
        this.state = {
            id: this.props.match.params.id,
            user: null
        }
    }

    /* componentWillRecieveProps is unsafe... and for some reason it wont even fetch data unless I reload page which sucks */
    componentDidMount = async () => {
        const query = {
            query: `query{user(username:"${this.state.id}"){
                _id firstName lastName username password msg
                createdTests{_id title desc resources creator{username createdTests{ _id }} createdAt} 
                passedTests{_id title grade resources score minutes seconds creator{username createdTests{_id}} createdAt}
            }}`
        }

        const res = await sendHTTP(query);
        if(res === undefined || res === null)
            return;
        if(res.data.user !== undefined){
            if(res.data.user.msg === 'User does not exist')
                return;
            this.setState({user:res.data.user});
        }
    }

    handleSwitch = e => {
        switch(e.target.innerHTML){
            case 'Created tests':
                document.querySelector('#switch-created-tests').classList.add('active');
                document.querySelector('#user-test-list').classList.add('active');
                document.querySelector('#switch-passed-tests').classList.remove('active');
                document.querySelector('#user-passed-tests').classList.remove('active');
                break;
            case 'Passed tests':
                document.querySelector('#switch-created-tests').classList.remove('active');
                document.querySelector('#user-test-list').classList.remove('active');
                document.querySelector('#switch-passed-tests').classList.add('active');
                document.querySelector('#user-passed-tests').classList.add('active');
                break;
            default:
                break;
        }
    }

    render(){
        return (
            <div className="user">
                {
                // I must write it like this because until the response the user object is null and throws error
                this.state.user != null ?
                <div className="content-wrap">
                    <h1>{`${this.state.user.firstName} ${this.state.user.lastName}`}</h1>
                    <div className="tests">
                        <nav>
                            <div className="active" id="switch-created-tests" onClick={this.handleSwitch}>Created tests</div>
                            <div id="switch-passed-tests" onClick={this.handleSwitch}>Passed tests</div>
                        </nav>
                        <div id="user-test-list" className="active">
                            <TestList tests={this.state.user.createdTests} num_of_passedTests={this.state.user.passedTests.length} />
                        </div>
                        <div id="user-passed-tests">
                            <PassedTestList passedTests={this.state.user.passedTests} />
                        </div>
                    </div>
                </div>
                :
                <></>
                }
            </div>
        );
    }
}

export default User;