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
//   "Bogdinari": 19496,
//   "VipName": "VIP 3",
//   "FloorNumber": 4,
//   "FloorName": "Macka",
//   "CostToStay": 23000,
//   "CostToNext": 806764
// }

class Account extends React.Component {
  constructor() {
    super();
    this.state = {
      isLogged: true,
      ascendError: false,
      ascendLoading: false,
      username: null,
      password: null,
      cost: "",
      bogdinars: "",
      ascension: "",
      floor: "",
      level: "",
      lastFloor: false,
    };
  }

  componentDidMount() {
    const username = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    if (username !== null) {
      this.LoadResources(username, password);

      this.setState({ username: username, password: password });
    } else {
      this.setState({ isLogged: false });
    }
  }

  Ascend() {
    this.setState({ ascendLoading: true });

    const username = sessionStorage.getItem("email");
    const pass = sessionStorage.getItem("password");

    const data = { email: username, password: pass };

    fetch(process.env.host + "/REST/account/ascend.php", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.status === 200)
        this.LoadResources(this.state.username, this.state.password);

      this.setState({
        ascendLoading: false,
        ascendError: response.status !== 200,
      });
    });
  }

  LoadResources(username, password) {
    const loading = "loading...";
    this.setState({
      ascendLoading: true,
      cost: loading,
      bogdinars: loading,
      ascension: loading,
      floor: loading,
      level: loading,
    });

    const data = { email: username, password: password };

    fetch(process.env.host + "/REST/account/getUserInfo.php", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else return {};
      })
      .then((data) => {
        this.setState({
          ascendLoading: false,
          cost: `${data.CostToStay}β`,
          bogdinars: `${data.Bogdinari}β`,
          ascension: `Ascend [${data.CostToNext}β]`,
          floor: `${data.FloorName}[${data.FloorNumber}]`,
          level: data.VipName,
          lastFloor: data.CostToNext === null,
        });

        this.setState({ ascendLoading: false });
      });
  }

  render() {
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
        <button
          className={`button is-primary ${
            this.state.ascendLoading ? "is-loading" : ""
          }`}
          onClick={() => this.Ascend()}
          disabled={
            this.state.lastFloor ||
            this.state.ascendLoading ||
            this.state.ascendError
          }
        >
          {!this.state.lastFloor ? this.state.ascension : "Last floor"}
        </button>
        {this.state.ascendError === true && (
          <div>
            <br />
            <div className="notification is-danger is-light">
              <p className="title is-6">Ascension failed</p>
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div className="container">
        <Title title="Account"></Title>
        {this.state.isLogged ? (
          <section className="hero">
            <div className="hero-body">
              <article className="media">
                <div className="media-content">
                  <div className="content">
                    <p
                      className="title is-1-3 has-text-centered-mobile"
                      style={{ marginBottom: "0" }}
                    >
                      <strong>{this.state.username}</strong>
                    </p>
                    <article className="media" style={{ borderTop: "none" }}>
                      <div className="media-content">
                        <p className="subtitle">
                          <table>
                            <tr>
                              <th>Account Level</th>
                              <th className="has-text-right">
                                {this.state.level}
                              </th>
                            </tr>
                            <tr>
                              <th>Bogdinars</th>
                              <th className="has-text-right">
                                {this.state.bogdinars}
                              </th>
                            </tr>
                            <tr>
                              <th>Current Floor</th>
                              <th className="has-text-right">
                                {this.state.floor}
                              </th>
                            </tr>
                            <tr>
                              <th>This weeks Bogdan tax</th>
                              <th className="has-text-right">
                                {this.state.cost}
                              </th>
                            </tr>
                          </table>
                        </p>
                      </div>
                      <div className="media-right is-hidden-mobile">
                        {button}
                      </div>
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
}

export default Account;
