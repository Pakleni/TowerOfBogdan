// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import ReactDOM from "react-dom";

import Title from "../../components/title";

// const primer = [
//   { Username: "Pakleni", BogdanFloorID: 1983249 },
//   { Username: "Dinca", BogdanFloorID: 4 },
//   { Username: "Mehovic", BogdanFloorID: 3 },
//   { Username: "Pace", BogdanFloorID: 2 },
//   { Username: "David", BogdanFloorID: -1 },
// ];

function Leaderboard() {
  const rows = [];

  const ISSERVER = typeof window === "undefined";

  if (!ISSERVER) {
    fetch(process.env.host + "/REST/getRanking.php", {
      method: "GET",
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else return [];
      })
      .then((data) => {
        const leaders = data;
        leaders.map((x, index) => {
          rows.push(
            <tr key={x.Username}>
              <th>{index + 1}.</th>
              <td>{x.Username}</td>
              <td className="has-text-right">{x.BogdanFloorID}</td>
            </tr>
          );
        });
        ReactDOM.render(rows, document.getElementById("leader-body"));
      });
  }

  return (
    <div className="container">
      <Title title="Leaderboard"></Title>
      <div className="section">
        <h1 className="title is-1 has-text-centered">Tower Rankings</h1>
        <br></br>
        <table className="table is-bordered is-fullwidth">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Username</th>
              <th className="has-text-right">Floor reached</th>
            </tr>
          </thead>
          <tbody id="leader-body"></tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;
