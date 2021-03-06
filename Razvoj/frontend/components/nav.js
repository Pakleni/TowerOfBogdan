// Autor: Ognjen Bjeletic 2018/0447
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useState } from "react";
import Link from "next/link";

import { SignOut } from "../pages/account/index";

const links = [
  { href: "/twentyone", label: "21" },
  { href: "/slots", label: "Slots" },
  { href: "/roulette", label: "Roulette" },
].map((link) => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}));

const linksAccount = [
  { href: "/signup", label: "Sign Up" },
  { href: "/login", label: "Login" },
].map((link) => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}));

const linksLogged = [
  { href: "/account", label: "Account Page" },
  { href: "/account/change", label: "Change Pass" },
].map((link) => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}));

function Nav() {
  const [isShowing, setShowing] = useState(false);
  const [isDropped, setDropped] = useState(false);
  let isLogged = false;

  const ISSERVER = typeof window === "undefined";

  let username = null;
  if (!ISSERVER) {
    // Access sessionStorage
    username = sessionStorage.getItem("email");
    if (username !== null) {
      isLogged = true;
    }
  }

  return (
    <div>
      <div className="navbar-placeholder"></div>
      <nav className="navbar is-fixed-top">
        <div className="navbar-brand">
          <Link href="/">
            <a className="navbar-item" onClick={() => setShowing(false)}>
              <img height="75" width="75" src="/logo.png" />
            </a>
          </Link>

          <span
            onClick={() => setShowing(!isShowing)}
            role="button"
            className={`navbar-burger burger ${isShowing ? "is-active" : ""}`}
            aria-label="menu"
            aria-expanded="false"
          >
            <span aria-hidden={true} />
            <span aria-hidden={true} />
            <span aria-hidden={true} />
          </span>
        </div>

        <div className={`navbar-menu ${isShowing ? "is-active" : ""}`}>
          <div className="navbar-start">
            {links.map(({ key, href, label }) => (
              <Link key={key} href={href}>
                <a className="navbar-item" onClick={() => setShowing(false)}>
                  <p className="title is-4">{label}</p>
                </a>
              </Link>
            ))}
          </div>
          <div className="navbar-end">
            <Link href="/leaderboard">
              <a className="navbar-item" onClick={() => setShowing(false)}>
                <p className="title is-4">Tower Ranking</p>
              </a>
            </Link>
            <a className="navbar-item">
              <div className={`dropdown ${isDropped ? "is-active" : ""}`}>
                <div className="dropdown-trigger">
                  <button
                    className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu7"
                    onClick={() => setDropped(!isDropped)}
                  >
                    <span style={{ minWidth: "80px" }}>
                      {isLogged ? username : "Account"}
                    </span>
                    <span className="icon is-small">
                      <FontAwesomeIcon
                        icon={`${isDropped ? "angle-up" : "angle-down"}`}
                      ></FontAwesomeIcon>
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu7" role="menu">
                  <div
                    className="dropdown-content"
                    style={{ position: "fixed" }}
                  >
                    {(isLogged ? linksLogged : linksAccount).map(
                      ({ key, href, label }) => (
                        <Link key={key} href={href}>
                          <a
                            className="dropdown-item"
                            onClick={() => {
                              setShowing(false);
                              setDropped(false);
                            }}
                          >
                            <b>{label}</b>
                          </a>
                        </Link>
                      )
                    )}
                    {isLogged ? (
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          SignOut();
                          setShowing(false);
                          setDropped(false);
                        }}
                      >
                        <b>Log out</b>
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
