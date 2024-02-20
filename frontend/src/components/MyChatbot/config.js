import { createChatBotMessage} from 'react-chatbot-kit';
import DecisionsResponse from './widgets/DecisionsResponse';
import FullRAGResponse from './widgets/FullRAGResponse';
import BotAvatar from "./BotAvatar";

const config = {
  initialMessages: [createChatBotMessage('Ik wil uw vragen over overheidsbesluiten beantwoorden',
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
  },
  {
    widgetName: 'FullRAGResponse',
    widgetFunc: (props) => <FullRAGResponse {...props} />
  },
],
}

export default config;