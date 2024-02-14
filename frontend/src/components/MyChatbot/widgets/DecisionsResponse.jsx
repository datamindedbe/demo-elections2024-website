// new file called DogPicture.jsx
import React, { useEffect, useState } from 'react';
import { queryDecisions } from "@site/src/api";

const DecisionsResponse = props => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const latest_message = props.state.messages[props.state.messages.length - 2].message // this is the message we want to query

  useEffect(() => {
    const getStats = async () => {
      const response = await queryDecisions(latest_message);
      setStats(response);
      setLoading(false);
    };
    getStats();
  }, []);

  return (
    <div className="stats">
      {JSON.stringify(stats)}
    </div>
  );
};

export default DecisionsResponse;