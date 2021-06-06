// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";
import NotLogged from "../../components/notlogged";
import Head from "next/head";

class Bogdinars extends React.Component {
  constructor() {
    super();
    this.state = {
      isLogged: true,
      loading: 0,
    };
  }

  componentDidMount() {
    const username = sessionStorage.getItem("email");

    if (username === null) {
      this.setState({ isLogged: false });
    }
  }

  Buy(stripe, amount) {
    const username = sessionStorage.getItem("email");
    const pass = sessionStorage.getItem("password");

    const data = { email: username, password: pass, amount: amount };

    fetch(process.env.host + "/stripe/checkout-bogdinars.php", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (response.status === 200) return response.json();
        else return Promise.reject(new Error("Request rejected!"));
      })
      .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }

  render() {
    return this.state.isLogged ? (
      <div className="container">
        <Head>
          <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
          <script src="https://js.stripe.com/v3/"></script>
        </Head>
        <Title title="Bogdinars"></Title>
        <div className="section is-flex is-align-content-center is-flex-direction-column">
          <div className="has-text-centered">
            <h1 className="title is-1-3">Choose Amount:</h1>
          </div>
          <div className="is-align-self-center">
            <button
              className={`button title is-3-5 is-info ${
                this.state.loading === 1 ? "is-loading" : ""
              }`}
              onClick={() => {
                this.setState({ loading: 1 });
                // eslint-disable-next-line no-undef
                this.Buy(Stripe(process.env.stripe), 1000);
              }}
              disabled={this.state.loading !== 0}
            >{`${1000}β`}</button>
          </div>
          <div className="is-align-self-center">
            <button
              className={`button title is-3-5 is-success ${
                this.state.loading === 2 ? "is-loading" : ""
              }`}
              onClick={() => {
                this.setState({ loading: 2 });
                // eslint-disable-next-line no-undef
                this.Buy(Stripe(process.env.stripe), 5000);
              }}
              disabled={this.state.loading !== 0}
            >{`${5000}β`}</button>
          </div>
          <div className="is-align-self-center">
            <button
              className={`button title is-3-5 is-warning ${
                this.state.loading === 3 ? "is-loading" : ""
              }`}
              onClick={() => {
                this.setState({ loading: 3 });
                // eslint-disable-next-line no-undef
                this.Buy(Stripe(process.env.stripe), 10000);
              }}
              disabled={this.state.loading !== 0}
            >{`${10000}β`}</button>
          </div>
          <div className="is-align-self-center">
            <button
              className={`button title is-3-5 is-danger ${
                this.state.loading === 4 ? "is-loading" : ""
              }`}
              onClick={() => {
                this.setState({ loading: 4 });
                // eslint-disable-next-line no-undef
                this.Buy(Stripe(process.env.stripe), 50000);
              }}
              disabled={this.state.loading !== 0}
            >{`${50000}β`}</button>
          </div>
        </div>
        <div className="section">
          <p className="subtitle is-6 has-text-centered-mobile">
            *clicking on an option will take you to the payment page
          </p>
        </div>
        <style jsx>{`
          .button {
            margin-top: 15px;
            width: 150px;
          }
        `}</style>
      </div>
    ) : (
      <div className="container">
        <NotLogged />
      </div>
    );
  }
}

export default Bogdinars;
