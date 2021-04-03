// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";

export default function Account() {
  const button = (
    <div>
      <button className="button is-warning">Buy Bogdinars</button>
      <br />
      <br />
      <button className="button is-info">Upgrade to VIP</button>
      <br />
      <br />
      <button className="button button is-primary is-light">{`Ascend [${1000}β]`}</button>
      <br />
      <br />
      <button className="button button is-danger is-light">Sign out</button>
    </div>
  );
  return (
    <div className="container">
      <Title title="Account"></Title>
      <section className="hero">
        <div className="hero-body">
          <article className="media">
            <div className="media-content">
              <div className="content">
                <p
                  className="title is-1-3 has-text-centered-mobile"
                  style={{ marginBottom: "0" }}
                >
                  <strong>Pakleni</strong>
                </p>
                <article className="media" style={{ borderTop: "none" }}>
                  <div className="media-content">
                    <p className="subtitle">
                      <table>
                        <tr>
                          <th>Best Score</th>
                          <th className="has-text-right">1983249</th>
                        </tr>
                        <tr>
                          <th>Leaderboard Pos</th>
                          <th className="has-text-right">1</th>
                        </tr>
                        <tr>
                          <th>Bogdinars</th>
                          <th className="has-text-right">9123β</th>
                        </tr>
                        <tr>
                          <th>Current Floor</th>
                          <th className="has-text-right">9999999</th>
                        </tr>
                        <tr>
                          <th>Current Boglimit</th>
                          <th className="has-text-right">9999999</th>
                        </tr>
                      </table>
                    </p>
                  </div>
                  <div className="media-right is-hidden-mobile">{button}</div>
                </article>
              </div>
            </div>
          </article>
          <hr />
          <p className="title is-3-5"> Account Managment</p>
          <div className="is-hidden-tablet">
            {button} <br />
          </div>
          <div>
            <button className="button">Change Password</button>
          </div>
          <br />
        </div>
      </section>
    </div>
  );
}