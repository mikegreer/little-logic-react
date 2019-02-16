import React from 'react';
import './levelbutton.css';
import DeleteHold from './DeleteHold.js';

class LevelButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHidden: true,
        }
    }

    showOptions = () => {
        this.setState({isHidden: false})
    }
    render () {
        return (
            <div className="level-button"
                onMouseEnter={() => {this.setState({isHidden: false})}}
                onMouseLeave={() => {this.setState({isHidden: true})}}
            >  
                <span className="label"
                    onClick={() => this.props.loadLevel()}
                >
                    {this.props.levelId}
                </span>
                {!this.state.isHidden &&
                    <div class="options-menu">
                        <DeleteHold
                            deleteSave = {() => this.props.deleteSave()}
                        />
                        <span className="download"
                            onClick={() => this.props.downloadSave()}
                        >
                            download
                        </span>
                    </div>
                }
                
            </div>
        );
    }
}
class LevelList extends React.Component {
    downloadSave = (id) => {
        const JSONlevel = JSON.stringify(this.props.saveFiles[id]);
        const a = document.createElement("a");
        const file = new Blob([JSONlevel], {type: "application/json; charset=utf-8"});
        a.href = URL.createObjectURL(file);
        a.download = "levelSave.json";
        a.click();
    }
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
                        downloadSave={(id) => this.downloadSave(i)}
                    />
                );
            });
        }
        return (
            <span>
                <h4>Saves</h4>
                {levelButtons}
            </span>
        )
    }
}

export default LevelList;
