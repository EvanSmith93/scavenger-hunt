import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ServerFacade from "../serverFacade/ServerFacade";

const AllHints = () => {
  const [hints, setHints] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHints = async () => {
      const response = await ServerFacade.getAllHints();
      console.log(response);
      if (response.ok) {
        setHints(response.body);
      } else {
        setError(true);
      }
    };
    fetchHints();
  }, []);

  useEffect(() => {
    console.log(hints);
  }, [hints]);
  return (
    <div className="all-hints">
      <h1>All Hints</h1>
      {error && <div>Error</div>}
      {!error && !hints && <div>Loading...</div>}
      {!error &&
        hints &&
        hints.map((hint) => (
          <div className="card mx-auto w-50 m-3" key={hint["_id"]}>
            <div className="card-body">
              <h5 className="card-title">{hint.game}</h5>
              <p className="card-text">{hint.hint}</p>
              <Link to={`/hint/${hint.id}`} className="btn btn-primary">
                View Hint
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllHints;
