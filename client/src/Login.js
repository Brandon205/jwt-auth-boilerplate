import React from 'react';
import Axios from 'axios';

class Login extends React.Component {
  state = { 
    email: '',
    password: '',
    message: ''
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('/auth/login', {email: this.state.email, password: this.state.password})
    .then(res => {
      if (res.data.type === 'error') {
        console.log(`Error: ${res.data.message}`);
      } else {
        localStorage.setItem('mernToken', res.data.token);
        this.props.liftToken(res.data);
      }
    }).catch(err => console.log(err)); // Rate limiter catch block
  }

  render() { 
    return ( 
      <div className="App">
        <h2>Log In Here: </h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email" />
          <input type="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" />
          <input type="submit" value="Login"/>
        </form>
      </div>
    );
  }
}

export default Login;
