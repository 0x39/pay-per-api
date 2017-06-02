import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import iotaLogo from './iota.png';
import clientImage from './client.png';
import serviceImage from './service.png';
import Scrollchor from 'react-scrollchor';
import './App.css';
import tangle from './tangle.js';
import demo from './demo.js';

class App extends Component {

  componentDidMount() {
    function tangles() {
      tangle(this.tangle);
      tangle(this.tangle2, '#000000');
      this.tangleHeight = this.tangle.clientHeight;
      this.tangle2.style.top =  - this.tangleHeight + 50 + 'px';
      let scrollTop = window.document.body.scrollTop;
      if (scrollTop > this.tangleHeight - 50) {
        scrollTop = this.tangleHeight - 50;
      }
      this.tangle.style.transform = 'translateY(' + scrollTop / 2 + 'px)';
      this.tangle2.style.transform = 'translateY(' + scrollTop / 2 + 'px)';
    }
    tangles.call(this);
    window.onresize = () => {
      tangles.call(this);
    }
    window.onload = () => {
      const TweenMax = window.TweenMax;
      const Linear = window.Linear;
      TweenMax.to(this.l1, 0.5, {
        'stroke-dashoffset': -9,
        ease: Linear.easeNone,
        repeat: -1,
        yoyo: false,
        repeatDelay: 0
      });
      TweenMax.to(this.l2, 0.5, {
        'stroke-dashoffset': 9,
        ease: Linear.easeNone,
        repeat: -1,
        yoyo: false,
        repeatDelay: 0
      });
      TweenMax.to(this.l3, 0.7, {
        'stroke-dashoffset': 9,
        ease: Linear.easeNone,
        repeat: -1,
        yoyo: false,
        repeatDelay: 0
      });
      TweenMax.to(this.l4, 0.7, {
        'stroke-dashoffset': -9,
        ease: Linear.easeNone,
        repeat: -1,
        yoyo: false,
        repeatDelay: 0
      });
    }

    this.animated = false;

    window.onscroll = () => {
      let scrollTop = window.document.body.scrollTop / 2;
      if (scrollTop < this.tangleHeight - 50) {
        this.tangle.style.transform = 'translateY(' + scrollTop / 2 + 'px)';
        this.tangle2.style.transform = 'translateY(' + scrollTop / 2 + 'px)';
      }
      if (! this.animated) {
        this.entryAnimations();
        this.animated = true;
      }
    }

  }

  entryAnimations() {
    this.howItWorksH3.style.display = 'block';
    this.howItWorksDescription.style.display = 'block';
  }

