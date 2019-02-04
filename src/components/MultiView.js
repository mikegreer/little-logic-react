import React from 'react';
import './multiview.css';
import RadioButtons from './RadioButtons.js'

class MultiView extends React.Component {
    changeView = (viewID) => {
        this.props.onClick(viewID);
    }
    render () {
        return (
            <span>
                <RadioButtons
                    optionCount = {this.props.children.length}
                    value = {this.props.selectedView}
                    onClick = {(viewID) => this.changeView(viewID)}
                />
                {this.props.children[this.props.selectedView]}
            </span>
        )
    }
}

export default MultiView;