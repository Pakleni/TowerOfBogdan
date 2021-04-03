// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../components/title";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <Title title="Home"></Title>
      <div className="section">
        <h1 className="title is-1 has-text-centered">Tower Of Bogdan</h1>
        <br></br>
        <p className="subtitle is-3 has-text-centered">Best games ever:</p>
        <br></br>
        <div className="columns is-mobile">
          <div className="column">
            <Link href="/twentyone">
              <a className="media">
                <div className="media-content has-text-centered">
                  <p className="image">
                    <img src="/21.png" />
                  </p>
                  <a className="title is-3-5">21</a>
                </div>
              </a>
            </Link>
          </div>
          <div className="column">
            <Link href="/slots">
              <a className="media">
                <div className="media-content has-text-centered">
                  <p className="image">
                    <img src="/slots.png" />
                  </p>
                  <a className="title is-3-5">Slots</a>
                </div>
              </a>
            </Link>
          </div>

          <div className="column">
            <Link href="/roulette">
              <a className="media">
                <div className="media-content has-text-centered">
                  <p className="image">
                    <img src="/roulette.png" />
                  </p>
                  <a className="title is-3-5">Roulette</a>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