  render() {

    var self = this;

    function howItWorksEntry(app) {
      self.entryAnimations();
    }

    return (
      <Router>
      <div id="App">
        <div id="App-home">
          <div id="App-home-container">
          <div id="App-header">
            <h2 id="App-title"><span id="App-title-thin">Pay per</span> API</h2>
            <h4 id="App-subtitle">An <span id="App-subtitle-white">IOTA</span> proof of concept</h4>
          </div>
          <div id="App-intro">
            <p id="App-description">IOTA makes it possible to pay per API call on demand,<br /> in real time with no fees.</p>
            <div id="App-buttons">
              <Scrollchor to="#how-it-works"
                          animate={{duration: 500}}
                          afterAnimate={() => howItWorksEntry(this)}
                          className="App-button App-primary-button"
                          ref={(scrollButton) => {this.scrollButton = scrollButton}}>
                How it works
              </Scrollchor>
              <Link to="/demo"
                    className="App-button App-secondary-button"
                    ref={(demoButton) => {this.demoButton = demoButton}}>
                Try the Demo!
              </Link>
            </div>
          </div>
          </div>
          <canvas id="tangle" ref={(tangle) => {this.tangle = tangle}}></canvas>
        </div>
        <Route path="/demo" component={demo} />
        <div id="how-it-works-wrap">
        <canvas id="how-it-works-tangle" ref={(tangle2) => {this.tangle2 = tangle2}}></canvas>
        <div id="how-it-works">
          <h3 className="App-h3" ref={(howItWorksH3) => {this.howItWorksH3 = howItWorksH3}}>How it works</h3>
          <div id="App-how-it-works-description" ref={(howItWorksDescription) => {this.howItWorksDescription = howItWorksDescription}}>
            <div id="App-how-it-works-iota" className="App-how-it-works-section">
              <img src={iotaLogo} id="App-how-it-works-iota-logo" alt="" />
              <h5>IOTA</h5>
              <p>IOTA enables a secure, <b>fee free</b> transaction between the two parties.</p>
            </div>
            <div id="App-how-it-works-client" className="App-how-it-works-section">
              <img src={clientImage} className="App-how-it-works-img" alt="" />
              <h5>Client</h5>
              <p>The client makes an IOTA microtransaction and sends a request to the service.</p>
            </div>
            <div id="App-how-it-works-service" className="App-how-it-works-section">
              <img src={serviceImage} className="App-how-it-works-img" alt="" />
              <h5>Service</h5>
              <p>The service checks the client's transfer and sends back a response.</p>
            </div>

            <svg id="App-how-it-works-dots"
                 version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 xmlnsXlink="http://www.w3.org/1999/xlink"
                 x="0px"
                 y="0px"
                 width="400px"
                 height="300px"
                 viewBox="0 0 100 100"
                 xmlSpace="preserve">
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
                <stop offset="6%" style={{'stopColor': '#51E9D7', 'stopOpacity': 1}} />
                <stop offset="94%" style={{'stopColor': '#1121E8', 'stopOpacity': 1}} />
                <stop offset="100%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
                <stop offset="6%" style={{'stopColor': '#FA591B', 'stopOpacity': 1}} />
                <stop offset="94%" style={{'stopColor': '#FEC604', 'stopOpacity': 1}} />
                <stop offset="100%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
                <stop offset="6%" style={{'stopColor': '#A7F135', 'stopOpacity': 1}} />
                <stop offset="94%" style={{'stopColor': '#08FF00', 'stopOpacity': 1}} />
                <stop offset="100%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
              </linearGradient>
              <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
                <stop offset="6%" style={{'stopColor': '#1121E8', 'stopOpacity': 1}} />
                <stop offset="94%" style={{'stopColor': '#51E9D7', 'stopOpacity': 1}} />
                <stop offset="100%" style={{'stopColor': '#ffffff', 'stopOpacity': 1}} />
              </linearGradient>
              <line id="l1"
                    ref={(l1) => {this.l1 = l1}}
                    strokeDashoffset="0"
                    fill="none"
                    stroke="url(#grad1)"
                    strokeLinecap="round"
                    strokeMiterlimit="4"
                    strokeDasharray="0.2,3"
                    strokeWidth="1"
                    x1="65" y1="5"
                    x2="145" y2="52"/>
              <line id="l2"
                    ref={(l2) => {this.l2 = l2}}
                    strokeDashoffset="0"
                    fill="none"
                    stroke="url(#grad2)"
                    strokeLinecap="round"
                    strokeMiterlimit="4"
                    strokeDasharray="0.2,3"
                    strokeWidth="1"
                    x1="35" y1="5"
                    x2="-45" y2="52"/>
              <line id="l3"
                    ref={(l3) => {this.l3 = l3}}
                    strokeDashoffset="0"
                    fill="none"
                    stroke="url(#grad4)"
                    strokeLinecap="round"
                    strokeMiterlimit="4"
                    strokeDasharray="0.2,3"
                    strokeWidth="1"
                    x1="-24" y1="84.5001"
                    x2="120" y2="84.5"/>
              <line id="l4"
                    ref={(l4) => {this.l4 = l4}}
                    strokeDashoffset="0"
                    fill="none"
                    stroke="url(#grad1)"
                    strokeLinecap="round"
                    strokeMiterlimit="4"
                    strokeDasharray="0.2,3"
                    strokeWidth="1"
                    x1="-24" y1="82.0001"
                    x2="120" y2="82"/>
            </svg>

            <div className="App-how-it-works-indicator" id="App-how-it-works-minus-one">
              <span>-1</span>
            </div>
            <div className="App-how-it-works-indicator" id="App-how-it-works-plus-one">
              <span>+1</span>
            </div>
            <div id="App-how-it-works-response"><span>{'{'}</span> ... <span>{'}'}</span></div>
          </div>
          <Link to="/demo" className="App-button action-button" onClick={(e) => {
              e.stopPropagation();
              e.target.classList.add('fade-button');
              window.document.body.querySelector('#App-footer').style.position = 'fixed';
            }}
                id="howItWorksDemoLink">Try the Demo!</Link>
          <div id="App-footer">
            <span id="App-footer-copy">&copy; 2017 IOTA Foundation.</span>
            <a href="https://iota.org" target="_blank">IOTA.org</a>
            <a href="https://learn.iota.org" target="_blank">IOTA Learn</a>
            <a href="https://dev.iota.org" target="_blank">Developers</a>
            <a href="https://forum.iota.org" target="_blank">Forum</a>
            <a href="https://github.com/iotaledger" target="_blank">Github</a>
            <a href="https://twitter.com/iotatoken" target="_blank">Twitter</a>
            <a href="https://slack.iota.org" target="_blank">Slack</a>
          </div>
        </div>
      </div>
      </div>
      </Router>
    );
  }
}

export default App;
