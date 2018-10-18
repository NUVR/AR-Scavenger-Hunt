/* globals THREE*/

import React from 'react';


const {Camera, Scene, WebGLRenderer} = THREE;

/**
 * Initialize THREE objects that will be used for all children.
 */
export default class ThreeSceneProvider extends React.Component {

  constructor(props) {
    super(props);

    const camera = new Camera();
    const scene = new Scene();
    const renderer = new WebGLRenderer();

    /* Give the Three.js scripts the objects, they return the function to
      calc the animation state at given time */
    const animate = this.props.initFn(this.camera, this.scene, this.renderer);

    this.state = {camera, scene, renderer, animate};
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child => React.cloneElement(child, {...this.state}))

    console.log(childrenWithProps);
    return (
      <div>
        {childrenWithProps}
      </div>
    )
  }
}