import React, { Component } from 'react';
import Vector from './geometry'

class Dots extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(Tween)
    TweenMax.to(this.l1, 0.2, {
      'stroke-dashoffset':  9,
      ease: Linear.easeNone,
      repeat: -1,
      yoyo: false,
      repeatDelay: 0
    });
    TweenMax.to(this.l2, 0.2, {
      'stroke-dashoffset': -9,
      ease: Linear.easeNone,
      repeat: -1,
      yoyo: false,
      repeatDelay: 0
    });
  }

  render() {
    return (
      <svg id={this.props.id}
           version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           xmlns:xlink="http://www.w3.org/1999/xlink"
           x="0px"
           y="0px"
	         width="100px"
           height="100px"
           viewBox="0 0 100 100"
           xml:space="preserve">
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        </linearGradient>
        <line id="t"
              ref={(l1) => {this.l1 = l1}}
              stroke-dashoffset="0"
              fill="none" stroke="url(#grad1)"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-dasharray="1,8"
              stroke-width="4"
              x1="0" y1="0"
              x2="100" y2="100"/>
        <line id="r"
              ref={(l2) => {this.l2 = l2}}
              stroke-dashoffset="0"
              fill="none"
              stroke="url(#grad2)"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-dasharray="1,8"
              stroke-width="4"
              x1="10" y1="0"
              x2="110" y2="100"/>
      </svg>

    );
  }

}

export default Dots;
