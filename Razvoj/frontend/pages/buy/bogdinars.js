// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";
import NotLogged from "../../components/notlogged";
import Head from "next/head";

function Buy(stripe, amount) {
  const username = sessionStorage.getItem("email");
  const pass = sessionStorage.getItem("password");

  const data = { email: username, password: pass, amount: amount };

  fetch("/stripe/checkout-bogdinars.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
export default function Bogdinars() {
  let isLogged = false;

  const ISSERVER = typeof window === "undefined";

  if (!ISSERVER) {
    // Access sessionStorage
    const username = sessionStorage.getItem("email");
    if (username !== null) {
      isLogged = true;
    }
  }
  return isLogged ? (
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
            className="button title is-3-5 is-info"
            onClick={() =>
              // eslint-disable-next-line no-undef
              Buy(Stripe(process.env.host), 1000)
            }
          >{`${1000}β`}</button>
        </div>
        <div className="is-align-self-center">
          <button
            className="button title is-3-5 is-success"
            onClick={() =>
              // eslint-disable-next-line no-undef
              Buy(Stripe(process.env.host), 5000)
            }
          >{`${5000}β`}</button>
        </div>
        <div className="is-align-self-center">
          <button
            className="button title is-3-5 is-warning"
            onClick={() =>
              // eslint-disable-next-line no-undef
              Buy(Stripe(process.env.host), 10000)
            }
          >{`${10000}β`}</button>
        </div>
        <div className="is-align-self-center">
          <button
            className="button title is-3-5 is-danger"
            onClick={() =>
              // eslint-disable-next-line no-undef
              Buy(Stripe(process.env.host), 50000)
            }
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
