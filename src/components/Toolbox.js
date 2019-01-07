import React from 'react';
import './toolbox.css';
import classNames from 'classnames';

class Toolbox extends React.Component {
    render () {
        return (
            <ul className="toolbox">
                <li>
                    <button 
                        className={classNames({selected:this.props.selected === 0})}
                        onClick = {() => this.props.onClick("0")}
                    >select</button>
                </li>
                <li><button
                        className={classNames({selected:this.props.selected === 1})}
                        onClick = {() => this.props.onClick("1")}
                    >move</button></li>
                <li><button
                        className={classNames({selected:this.props.selected === 2})}
                        onClick = {() => this.props.onClick("2")}
                    >create</button></li>
                <li><button
                        className={classNames({selected:this.props.selected === 3})}
                        onClick = {() => this.props.onClick("3")}
                    >clear</button></li>
            </ul>
        )
    }
}

export default Toolbox;
