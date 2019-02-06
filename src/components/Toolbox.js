import React from 'react';
import './toolbox.css';
import classNames from 'classnames';

class Toolbox extends React.Component {
    handleCreateClick = (createId) => {
        this.props.onClick("2");
        console.log(this.props.onClick);
        this.props.setCreateType(createId)
        console.log(createId);
    }

    render () {
        const addElementButtons = [];
        this.props.cellTypes.forEach((type, index) => {
            addElementButtons.push(
                <li key={index}>
                    <button
                        key = {type.label}
                        className={classNames({ "selected": this.props.selected === 2 && type.id === this.props.currentlyAdding})}
                        onClick={(createId)=>this.handleCreateClick(type.id)}
                    >
                        {type.label}
                    </button>
                </li>
            );
        });

        return (
            <ul className="toolbox">
                <li>
                    <button 
                        className={classNames({selected:this.props.selected === 0})}
                        onClick = {() => this.props.onClick("0")}
                    ><span className="hotkey-hint">s</span>elect</button>
                </li>
                <li><button
                        className={classNames({selected:this.props.selected === 1})}
                        onClick = {() => this.props.onClick("1")}
                    ><span className="hotkey-hint">m</span>ove</button></li>
                {addElementButtons}
                <li><button
                        className={classNames({selected:this.props.selected === 3})}
                        onClick = {() => this.props.onClick("3")}
                    ><span className="hotkey-hint">c</span>lear</button></li>
            </ul>
        )
    }
}

export default Toolbox;