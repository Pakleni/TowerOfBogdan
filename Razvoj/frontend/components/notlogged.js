// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Link from "next/link";

export default function NoLogged() {
  return (
    <section>
      <h1 className="title is-1">You are not logged in.</h1>
      <p className="title is-1">
        Log in
        <Link href="/login">
          <a> here</a>
        </Link>
        .
      </p>
    </section>
  );
}
