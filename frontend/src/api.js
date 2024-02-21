export const queryDecisions = async (message) => {
    // the api key here is not sensitive as it is gets passed to the public frontend -> it is secured by being rate limited / quoted in
    // the backend
    // however a cleaner solution should be found which takes the configuration out of the code

    let data = await fetch('https://l9zclxjcv7.execute-api.eu-central-1.amazonaws.com/dev/Decisions'+ '?query=' + message,
    { method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'GoyQ3lFfGN3TvZUsnwjGAaTz9Bx3GRWp9Ohj5vs7'},
        parameters: {'query': message}})
    let response_json =  await data.json();
    console.log(response_json);
    return JSON.parse(response_json['body']);
  };


export const queryRAG = async (message) => {
    let data = await fetch('https://l9zclxjcv7.execute-api.eu-central-1.amazonaws.com/dev/FullRAG'+ '?query=' + message,
    { method: 'GET',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'GoyQ3lFfGN3TvZUsnwjGAaTz9Bx3GRWp9Ohj5vs7'},
        parameters: {'query': message}})
    let response_json =  await data.json();
    console.log(response_json);

    var body = response_json["body"];
    if(body === undefined) {
      // this indicates an error state. this code is greatly in need of refactoring


      if (response_json["message"] === "Endpoint request timed out") {
        // special case for errors which could be translated in the lambda (gateway level)
        return "Ik kon niet snel genoeg antwoorden, het kan zijn dat ik overbelast ben";
      }

      if (response_json["message"] === "Limit Exceeded") {
        // special case for errors which could be translated in the lambda (gateway level)
        return "Ik heb vandaag te veel vragen beantwoord. Probeer het morgen opnieuw";
      }
      
      return response_json["message"];
    };

    return JSON.parse(body);
};