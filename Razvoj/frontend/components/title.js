// Autor: Ognjen Bjeletic 2018/0447
import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

Title.propTypes = {
  title: PropTypes.string,
};

export default function Title({ title }) {
  let chosenTitle = "Tower Of Bogdan";

  if (title) chosenTitle = title + " | " + chosenTitle;

  return (
    <Head>
      <link rel="shortcut icon" type="image/x-icon" href="" />
      <title> {chosenTitle} </title>
    </Head>
  );
}
