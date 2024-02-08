import { queryDecisions } from "@site/src/api";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  };

  addMessageToState = (message) => {
    this.setState((state) => ({
      ...state,
      messages: [...state.messages, message]
    }));
  };

  queryResponse= (query) => {
    queryDecisions(query).then((data) => {
      console.log(data);
      let message = this.createChatBotMessage(
        data.message,
        {
          loading: true,
          terminateLoading: true
        }
      );
      this.addMessageToState(message);
    });
}}

export default ActionProvider;
