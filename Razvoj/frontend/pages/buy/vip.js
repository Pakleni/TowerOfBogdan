// Autor: Ognjen Bjeletic 2018/0447
import React, { useState } from "react";
import Title from "../../components/title";
import NotLogged from "../../components/notlogged";
import Head from "next/head";

function Buy(stripe, level, errorSetter) {
  const username = sessionStorage.getItem("email");
  const pass = sessionStorage.getItem("password");

  const data = { email: username, password: pass, viplevel: level };

  fetch(process.env.host + "/stripe/checkout-vip.php", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(function (response) {
      if (response.status === 200) return response.json();
      if (response.status === 202)
        return Promise.reject(new Error("Already >= VIP level"));
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
      if (error.message === "Already >= VIP level") errorSetter(true);
      else console.error(error);
    });
}

export default function VipStatus() {
  const [VIPError, setVIPError] = useState(false);

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
      <Title title="Vip Status"></Title>
      <div className="section is-flex is-align-content-center is-flex-direction-column">
        <div className="has-text-centered">
          <h1 className="title is-1-3">Choose Level:</h1>
        </div>
        <div className="is-align-self-center">
          <button
            className="button title is-3-5 is-info"
            onClick={() =>
              // eslint-disable-next-line no-undef
              Buy(Stripe(process.env.stripe), 2, setVIPError)
            }
          >{`VIP Level 1`}</button>
        </div>
        <div className="is-align-self-center">
          <button
            className="button title is-3-5 is-success"
            onClick={() =>
              // eslint-disable-next-line no-undef
              Buy(Stripe(process.env.stripe), 3, setVIPError)
            }
          >{`VIP Level 2`}</button>
        </div>
        <div className="is-align-self-center">
          <button
            className="button title is-3-5 is-danger"
            onClick={() =>
              // eslint-disable-next-line no-undef
              Buy(Stripe(process.env.stripe), 4, setVIPError)
            }
          >{`VIP Level 3`}</button>
        </div>
        {VIPError === true && (
          <div>
            <br />
            <div className="notification is-danger is-light">
              <p className="title is-6">Already at equal or higher VIP level</p>
            </div>
          </div>
        )}
      </div>
      <div className="section">
        <p className="subtitle is-6 has-text-centered-mobile">
          *clicking on an option will take you to the payment page
        </p>
      </div>
      <style jsx>{`
        .button {
          margin-top: 15px;
          width: 200px;
        }
      `}</style>
    </div>
  ) : (
    <div className="container">
      <NotLogged />
    </div>
  );
}
