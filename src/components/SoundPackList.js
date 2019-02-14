import React from 'react';
import classNames from 'classnames';

class SoundPackList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            instruments: [
                {
                    name : 'thunk',
                    file : 'thunk.json',
                },{
                    name : 'vapor',
                    file : 'vapor.json',
                },{
                    name : 'gb',
                    file : 'gb.json',
                }
            ]
        }
    }

    componentDidMount = () => {
        if(this.props.soundPackId === null) {
            this.fetchFile("../instruments/thunk.json", 0);
        }
    }

    fetchFile = (filePath, soundPackId) => {
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
            this.props.loadInstrumentFromFile(data, soundPackId);
        }); 
    }

    render () {
        const instrumentList = [];
        this.state.instruments.forEach((instrument, id) => {
            const path = '../instruments/' + instrument.file;
            instrumentList.push(
                <div 
                    className={classNames({ "selected": this.props.soundPackId === id}, "instrument-list")}
                    key = {id}
                    onClick = {() => this.fetchFile(path, id)}
                >{instrument.name}</div>
            );
        });
        return (
            <span>
                <h4>Sound packs</h4>
                {instrumentList}
            </span>
        )
    }
}

export default SoundPackList;
