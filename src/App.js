import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SceneRenderer from './SceneRenderer';
import ThreeSceneProvider from './ThreeSceneProvider';
import api from './api';

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        fontFamily: "'Roboto', sans-serif",
    },
};

class App extends Component {
    state = {
        image: null,
    };

    render() {
        return (
            <MuiThemeProvider>
                <div style={styles.container}>
                  <ThreeSceneProvider initFn={api.scene.get}>
                    <SceneRenderer/>
                  </ThreeSceneProvider>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
