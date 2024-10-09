import React, { lazy } from 'react';
import ReactDOM from 'react-dom';
import { Environment, wrapWithEnvironment } from './wrapper';
import { loadChat } from './chat-loader';

const ChatWidget = lazy(() =>
  import(
    /* webpackChunkName: "main-chat-widget" */ '../components/ChatWidget/ChatWidget'
  ).then((module) => ({ default: module.ChatWidget })),
);

export const init = (environment: Environment, chatToken: string) => {
  environment.fedopsLogger.appLoadingPhaseStart('Render');

  ReactDOM.render(
    wrapWithEnvironment(environment)(React.createElement(ChatWidget)),
    document.getElementById('root'),
  );

  loadChat({
    chatToken,
  });
};
