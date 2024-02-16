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
      "Ik zal er naar kijken",
      {
        widget: "DecisionsResponse",
        withAvatar: true,
      }
    );
    this.addMessageToState(message);
}}

export default ActionProvider;
