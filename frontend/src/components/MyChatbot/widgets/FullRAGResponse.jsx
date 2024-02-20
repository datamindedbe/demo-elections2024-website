// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import { queryRAG } from "@site/src/api";

const FullRAGResponse = props => {
  const [rag_response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  // second last message is the user's message the last message is teh chatbot's initial response
  // if we alter how the chatbot responds, we need to change this
  const latest_message = props.state.messages[props.state.messages.length - 2].message

  useEffect(() => {
    const getRAG = async () => {
      const response = await queryRAG(latest_message);
      setResponse(response);
      setLoading(false);
    };
    getRAG();
  }, []);

  if (loading) {
    return <div />;
  }

  // check if the response is a string
  if (typeof rag_response === "string") {
    // if something went wrong - assume good server side messages
    return (<div className = "react-chatbot-kit-chat-bot-message"> {rag_response} </div>)
  }

  console.log(rag_response);
  
  const response_part = rag_response['response'];
  const decisions = rag_response['decisions'];


  decisions.forEach((decision, index) => {
      decisions[index] = {
        title: decision.title,
        url: decision.decision_url
      }
  });

  // use a display message of "Link broken" if the title or url is null
  decisions.forEach((decision, index) => {
    if (decision.title === null || decision.url === null) {
      decisions[index] = {
        title: "link niet beschikbaar",
        url: null
      }
    }
  });

// shorten the title if the title is too long
  decisions.forEach((decision, index) => {
    if (decision.title.length > 40) {
      decisions[index] = {
        title: decision.title.substring(0, 40) + "...",
        url: decision.url
      }
    }
  });

// append the index to the title
  decisions.forEach((decision, index) => {
    decisions[index] = {
      title: "[" + index + "]: " + decision.title,
      url: decision.url
    }
  });


  return (
    <div>
        <div class = "margined-decisions react-chatbot-kit-chat-bot-message">
            {response_part}
        </div>
        <div class = "react-chatbot-kit-chat-bot-message references-color">
          <b>Referenties:</b>
        {
          decisions.map((decision, index) => {
              return (
              <div class = "margined-decisions" key={index}>
                  <a href={decision.url}>
                  {decision.title}
                  </a>
              </div>
          )})
        }
       </div>
    </div>
  )
  }
export default FullRAGResponse;