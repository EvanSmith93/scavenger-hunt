// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import ServerFacade from '../serverFacade/ServerFacade';


// const AllHints = () => {
//     const [hints, setHints] = useState([]);
//     const [error, setError] = useState(false);

//     useEffect(() => {
//         const fetchHints = async () => {
//             const response = ServerFacade.getAllHints();
//             /*await fetch('http://localhost:3000/all-hints', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 timeout: 5000,
//                 mode: 'cors',
//             });*/
//             if (response.ok) {
//                 const data = await response.json();
//                 setHints(data);
//             } else {
//                 setError(true);
//             }
//         };
//         fetchHints();
//     }, []);
//     return ( 
//         <div className="all-hints">
//             <h1>All Hints</h1>
//             {error && <div>Error</div>}
//             {!error && !hints && <div>Loading...</div>}
//             {!error && hints && (
//                 hints.map((hint) => (
//                     <div className="card mx-auto w-50 m-3" key={hint['_id']}>
//                         <div className="card-body">
//                             <h5 className="card-title">{hint.game}</h5>
//                             <p className="card-text">{hint.hint}</p>
//                             <Link to={`/${hint['_id']}`} className="btn btn-primary">View Hint</Link>
//                         </div>
//                     </div>
//                 ))
//             )}
//         </div>
//      );
// }
 
// export default AllHints;