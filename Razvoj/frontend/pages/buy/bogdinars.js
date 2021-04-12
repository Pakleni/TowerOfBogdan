// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";

export default function Bogdinars() {
  return (
    <div className="container">
      <Title title="Bogdinars"></Title>
      <div className="section is-flex is-align-content-center is-flex-direction-column">
        <div className="has-text-centered">
          <h1 className="title is-1-3">Choose Amount:</h1>
        </div>
        <div className="is-align-self-center">
          <button className="button title is-3-5 is-info">{`${1000}β`}</button>
        </div>
        <div className="is-align-self-center">
          <button className="button title is-3-5 is-success">{`${5000}β`}</button>
        </div>
        <div className="is-align-self-center">
          <button className="button title is-3-5 is-warning">{`${10000}β`}</button>
        </div>
        <div className="is-align-self-center">
          <button className="button title is-3-5 is-danger">{`${50000}β`}</button>
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
  );
}
