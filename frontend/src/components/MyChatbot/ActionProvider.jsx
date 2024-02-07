import { queryDecisions } from "@site/src/api";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }
  queryResponse= (query) => {
    let message = this.createChatBotMessage(
      queryDecisions(query),
      {
        loading: true,
        terminateLoading: true
      }
    );
    this.addMessageToState(message);
  };

  addMessageToState = (message) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message]
    }));
  };
}

export default ActionProvider;
