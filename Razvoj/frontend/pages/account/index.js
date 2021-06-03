// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";

import Link from "next/link";
import NotLogged from "../../components/notlogged";

function SignOut() {
  sessionStorage.setItem("email", null);
  sessionStorage.setItem("password", null);
}

export default function Account() {
  const ISSERVER = typeof window === "undefined";

  let isLogged = false;

  let username = null;
  let ranking = null;
  let bogdinars = null;
  let ascension = null;
  let floor = null;

  if (!ISSERVER) {
    // Access sessionStorage
    username = sessionStorage.getItem("username");
    if (username !== null) {
      isLogged = true;
      // axios request
    }
  }

  const button = (
    <div>
      <Link href="/buy/bogdinars">
        <button className="button is-warning">Buy Bogdinars</button>
      </Link>
      <br />
      <br />
      <Link href="/buy/vip">
        <button className="button is-info">Upgrade to VIP</button>
      </Link>
      <br />
      <br />
      <button className="button is-primary">{`Ascend [${ascension}β]`}</button>
    </div>
  );
  return (
    <div className="container">
      <Title title="Account"></Title>
      {isLogged ? (
        <section className="hero">
          <div className="hero-body">
            <article className="media">
              <div className="media-content">
                <div className="content">
                  <p
                    className="title is-1-3 has-text-centered-mobile"
                    style={{ marginBottom: "0" }}
                  >
                    <strong>{username}</strong>
                  </p>
                  <article className="media" style={{ borderTop: "none" }}>
                    <div className="media-content">
                      <p className="subtitle">
                        <table>
                          <tr>
                            <th>Leaderboard Pos</th>
                            <th className="has-text-right">{ranking}</th>
                          </tr>
                          <tr>
                            <th>Bogdinars</th>
                            <th className="has-text-right">{bogdinars}β</th>
                          </tr>
                          <tr>
                            <th>Current Floor</th>
                            <th className="has-text-right">{floor}</th>
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
              <Link href="/account/change">
                <button className="button is-info is-light">
                  Change Password
                </button>
              </Link>
            </div>
            <br />
            <button
              className="button button is-danger is-light"
              onClick={SignOut}
            >
              Sign out
            </button>
          </div>
        </section>
      ) : (
        <NotLogged />
      )}
    </div>
  );
}
