import React from 'react';
import {Fade} from "react-awesome-reveal";
import Chatbot from 'react-chatbot-kit';
import config from './config.js';
import MessageParser from './MessageParser.jsx';
import ActionProvider from './ActionProvider.jsx';
import 'react-chatbot-kit/build/main.css'
import './MyChatbot.css';
import robot from  "@site/static/img/robot_white.png";

const MyChatbot = () => {
    const [showBot, toggleBot] = React.useState(false);
  
    return (
      <div className="app-chatbot-container ">
        {showBot && (
          <Fade big>
            <div className="floating-chatbot">
            <button
            onClick={() => toggleBot((prev) => !prev)}
            >
            <div>close</div>
          </button>
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          </Fade>
        )}
        {!showBot && (
        <div>
          <button
            className="app-chatbot-button"
            onClick={() => toggleBot((prev) => !prev)}
          >
            <img src={robot} alt="chatbot" />
          </button>
        </div>
        )}
      </div>
    );
  }

export default MyChatbot;