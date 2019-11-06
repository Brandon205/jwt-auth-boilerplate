import React from 'react';
import Signup from './Signup';
import Login from './Login';
import './App.css';
import Axios from 'axios';

class App extends React.Component {
  state = { 
    token: '',
    user: null,
    errorMessage: '',
    lockedResult: ''
  }

  checkForLocalToken = () => {
    // Look in LS for localtoken
    let token = localStorage.getItem('mernToken');
    if (!token || token === 'undefined') {
      // if no taken, remove all evidence of mernToken from LS and state
      localStorage.removeItem('mernToken');
      this.setState({ token: '', user: null });
    } else {
      // if token, verify token on backend 
      Axios.post('/auth/me/from/token', { token })
      .then(res => {
        if (res.data.type === 'error') {
          localStorage.removeItem('mernToken');
          this.setState({ token: '', user: null, errorMessage: res.data.message });
        } else {
          // if verified store it back in LS and state
          localStorage.setItem('mernToken', res.data.token);
          this.setState({ token: res.data.token });
        }
      })
    }
  }

  componentDidMount = () => {
    this.checkForLocalToken()
  }

  liftToken = ({token, user}) => {
    this.setState({ token, user });
  }

  logout = () => {
    localStorage.removeItem('mernToken');
    this.setState({ token: '', user: null });
  }

  handleClick = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${this.state.token}`
      }
    }
    Axios.get('/locked/test', config).then(res => {
      this.setState({ lockedResult: res.data });
    });
  };

  render() { 
    let contents;
    if (this.state.user) {
      contents = (
        <>
          <p>Hello, {this.state.user.name} </p>
          <button onClick={this.handleClick}>Test protected route</button>
          <button onClick={this.logout}>Logout</button>
          <p>{this.state.lockedResult}</p>
        </>
      )
    } else {
      contents = (
        <>
          <Signup liftToken={this.liftToken} />
          <Login liftToken={this.liftToken} />
        </>
      )
    }

    return ( 
      <div className="App">
        <header>
          <h1>Welcome to my site!</h1>
        </header>
        <div className="content-box">
          {contents}
        </div>
      </div>
    );
  }
}

export default App;
