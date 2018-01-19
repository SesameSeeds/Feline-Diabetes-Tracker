import React, { Component } from 'react';
import Moment from 'moment';
import LineChart from 'react-linechart'
import './glucose.js'
// import logo from './logo.svg';

import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
      <header className="App-header">

      <h1 className="App-title">Feline Diabetes Tracker</h1>
      </header>
      <p className="App-intro">
      Welcome to the Feline Diabetes Tracker!
      </p>
      <GlucoseInput/>
      <GlucoseView/>
      </div>
    );
  }
}

class GlucoseInput extends Component {

  constructor() {
    super();
    this.state = {
      glucose: 0
    }
  }

  render() {
    return (
      <div>
        Add Glucose Level!
        <input
          type="number"
          onChange={(event) => {
            this.setState({glucose: event.target.value})
          }
        }
        value={this.state.glucose}
        />
        <button
          onClick={() => {
            console.log(this.state);
            fetch('http://localhost:3000/glucose', {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify ({
                glucose: {level: this.state.glucose}
              })

            })
          }}
        >Add!</button>
      </div>
    )
  }
}

class GlucoseView extends Component {

	constructor() {
    super();
		this.state = { glucoseLevels: [] };
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {

		fetch('http://localhost:3000/glucose', {
			method: 'GET'
		})
		.then((res) => {
      return res.json();
    })
		.then((data => this.setState({ glucoseLevels: data })))
	}

  render() {
    return (
      <div><GlucoseTable glucoseLevels={this.state.glucoseLevels}/>
      <GlucoseChart glucoseChart={this.state.glucoseLevels}/>
      </div>

  )}
}

class GlucoseTable extends Component {
	render() {
    return(

		<table>
    <thead>
      <tr>
        <th>Glucose</th>
        <th>Date/Time</th>
      </tr>
    </thead>
      <tbody>
			   {this.props.glucoseLevels.map(record => (
				      <tr key={record.id}>
                <td>{record.level}</td>
                <td>{Moment(record.created_at).format("LLLL")}</td>
              </tr>
			       ))}
      </tbody>
		</table>

	)}
}

class GlucoseChart extends Component {
	render() {
    return(
      <p>This is a Chart</p>


	)}
}


export default App;

// Login and logout separate form for component
// import axios in components that I'm calling from main component
