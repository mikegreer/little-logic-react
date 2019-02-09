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
                <span className="download"
                    onClick={() => this.props.downloadSave()}
                >
                    download
                </span>
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
                <h4>Load</h4>
                {levelButtons}
            </span>
        )
    }
}

export default LevelList;
