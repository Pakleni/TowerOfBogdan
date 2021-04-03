// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import Link from "next/link";

const links = [
  { href: "/twentyone", label: "21" },
  { href: "/slots", label: "Slots" },
  { href: "/roulette", label: "Roulette" },
  { href: "/leaderboard", label: "Tower Ranking" },
  { href: "/account", label: "Account Page" },
  { href: "/signup", label: "Sign Up" },
  { href: "/login", label: "Login" },
].map((link) => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}));

const contacts = [
  {
    href: "mailto: ognjenbjel@protonmail.com",
    label: "ognjenbjel@protonmail.com",
  },
].map((link) => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}));

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="columns is-multiline">
          <div className="column is-one-quarter-desktop">
            <ul>
              <li className="title">Links</li>

              {links.map((x) => {
                return (
                  <li key={x.key}>
                    <Link href={x.href}>
                      <a>{x.label}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="column is-one-quarter-desktop">
            <ul>
              <li className="title">Contact us</li>
              {contacts.map((x) => {
                return (
                  <li key={x.key}>
                    <Link href={x.href}>
                      <a>{x.label}</a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <br />
      <br className="is-hidden-desktop" />
      <a href="" target="_blank" rel="noopener noreferrer">
        <div className="media center-horizontally">
          <div className="media-left">
            <figure className="icon logo">
              <img src="" />
            </figure>
          </div>
          <div className="media-content">
            <p className="text-center">Made by Bogdani™</p>
          </div>
        </div>
      </a>
    </footer>
  );
};

export default Footer;
