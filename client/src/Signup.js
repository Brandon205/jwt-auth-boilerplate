import React from 'react';
import Axios from 'axios';

class Signup extends React.Component {
  state = { 
    name: '',
    email: '',
    password: '',
    message: ''
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('/auth/signup', {name: this.state.name, email: this.state.email, password: this.state.password})
    .then(res => {
      if (res.data.type === 'error') {
        // TODO: Maybe put this message in state
        console.log(`Error: ${res.data.message}`);
      } else {
        localStorage.setItem('mernToken', res.data.token)
        this.props.liftToken(res.data)
      }
    }).catch(err => console.log(err));
  }

  render() { 
    return ( 
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="name" onChange={this.handleChange} value={this.state.name} placeholder="Name" /><br/>
          <input type="text" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email" /><br/>
          <input type="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" />
          <input type="submit" value="Sign Up"/>
        </form>
      </div>
    );
  }
}

export default Signup;