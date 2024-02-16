// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import { queryDecisions } from "@site/src/api";

const DecisionsResponse = props => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  // second last message is the user's message the last message is teh chatbot's initial response
  // if we alter how the chatbot responds, we need to change this
  const latest_message = props.state.messages[props.state.messages.length - 2].message

  useEffect(() => {
    const getDecisions = async () => {
      const response = await queryDecisions(latest_message);
      setDecisions(response);
      setLoading(false);
    };
    getDecisions();
  }, []);

  if (loading) {
    return <div />;
  }

  // check if the response is a string
  if (typeof decisions === "string") {
    // if something went wrong - assume good server side messages
    return (<div className = "react-chatbot-kit-chat-bot-message"> {decisions} </div>)
  }
  
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
export default DecisionsResponse;