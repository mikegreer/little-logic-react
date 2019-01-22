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
    constructor(props) {
        super(props);
        this.state = {
            levels: JSON.parse(localStorage.getItem('levels')),
        };
    }
    render () {
        const levelButtons = [];
        this.state.levels.forEach((level, i) => {
            levelButtons.push(
                <LevelButton 
                    levelLabel={i}
                    key={i}
                    onClick={(ID) => this.props.onClick(i)}
                />
            );
        });
        return (
            <span>
                {levelButtons}
            </span>
        )
    }
}

export default LevelList;
