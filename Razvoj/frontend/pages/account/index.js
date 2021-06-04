// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";

import Link from "next/link";
import NotLogged from "../../components/notlogged";

export function SignOut() {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("password");
  location.reload();
  return false;
}

// {
//   "Username": "Pakleni",
//   "Email": "ognjenbjel@protonmail.com",
//   "Bogdinari": 0,
//   "Name": "Registrovan Korisnik",
//   "FloorName": "Siroce",
//   "CostToStay": 0,
//   "CostToNext": 1000
// }

export function Account() {
  const ISSERVER = typeof window === "undefined";

  let isLogged = false;

  let username = null;

  if (!ISSERVER) {
    // Access sessionStorage
    username = sessionStorage.getItem("email");
    if (username !== null) {
      isLogged = true;

      const pass = sessionStorage.getItem("password");

      const data = { email: username, password: pass };

      fetch(window.location.origin + "/REST/account/getUserInfo.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          else return {};
        })
        .then((data) => {
          document.getElementById("cost").innerHTML = `${data.CostToStay}β`;
          document.getElementById("bogdinars").innerHTML = `${data.Bogdinari}β`;
          document.getElementById(
            "ascension"
          ).innerHTML = `Ascend [${data.CostToNext}β]`;

          document.getElementById("floor").innerHTML = data.FloorName;
        });
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
      <button className="button is-primary" id="ascension"></button>
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
                            <th>Bogdinars</th>
                            <th className="has-text-right" id="bogdinars"></th>
                          </tr>
                          <tr>
                            <th>Current Floor</th>
                            <th className="has-text-right" id="floor"></th>
                          </tr>
                          <tr>
                            <th>This weeks Bogdan tax</th>
                            <th className="has-text-right" id="cost"></th>
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

export default Account;
