// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Title from "../components/title";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <Title title="Home"></Title>
      <div className="section">
        <div className="tile is-ancestor">
          <div className="tile is-child is-4"></div>
          <div className="tile is-child is-4">
            <div className="notification is-success is-light">
              <p className="title is-4">Purchase successfull!</p>
              <p className="title is-4">
                Thank you!{" "}
                <Link href="/account">
                  <a>{"<- back"}</a>
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
