/* globals THREE, requestAnimationFrame */
import React, {Component} from 'react';
import {initializeArToolkit} from './util/arToolkit';

export default class SceneRenderer extends Component {

  startAnimationLoop(onRenderFcts) {

    let lastTimeMsec = null;

    function animate(nowMsec) {
      // keep looping
      requestAnimationFrame(animate);

      lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
      const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;

      onRenderFcts.forEach(onRenderFct => {
        onRenderFct(deltaMsec / 1000, nowMsec / 1000);
      });
    }

    requestAnimationFrame(animate);
  }

  componentDidMount() {
    let {camera, renderer, animate} = this.props;

    const onRenderFcts = [animate];
    initializeArToolkit(renderer, camera, onRenderFcts);

    this.startAnimationLoop(onRenderFcts);
  }

  componentWillUnmount() {
    this.renderer.dispose();
  }

  storeRef = node => {
    this.canvas = node;
  };

  render() {
    return (
      <canvas id="root" ref={this.storeRef}/>
    );
  }
}
