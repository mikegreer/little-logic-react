import React from 'react';

class SettingsEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            cols: this.props.cols,
            rows: this.props.rows,
            cellSize: this.props.cellSize,
        }
    }
    incrementCols = () => {
        let cols = this.state.cols;
        cols ++;
        this.setState({ cols : cols });
        this.updateSettings(this.state);
    }

    incrementRows = () => {
        let rows = this.state.rows;
        rows ++;
        this.setState({ rows : rows });
        this.updateSettings(this.state);
    }

    incrementCellSize = () => {
        let cellSize = this.state.cellSize;
        cellSize += 2;
        this.setState({ cellSize : cellSize });
        this.updateSettings(this.state);
    }

    updateSettings = (settings) => {
        this.props.updateSettings(this.state);
    }

    render () {
        return (
            <span>
                <h4>Settings</h4>
                columns: <span onClick = { () => this.incrementCols() } >{this.state.cols}</span><br />
                rows: <span  onClick = { () => this.incrementRows() } >{this.state.rows}</span><br />
                cell size: <span  onClick = { () => this.incrementCellSize() } >{this.state.cellSize}</span>
            </span>
        )
    }
}

export default SettingsEditor;
