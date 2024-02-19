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
        // if there is a time out then the structure changes.this should be generalized
      return response_json["message"];
    };

    return JSON.parse(body);
};