import React, { Component } from 'react';
import Moment from 'moment';
import LineChart from 'react-linechart'
import './glucose.js'
// import Image from './whitecat1.jpg'
import './App.css';
const photo = require('./whitecat1.jpg');

class App extends Component {
  render() {
    return (
      <div className="App">
      <header className="App-header">



      <h1 className="App-title"><img src={photo}/> Feline Diabetes Tracker </h1>

      <button className="login-button">Login</button>
      <button className="logout-button">Logout</button>
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
        <button className="add-button"
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

  delete(recordId){

    fetch('http://localhost:3000/glucose/' + recordId, {
			method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify ({
        glucose: {level: this.state.glucose}
      })

		})
    .then((res) => {

    const newGlucoseLevels = this.state.glucoseLevels.filter((record) => record.id !== recordId);

    this.setState({glucoseLevels: newGlucoseLevels});
    })
  }


  render() {
    return (
      <div><GlucoseTable glucoseLevels={this.state.glucoseLevels}
      deleteRecord={(recordId) => this.delete(recordId)}/>

      <GlucoseChart glucoseLevels={this.state.glucoseLevels}/>
      </div>
  )}
}

class GlucoseTable extends Component {
	render() {
    return(

		<table>
    <thead>
      <tr>
        <th>Glucose Level</th>
        <th>Date</th>
        <th>Time</th>
      </tr>
    </thead>
      <tbody>
			   {this.props.glucoseLevels.map(record => (
				      <tr key={record.id}>
                <td>{record.level} mg/dL
                <button onClick={() => this.props.deleteRecord(record.id)}>Delete</button></td>

                <td>{Moment(record.created_at).format("LL")}</td>
                <td>{Moment(record.created_at).format("LT")}</td>
              </tr>
			       ))}
      </tbody>
		</table>

	)}
}

class GlucoseChart extends Component {
	render() {

    const points = this.props.glucoseLevels.map(record => {
      return {
        x: Moment(record.created_at).format("YYYY-MM-DD"),
        y: record.level
      }
    });


    const data = [
       {
           color: "black",
           points: points,
       }
     ];

    return(
      <LineChart
        width={1400}
        height={400}
        data={data}
        isDate={true}
        interpolate={"Linear"}
        hideXLabel={true}
        hideYLabel={true}
      />


	)}
}

export default App;

//
// either recordId needs to be a prop passed into component (this.props.recordId)
//
// or
//
// needs to be passed as argument to arrow function
