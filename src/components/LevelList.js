import React from 'react';
import './levelbutton.css';

class LevelButton extends React.Component {
    render () {
        return (
            <div className="level-button"
                onClick={(ID) => this.props.onClick(this.props.levelLabel)}
            >
                {this.props.levelLabel}
            </div>
        );
    }
}
class LevelList extends React.Component {
    // constructor(props) {
        // super(props);
        // this.state = {
        //     levels: JSON.parse(localStorage.getItem('levels')),
        // };
    // }
    render () {
        const levelButtons = [];
        if(this.props.saveFiles){
            this.props.saveFiles.forEach((file, i) => {
                levelButtons.push(
                    <LevelButton 
                        levelLabel={i}
                        key={i}
                        onClick={(ID) => this.props.onClick(i)}
                    />
                );
            });
        }
        return (
            <span>
                <h4>Load</h4>
                {levelButtons}
            </span>
        )
    }
}

export default LevelList;
