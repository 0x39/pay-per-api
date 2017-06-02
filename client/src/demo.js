import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import wallet from './wallet-small.png';
import tangle from './tangle.js';
import './demo.css';

const service_url = 'http://localhost:3030';
const gateway_url = 'http://localhost:3001';

class Demo extends Component {

    componentDidMount() {
      tangle(this.tangle, '#000000');
      this.steps = [
        window.document.querySelector('#demo-step-1'),
        window.document.querySelector('#demo-step-2'),
        window.document.querySelector('#demo-step-3')
      ];
      window.document.body.style.overflow = 'hidden';
      this.initAPIState().then(() => {
        const button = window.document.querySelector('#demo-button')
        button.classList.remove('fade-button');
        button.style.display = 'inline-block';
      });
    }

    componentWillUnmount() {
      window.document.body.style.overflow = 'visible';
      window.document.body.querySelector('#howItWorksDemoLink').classList.remove('fade-button');
      window.document.body.querySelector('#App-footer').style.position = 'absolute';
    }

    initAPIState() {
      if (this.state) {
        if ('APIKey' in this.state) {
          return new Promise((resolve) => {
            resolve();
          });
        }
      }
      return new Promise((resolve) => {
        fetch(service_url + '/get_started', {method: 'get', headers: new Headers()}).then((res) => {
          const text = res.text().then((text) => {
            this.state = {
              'APIKey': text,
              'address': res.headers.get('Address'),
              'price': res.headers.get('Price'),
              'tag': res.headers.get('Tag')
            };
            resolve();
          });
        });
      });
    }

    render() {

      const self = this;

      function resetActiveSteps() {
        self.steps[0].classList.remove('active');
        self.steps[1].classList.remove('active');
        self.steps[2].classList.remove('active');
        self.steps[0].classList.remove('done');
        self.steps[1].classList.remove('done');
        self.steps[2].classList.remove('done');
      }

      function updateBalance() {
        const balance  = window.document.querySelector('#balance-value');
        const unit  = window.document.querySelector('#balance-unit');
        balance.style.display = 'none';
        unit.style.display = 'none';
        let value = parseInt(balance.innerText);
        value -= 10;
        if (value <= 0) {
          value = 1000;
        }
        balance.innerText = value.toString();
        balance.classList.add('loaded');
        unit.classList.add('loaded');
        balance.style.display = 'inline-block';
        unit.style.display = 'inline-block';
      }

      function makeRequest() {
        const state = self.state;
        self.tangle.classList.add('loading');
        resetActiveSteps();
        setTimeout(()=> {
          self.steps[0].classList.add('active');
        }, 400);
        const gatewayHeaders = new Headers({
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Address': state.address,
          'Price': state.price,
          'Tag': state.tag
        });
        fetch(gateway_url + '/transfer', {method: 'post', headers: gatewayHeaders}).then((res) => {
          return res.text();
        }).then((hash) => {
          if (hash === '') {
            console.log('Error: IOTA transaction failed.');
          }
          updateBalance();
          self.steps[0].classList.remove('active');
          self.steps[0].classList.add('done');
          self.steps[1].classList.add('active');
          console.log('Tail transaction hash:', hash);
          const serviceHeders = new Headers({
            'Authorization': state.APIKey,
            'Transaction': hash
          });
          fetch(service_url, {method: 'get', headers: serviceHeders}).then((res) => {
            self.setState({
              'address': res.headers.get('Address'),
              'price': res.headers.get('Price'),
              'tag': res.headers.get('Tag')
            });
            return res.text();
          }).then((text) => {
            self.tangle.classList.remove('loading');
            console.log(text);
            self.steps[1].classList.remove('active');
            self.steps[1].classList.add('done');
            self.steps[2].classList.add('done');
            const button = window.document.querySelector('#demo-button');
            button.style.display = 'inline-block';
            button.innerText = 'Try it again!';
            button.classList.remove('fade-button');
          });
        });
      }

      return (
      <div id="demo">
        <header id="demo-header">
          <Link to="/" id="back-to-home"><i className="material-icons">arrow_back</i><span>Home</span></Link>
          <div id="balance">
            <img id="balance-wallet" src={wallet} alt="" />
            Balance:
            <span id="balance-value">1000</span>
            <span id="balance-unit">IOTAs</span>
          </div>
        </header>
        <canvas id="demo-tangle" ref={(canvas) => { this.tangle = canvas; }}></canvas>
        <div id="demo-wrap">
        <div id="demo-main">
          <div id="demo-intro">
            <p>
              This is a simple demo that demonstrates the ability of IOTA to settle transactions per API request.
            </p>
            <div id="demo-stepper">
              <div className="demo-step" id="demo-step-1">
                <div className="demo-step-label"><span>1. <span id="demo-transfer-iota">IOTA</span> transfer</span></div>
                <div className="demo-step-point"></div>
                <div className="demo-step-description">
                  Sending a transfer of <span id="demo-transfer-value" className="demo-step-highlight">10</span> IOTAs...
                </div>
              </div>
              <div className="demo-step" id="demo-step-2">
                <div className="demo-step-label"><span>2. Request</span></div>
                <div className="demo-step-point"></div>
                <div className="demo-step-description">
                  Service validates the transaction...
                </div>
              </div>
              <div className="demo-step" id="demo-step-3">
                <div className="demo-step-label"><span>3. Response</span></div>
                <div className="demo-step-point"></div>
                <div className="demo-step-description">
                  Success!
                </div>
              </div>
              <div id="demo-stepper-bar"></div>
            </div>
            <button id="demo-button" className="App-button action-button fade-button" onClick={(e) => {
                const button = e.target;
                button.classList.add('fade-button');
                setTimeout(() => { button.style.display = 'none'; }, 200);
                makeRequest(button);
              }}>Try it!</button>
          </div>
        </div>
      </div>
      </div>
      );
    }
}

export default Demo;
