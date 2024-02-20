import { createChatBotMessage} from 'react-chatbot-kit';
import DecisionsResponse from './widgets/DecisionsResponse';
import FullRAGResponse from './widgets/FullRAGResponse';
import BotAvatar from "./BotAvatar";

const config = {
  initialMessages: [createChatBotMessage('Ik beantwoord al uw vragen over de beslissingen van de Vlaamse overheid.',
  {
    withAvatar: true,
  })
  ],
  botName: 'Regeringsrobot',
  customComponents: { 
    botAvatar: (props) => <BotAvatar {...props} />,
    header: () => <div class="react-chatbot-kit-chat-header">Chat met de Regeringsrobot</div>
  },
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