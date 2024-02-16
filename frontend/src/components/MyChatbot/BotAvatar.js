import React from "react";
import BotAvatar from "@site/static/img/robot_avatar.png";

const CoBotAvatar = () => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar">
      <div
        className="react-chatbot-kit-chat-bot-avatar-container"
        style={{ background: "none" }}
      >
        <img alt="BotAvatar" src={BotAvatar} />
      </div>
    </div>
  );
};

export default CoBotAvatar;