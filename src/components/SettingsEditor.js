import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React from 'react';
// import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';


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
    setCols = (value) => {
        this.setState({
            cols: value
        }, () => {
            this.updateSettings(this.state);
        });
    }

    incrementRows = () => {
        let rows = this.state.rows;
        rows ++;
        this.setState({ rows : rows });
        this.updateSettings(this.state);
    }
    setRows = (value) => {
        this.setState({
            rows: value
        }, () => {
            this.updateSettings(this.state);
        });
    }

    updateSettings = (settings) => {
        this.props.updateSettings(this.state);
    }
    
    render () {
        const sliderStyle = {
            backgroundColor: 'rgba(0, 0, 0, .4)',
        };
        const handleStyle = {
            borderColor: 'rgba(0, 0, 0)',
            height: 20,
            width: 20,
            marginLeft: -10,
            marginTop: -8,
            backgroundColor: 'rgb(215, 95, 57)',
        }
        const railStyle = {
            backgroundColor: 'rgba(0, 0, 0, .05)',
            height: 4,
        }
        return (
            <span>
                <h4>Settings</h4>
                columns: <span>{this.state.cols}</span>
                <span className="settings-slider">
                    <Slider
                        min = {0}
                        max = {20}
                        defaultValue = {this.state.cols}
                        onChange = {(value) => this.setCols(value)}
                        trackStyle = {sliderStyle}
                        handleStyle = {handleStyle}
                        railStyle = {railStyle}
                    />
                </span>
                rows: <span>{this.state.rows}</span>
                <span className="settings-slider">
                    <Slider
                        min={0}
                        max={35}
                        defaultValue={this.state.rows}
                        onChange={(value) => this.setRows(value)}
                        trackStyle = {sliderStyle}
                        handleStyle = {handleStyle}
                        railStyle = {railStyle}
                    />
                </span>
                cell size: <span>{this.state.cellSize}</span>
            </span>
        )
    }
}

export default SettingsEditor;
