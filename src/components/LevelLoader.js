import React from 'react';

class LevelLoader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            levels: [
                {
                    name : 'Buzz Kill',
                    file : 'level1.json',
                },{
                    name : 'Buzz Kill redux',
                    file : 'level2.json',
                },{
                    name : 'Jetison',
                    file : 'level3.json',
                },{
                    name : 'Jetison complete',
                    file : 'level4.json',
                }
            ]
        }
    }

    fetchFile = (filePath) => {
        console.log(filePath);
        fetch(filePath, {
            method: "GET",
            dataType: "JSON",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            }
        })
        .then((resp) => {
            return resp.json()
        }).then((data) => {
            this.props.loadLevelFromFile(data);
        }); 
    }

    loadLevel = (data) => {
        this.props.loadLevelFromFile(data)
    }

    render () {
        const levelList = [];
        this.state.levels.forEach((level, id) => {
            const path = '../levels/' + level.file;
            console.log(path);
            levelList.push(
                <div 
                    className = "level-list"
                    key = {id}
                    onClick = {() => this.fetchFile(path)}
                >{level.name}</div>
            );
        });
        return (
            <span>
                {levelList}
            </span>
        )
    }
}

export default LevelLoader;
