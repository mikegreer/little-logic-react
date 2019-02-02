import React from 'react';
import './levelbutton.css';

class LevelButton extends React.Component {
    render () {
        return (
            <div className="level-button">  
                <span className="label"
                    onClick={() => this.props.loadLevel()}
                >
                    {this.props.levelId}
                </span>
                <span className="delete"
                    onClick={() => this.props.deleteSave()}
                >
                    x
                </span>
            </div>
        );
    }
}
class LevelList extends React.Component {
    render () {
        const levelButtons = [];
        if(this.props.saveFiles){
            this.props.saveFiles.forEach((file, i) => {
                levelButtons.push(
                    <LevelButton 
                        levelId={i}
                        key={i}
                        loadLevel={(id) => this.props.loadLevel(i)}
                        deleteSave={(id) => this.props.deleteSave(i)}
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
