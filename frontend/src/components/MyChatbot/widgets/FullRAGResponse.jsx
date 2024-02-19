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

  return (
    <div>
        <div class = "margined-decisions react-chatbot-kit-chat-bot-message">
            {response_part}
        </div>
        {
         decisions.map((decision, index) => {
            return (
            <div class = "margined-decisions react-chatbot-kit-chat-bot-message" key={index}>
                <a href={decision.url}>
                {decision.title}
                </a>
            </div>
         )
      })
    }
    </div>
  )

  // only take the title and url of the decisions
  decisions.forEach((decision, index) => {
    decisions[index] = {
      title: decision.title,
      url: decision.decision_url
    }
  });

  // filter out deciions with no title
  const decisions_filtered = decisions.filter((decision) => {
    return decision.title !== null
  })

  return (
    <div>
    {
      decisions_filtered.map((decision, index) => {
        return (
          <div class = "margined-decisions react-chatbot-kit-chat-bot-message" key={index}>
            <a href={decision.url}>
              {decision.title}
            </a>
         </div>
         )
      })
    }
    </div>
  )
  }
export default FullRAGResponse;