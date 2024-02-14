class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }
  
    parse(query) {
      console.log(query);
      return this.actionProvider.queryResponse(query);
    }
  }
  
  export default MessageParser;