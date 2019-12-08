import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import * as firebase from "firebase";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changed_prices: {},
      error:'',
      login_key:''
    };
  }

  componentDidMount = () => {};
  
  login = (text) =>
  {
      const {login_key} = this.state;
      if(login_key === '')
      {
          return;
      }
    try{
    let ref = firebase.database().ref('pallete/'+login_key);
    ref.on("value", snapshot => {
      let key = snapshot.val();
      if(key)
      {
        localStorage.setItem('auth', 'bine');
        this.props.permitAccess();
      }
      else
      {
          this.setState({
              error:'Gresit'
          });
      }
    }).then((error)=>{
        if(error)
        {
            this.setState({
                error:'Gresit'
            });
        }
    });
}
catch(error){
    this.setState({
        error:'Gresit'
    });
}
  }


  render() {
    return (
      <div className="login_page">
          
        <div className="ui form login_form">
        <div className="text_error">{this.state.error}</div>
          <div className="field">
            <label> Cheie VIP de acces</label>
            <input 
                value={this.state.login_key}
                onChange={(e)=>{this.setState({login_key:e.target.value})}}
                placeholder="Aici se scrie acea cheie..." />
          </div>
          <button 
          onClick={this.login}
          type="submit" className="ui button">
            Submit
          </button>
        </div>
      </div>
    );
  }
}
export default Login;
