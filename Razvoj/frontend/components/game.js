// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import PropTypes from "prop-types";

import Link from "next/link";
import Title from "./title";
import NotLogged from "./notlogged";

Game.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default function Game({ title, src }) {
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
      <Title title={title}></Title>
      <div className="section">
        <article className="media">
          <div className="media-content">
            <h1 className="title is-1-3">Tower Of Bogdan</h1>
            <h2 className="subtitle is-3-5">{title}</h2>
          </div>
          <div className="media-right">
            <Link href="/buy/bogdinars">
              <button className="button is-warning title is-3-5">
                Buy Bogdinars
              </button>
            </Link>
            <br />
          </div>
        </article>
        <iframe
          style={{
            display: "block",
            borderStyle: "none",
            margin: "0 auto",
          }}
          width="1280px"
          height="725px"
          src={src}
        />
        <p className="title is-6">
          Don&apos;t have an account? Register{" "}
          <Link href="/signup">
            <a>Here</a>
          </Link>
          .
        </p>
      </div>
    </div>
  ) : (
    <div className="container">
      <NotLogged />
    </div>
  );
}
