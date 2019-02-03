import React from 'react';
import './multiview.css';
import RadioButtons from './RadioButtons.js'

class MultiView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedView: 0,
        };
    }
    changeView = (viewID) => {
        console.log(viewID);
        this.setState({selectedView: viewID});
    }
    render () {
        return (
            <span>
                <RadioButtons
                    optionCount = {this.props.children.length}
                    value = {this.state.selectedView}
                    onClick = {(viewID) => this.changeView(viewID)}
                />
                {this.props.children[this.state.selectedView]}
            </span>
        )
    }
}

export default MultiView;