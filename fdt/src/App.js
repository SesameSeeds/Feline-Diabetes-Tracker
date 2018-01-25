import React, { Component } from 'react';
import Moment from 'moment';
import LineChart from 'react-linechart';
import './glucose.js';
import './App.css';
const photo = require('./whitecat1.jpg');
const hedwig = require('./Hedwig.png')

class App extends Component {
  render() {
    return (

      <div>
          <header className="App-header">
            <div className="logo">
              <img src={photo} className="logo" alt="Laying Cat Logo"/>

              <h1 className="App-title">Feline Diabetes Tracker </h1>
            </div>

            <div className="logo-two">
              <img src={hedwig} className="hedwig" alt="Hedwig"/>
              <h2 className="welcome">Welcome Hedwig!</h2>
              <h3 className="Logout">Sign Out</h3>
            </div>


          </header>

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
      <div className="glucosecontainer">
      <div className="glucoseviewsection">

        <h3>Update Glucose Level &nbsp;&nbsp;
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
        >Submit</button>
        </h3>
      </div>
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
      <div className="glucosecontainer">
        <div className="glucoseviewsection">
          <GlucoseTable
            glucoseLevels={this.state.glucoseLevels}
            deleteRecord={(recordId) => this.delete(recordId)}
          />
        </div>

        <div className="glucoseviewsection">
          <GlucoseChart
            glucoseLevels={this.state.glucoseLevels}
          />
        </div>
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
        <th></th>
      </tr>
    </thead>
      <tbody>
			   {this.props.glucoseLevels.map(record => (
				      <tr key={record.id}>
                <td>{record.level} mg/dL</td>
                <td>{Moment(record.created_at).format("LL")}</td>
                <td>{Moment(record.created_at).format("LT")}</td>
                <td className="delete-button"><a onClick={() => this.props.deleteRecord(record.id)}>Delete</a></td>
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
        x: Moment(record.created_at).format("x"),
        y: record.level
      }
    });

    const data = [
       {
           color: "#2b9b66",
           points: points,
       }
     ];

    return(

      <LineChart
        width={600}
        height={300}
        data={data}
        xDisplay={x => Moment(x).format('M/DD')}
        interpolate={"Linear"}
        hideXLabel={true}
        hideYLabel={true}
      />


	)}
}

export default App;
