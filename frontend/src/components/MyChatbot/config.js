import { createChatBotMessage} from 'react-chatbot-kit';
import DecisionsResponse from './widgets/DecisionsResponse';
import BotAvatar from "./BotAvatar";

const config = {
  initialMessages: [createChatBotMessage('geef mij een onderwerp en ik ga op zoek naar overheidsbesluiten die daarop betrekking hebben',
  {
    withAvatar: true,
  })
  ],
  botName: 'RegeringsRobot',
  customComponents: { botAvatar: (props) => <BotAvatar {...props} /> },
  customMessages: {},
  state:{},
  widgets: [{
    widgetName: 'DecisionsResponse',
    widgetFunc: (props) => <DecisionsResponse {...props} />
  }],
}

export default config;