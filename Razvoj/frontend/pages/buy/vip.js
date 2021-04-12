// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../../components/title";

export default function VipStatus() {
  return (
    <div className="container">
      <Title title="Vip Status"></Title>
      <div className="section is-flex is-align-content-center is-flex-direction-column">
        <div className="has-text-centered">
          <h1 className="title is-1-3">Choose Level:</h1>
        </div>
        <div className="is-align-self-center">
          <button className="button title is-3-5 is-info">{`VIP Level 1`}</button>
        </div>
        <div className="is-align-self-center">
          <button className="button title is-3-5 is-success">{`VIP Level 2`}</button>
        </div>
        <div className="is-align-self-center">
          <button className="button title is-3-5 is-danger">{`VIP Level 3`}</button>
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
          width: 200px;
        }
      `}</style>
    </div>
  );
}
