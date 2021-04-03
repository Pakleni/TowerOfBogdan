// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";

const leaders = [
  { user: "Pakleni", points: 1983249 },
  { user: "Dinca", points: 4 },
  { user: "Mehovic", points: 3 },
  { user: "Pace", points: 2 },
  { user: "David", points: -1 },
];

export default function Leaderboard() {
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

          <tbody>
            {leaders.map((x, index) => {
              return (
                <tr key={x.user}>
                  <th>{index + 1}.</th>
                  <td>{x.user}</td>
                  <td className="has-text-right">{x.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
