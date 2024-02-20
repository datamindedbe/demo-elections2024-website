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

  queryResponse= () => {
    const message =  this.createChatBotMessage(
      "Laat me even nadenken...",
      {
        widget: "FullRAGResponse",
        withAvatar: true,
      }
    );
    this.addMessageToState(message);
}}

export default ActionProvider;
