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
    const [hideBot, toggleBot] = React.useState(true);
    const hiddenChat = hideBot ? "chatbot-hidden" : "chatbot-visible";
    const hiddenButton = !hideBot ? "chatbot-button-hidden" : "chatbot-button-visible";

    return (
      <div className="app-chatbot-container ">
          <Fade big className={hiddenChat}>
            <div className="floating-chatbot" >
            <button
             className="close-chatbot-button"
             onClick={() => toggleBot((prev) => !prev)}
            >
            <div>X</div>
          </button>
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          </Fade>
        <div>
        <div className={hiddenButton}>
          <button
            className="app-chatbot-button"
            onClick={() => toggleBot((prev) => !prev)}
          >
            <img src={robot} alt="chatbot" />
          </button>
        </div>
        </div>
      </div>
    );
  }

export default MyChatbot;