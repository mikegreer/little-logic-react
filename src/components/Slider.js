/* usage ex */
// class LayoutToggle extends React.Component {
//     render () {
//         return (
//             <span className="layout-edit-toggle">
//                 Editing layout
//                 <Slider
//                     isChecked = {this.props.editingLevel}
//                     onClick = {() => this.props.onClick()}
//                 ></Slider>
//             </span>
//         );
//     }
// }

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
