import Login from './Login';
import Register from './Register';
class Loginscreen extends Component {
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:'',
      loginscreen:[],
      loginmessage:'',
      buttonLabel:'Register',
      isLogin:true
    }
  }
  componentWillMount(){
    var loginscreen=[];
    loginscreen.push(<Login parentContext={this} appContext={this.props.parentContext}/>);
    var loginmessage = "Not registered yet, Register Now";
    this.setState({
                  loginscreen:loginscreen,
                  loginmessage:loginmessage
                    })
  }
  render() {
    return (
      <div className="loginscreen">
        {this.state.loginscreen}
        <div>
          {this.state.loginmessage}
          
            <div>
               <RaisedButton label={this.state.buttonLabel} primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
           </div>

        </div>
      </div>
    );
  }
}
const style = {
  margin: 15,
};
export default Loginscreen;
