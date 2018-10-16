/* globals THREE, requestAnimationFrame */
import React, { Component } from 'react';
import initializeRenderer from './util/initializeRenderer';
import { initializeArToolkit } from './util/arToolkit';

export const sceneRendererFactory = ({ THREE, initializeArToolkit, initializeRenderer, requestAnimationFrame }) => {
    const { Camera, Scene } = THREE;

    function startAnimationLoop(renderer, scene, camera, onRenderFcts, requestAnimationFrame) {
      // render the scene
      onRenderFcts.push(function(){
        renderer.render(scene, camera);
      });
      
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
    
    return class SceneRenderer extends Component {
        componentDidMount() {
            const renderer = this.renderer = initializeRenderer(this.canvas);

            const scene = new Scene();
            const camera = new Camera();
            scene.add(camera);

            const onRenderFcts = [];
            const arToolkitContext = initializeArToolkit(renderer, camera, onRenderFcts);
          
            startAnimationLoop(renderer, scene, camera, onRenderFcts, requestAnimationFrame);
        }

        componentWillUnmount() {
            this.renderer.dispose();
        }

        storeRef = node => {
            this.canvas = node;
        };

        render() {
            return (
                <canvas id="root" ref={this.storeRef} />
            );
        }
    }
};

export default sceneRendererFactory({
    THREE,
    initializeArToolkit,
    initializeRenderer,
    requestAnimationFrame: requestAnimationFrame,
});
