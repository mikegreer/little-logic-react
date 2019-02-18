import React from 'react';
import './deleteafterhold.css';
import classNames from 'classnames';

class DeleteAfterHold extends React.Component {
    constructor(props) {
    	super(props);
        let deleteTimer = null;
        this.state = {
            holding: false,
        }
    }
    startHold = () => {
        console.log('hold started');
        this.deleteTimer = window.setTimeout(() => {
            console.log('deleted!');
            //callback that button had been pressed
            this.props.deleteSave();
        }, 1000);

        this.setState({holding: true});
        window.setTimeout(() => {
            this.setState({holding: false});
        }, 1000);
    }
    stopHold = () => {
        // this.setState({holding: false});
        clearTimeout(this.deleteTimer);
    }

    render() {
        return (
            <span className="delete-hold-container">
                <span className = {classNames("delete-hold-prompt", {"show-delete-hold-prompt" : this.state.holding})}>hold to delete</span>
                <span 
                    className = "delete-hold"
                    onMouseDown = {() => this.startHold()}
                    onMouseUp = {() => this.stopHold()}
                >
                    × delete
                </span>
            </span>
        );
    }
}

export default DeleteAfterHold;