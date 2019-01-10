import React from 'react';
import classNames from 'classnames';

class ToolboxCreate extends React.Component {
    render () {
        const buttons = [];
        this.props.cellTypes.forEach((type, index) => {
            buttons.push(
                <li key={index}>
                    <button
                        key = {type.label}
                        className={classNames({ "selected": type.id === this.props.currentlyAdding}, "editor-button")}
                        onClick={()=>this.props.onClick(type.id)}
                    >
                        {type.label}
                    </button>
                </li>
            );
        });
        return(
            <div
                className={
                    classNames({hidden: this.props.hidden, "create-menu":true})
                }
            >
                {/* <p style={{textAlign: "center"}}>create</p> */}
                <ul className="toolbox">{buttons}</ul>
            </div>
        );
    }
}

export default ToolboxCreate;