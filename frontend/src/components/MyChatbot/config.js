import { createChatBotMessage} from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage('geef mij een onderwerp en ik ga op zoek naar overheidsbesluiten die daarop betrekking hebben')],
  botName: 'RegeringsRobot',
  customComponents: {},
  CustomMessages: {},
  state:{},
  widgets: [],
}

export default config;