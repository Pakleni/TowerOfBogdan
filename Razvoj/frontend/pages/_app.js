// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import ErrorPage from "next/error";
import "../css/style.css";

import Nav from "../components/nav";
import Footer from "../components/footer";
import PropTypes from "prop-types";

import { library, config } from "@fortawesome/fontawesome-svg-core";

import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { faUnlockAlt } from "@fortawesome/free-solid-svg-icons/faUnlockAlt";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons/faAngleUp";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
import { faKey } from "@fortawesome/free-solid-svg-icons/faKey";

// fix big icons
config.autoAddCss = false;

library.add(
  // faSearch,
  faUser,
  faEnvelope,
  faUnlockAlt,
  faTimes,
  faAngleDown,
  faAngleUp,
  faKey,
  faArrowUp
);

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

function MyApp({ Component, pageProps }) {
  if (!Component) {
    return (
      <div>
        <Nav />
        <ErrorPage statusCode={404} />
      </div>
    );
  }

  return (
    <div className="app" id="app">
      <div className="app-div">
        <Nav />
        <Component {...pageProps} />
      </div>
      <Footer />
    </div>
  );
}

export default MyApp;
