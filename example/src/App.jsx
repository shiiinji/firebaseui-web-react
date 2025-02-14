/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// React core.
import React from 'react';
import ReactDOM from 'react-dom';

// Firebase.
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from '../../dist/StyledFirebaseAuth';

// Styles
import styles from './app.css'; // This uses CSS modules.
import './firebaseui-styling.global.css'; // Import globally.

// Get the Firebase config from the auto generated file.
const firebaseConfig = require('./firebase-config.json').result.sdkConfig;

// Instantiate a Firebase app.
const firebaseApp = initializeApp(firebaseConfig);

/**
 * The Splash Page containing the login UI.
 */
class App extends React.Component {
  auth = getAuth(firebaseApp)

  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  state = {
    isSignedIn: undefined,
  };

  /**
   * @inheritDoc
   */
  componentDidMount() {
    this.unregisterAuthObserver = onAuthStateChanged(this.auth, (user) => {
      this.setState({isSignedIn: !!user});
    });
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  /**
   * @inheritDoc
   */
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.logo}>
          <i className={styles.logoIcon + ' material-icons'}>photo</i> My App
        </div>
        <div className={styles.caption}>This is a cool demo app</div>
        {this.state.isSignedIn !== undefined && !this.state.isSignedIn &&
          <div>
            <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={this.uiConfig}
                                firebaseAuth={this.auth}/>
          </div>
        }
        {this.state.isSignedIn &&
          <div className={styles.signedIn}>
            Hello {this.auth.currentUser.displayName}. You are now signed In!
            <a className={styles.button} onClick={() => signOut(this.auth)}>Sign-out</a>
          </div>
        }
      </div>
    );
  }
}

// Load the app in the browser.
ReactDOM.render(<App/>, document.getElementById('app'));
