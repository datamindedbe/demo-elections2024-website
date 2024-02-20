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
        decision_url: decision.decision_url
      }
  });

  // use a display message of "Link broken" if the title or url is null
  decisions.forEach((decision, index) => {
    if (decision.title === null || decision.decision_url === null) {
      decisions[index] = {
        title: "link niet beschikbaar",
        decision_url: null
      }
    }
  });

// shorten the title if the title is too long
  decisions.forEach((decision, index) => {
    if (decision.title.length > 40) {
      decisions[index] = {
        title: decision.title.substring(0, 40) + "...",
        decision_url: decision.decision_url
      }
    }
  });

// create a display name with the index
  decisions.forEach((decision, index) => {
    decisions[index] = {
      title_display: "[" + index + "]: " + decision.title,
      decision_url: decision.decision_url,
      title: decision.title

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
                  <a href={decision.decision_url}>
                  {decision.title_display}
                  </a>
              </div>
          )})
        }
       </div>
    </div>
  )
  }
export default FullRAGResponse;