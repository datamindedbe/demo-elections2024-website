// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import { queryDecisions } from "@site/src/api";

const DecisionsResponse = props => {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const latest_message = props.state.messages[props.state.messages.length - 2].message // this is the message we want to query

  useEffect(() => {
    const getDecisions = async () => {
      const response = await queryDecisions(latest_message);
      setDecisions(response);
      setLoading(false);
    };
    getDecisions();
  }, []);

  if (loading) {
    return <div></div>;
  }
  // check if the response is a string
  if (typeof decisions === "string") {
    // if something went wrong - replace with a chatbot message
    return (<div> {decisions} </div>)
  }
  
  // only take the title and url of the decisions
  decisions.forEach((decision, index) => {
    decisions[index] = {
      title: decision.title,
      url: decision.decision_url
    }
  });

  return (
    <div>
    {
      decisions.map((decision, index) => {
        return (
          <div key={index}>
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