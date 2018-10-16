import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SceneRenderer from "./SceneRenderer";

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

    handleFileSelected = ({ image, whiteImage, blackImage }) => {
        this.setState({ image, whiteImage, blackImage });
    };

    render() {
        const { image, whiteImage, blackImage } = this.state;

        return (
            <MuiThemeProvider>
                <div style={styles.container}>
                  {/*This works*/}
                  <SceneRenderer/>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default App;
