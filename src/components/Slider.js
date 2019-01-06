import React from 'react';
import './slider.css';

class Slider extends React.Component {
    render () {
        return (
            <label className="switch">
                <input 
                    type = "checkbox"
                    onChange = {() => this.props.onClick()}
                    checked = {this.props.isChecked}
                />
                <span className="slider round"></span>
            </label>
        )
    }
}

export default Slider;
