import React from 'react';
import './toolbox.css';

class Toolbox extends React.Component {
    render () {
        return (
            <ul>
                <li>
                    <button
                        onClick = {() => this.props.onClick("0")}
                    >select</button>
                </li>
                <li><button
                        onClick = {() => this.props.onClick("1")}
                    >move</button></li>
                <li><button
                        onClick = {() => this.props.onClick("2")}
                    >create</button></li>
                <li><button
                        onClick = {() => this.props.onClick("3")}
                    >clear</button></li>
            </ul>
        )
    }
}

export default Toolbox;
