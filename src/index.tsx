import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './api-integration/index';
import './i18n/i18n';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITEKEY_V3 || ''}
          container={{ // optional to render inside custom element
            element: document.getElementById('reCaptchaContainer') || undefined,
            parameters: {
              badge: 'bottomleft',
            }

          }}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: "head",
            nonce: undefined
          }}
        >
          <App />
        </GoogleReCaptchaProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
