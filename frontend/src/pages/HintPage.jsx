import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from './404.jsx';
import ServerFacade from '../serverFacade/ServerFacade';

const HintPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHint = async () => {
      const res = await ServerFacade.getHint(id);
      console.log(res);
      if (res.ok) {
        setData(res.body);
      } else {
        setError(true);
      }
    };
    fetchHint();
  }, [id]);


  return (
    <div className="HintPage">
        {error && <NotFound />}
        {!error && <h1>Hint Page</h1>}
        
        {!data && !error && <div>Loading...</div>}
        {data && !error && (
            <div className='mt-4'>
            <h5><strong>Game ID:</strong> {data.gameid}</h5>
            <h5><strong>Hint:</strong> {data.hint}</h5>
            </div>
        )}
    </div>
  );
};

export default HintPage;
