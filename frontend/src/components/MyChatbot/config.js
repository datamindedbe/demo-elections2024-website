import { createChatBotMessage} from 'react-chatbot-kit';
import DecisionsResponse from './widgets/DecisionsResponse';

const config = {
  initialMessages: [createChatBotMessage('geef mij een onderwerp en ik ga op zoek naar overheidsbesluiten die daarop betrekking hebben')],
  botName: 'RegeringsRobot',
  customComponents: {},
  customMessages: {},
  state:{},
  widgets: [{
    widgetName: 'DecisionsResponse',
    widgetFunc: (props) => <DecisionsResponse {...props} />
  }],
}

export default config;