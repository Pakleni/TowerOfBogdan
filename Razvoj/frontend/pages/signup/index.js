// Autor: Ognjen Bjeletic 2018/0447
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Title from "../../components/title";

import { useForm } from "react-hook-form";

function Register() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(null);
  const [errorCode, setErrorCode] = useState(0);
  const [emailGood, setEmailGood] = useState(0);
  const [passwordGood, setPasswordGood] = useState(0);
  const [usernameGood, setUsernameGood] = useState(0);

  // "Email Already Exists" => 201;
  // "Username Already Exists" => 202;
  // "Account was not succesfully created" => 203;
  // "Account was succesfully created" => 200;

  const reg = async (data) => {
    try {
      setIsLoading(true);

      fetch(process.env.host + "/REST/account/register.php", {
        method: "POST",
        body: JSON.stringify(data),
      }).then(function (response) {
        setIsLoading(false);
        const code = response.status;
        setErrorCode(code);
        if (code === 200) {
          setSuccess(true);
        } else if (code === 203) {
          setSuccess(false);
        }
      });
    } catch (err) {
      setSuccess(false);
    }
  };

  const checkSubmitted = () => {
    var email = window.document.forms.registerform.email.value;
    if (email === "") {
      setEmailGood(1);
    } else {
      setEmailGood(0);
    }

    var password = window.document.forms.registerform.password.value;
    if (password === "") {
      setPasswordGood(1);
    } else {
      setPasswordGood(0);
    }

    var username = window.document.forms.registerform.username.value;
    if (username === "") {
      setUsernameGood(1);
    } else {
      setUsernameGood(0);
    }
  };

  return (
    <div>
      <Title />
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-1">Tower Of Bogdan</h1>
            <h2 className="subtitle is-3">Register</h2>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="card">
            <div className="card-content">
              <div className="tile is-ancestor">
                <div className="tile is-parent is-vertical">
                  <div className="tile is-child is-4">
                    <form name="registerform" onSubmit={handleSubmit(reg)}>
                      <div className="field">
                        <label htmlFor="email">Email</label>
                        {emailGood === 1 && (
                          <label className="has-text-danger">
                            {" <- "}Required field
                          </label>
                        )}
                        <div
                          className={`control has-icons-left${
                            errorCode === 201 ? " has-icons-right" : ""
                          }`}
                        >
                          <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="envelope"></FontAwesomeIcon>
                          </span>
                          {errorCode === 201 ? (
                            <span className="icon is-small is-right">
                              <FontAwesomeIcon icon="times"></FontAwesomeIcon>
                            </span>
                          ) : (
                            ""
                          )}
                          <input
                            className={`input${
                              errorCode === 201 ? " is-danger" : ""
                            }`}
                            type="email"
                            id="email"
                            name="email"
                            ref={register({ required: true })}
                            disabled={isSuccess !== null || isLoading}
                          />
                        </div>
                      </div>
                      {errorCode === 201 ? (
                        <div className="notification is-danger">
                          <p>
                            Email already <b>taken</b>.
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="control">
                        <input
                          type="text"
                          name="name"
                          style={{ display: "none" }}
                          ref={register()}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="username">Username</label>
                        {usernameGood === 1 && (
                          <label className="has-text-danger">
                            {" <- "}Required field
                          </label>
                        )}
                        <div
                          className={`control has-icons-left${
                            errorCode === 202 ? " has-icons-right" : ""
                          }`}
                        >
                          <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="user"></FontAwesomeIcon>
                          </span>
                          {errorCode === 202 ? (
                            <span className="icon is-small is-right">
                              <FontAwesomeIcon icon="times"></FontAwesomeIcon>
                            </span>
                          ) : (
                            ""
                          )}
                          <input
                            className={`input${
                              errorCode === 202 ? " is-danger" : ""
                            }`}
                            type="text"
                            id="username"
                            name="username"
                            ref={register({ required: true })}
                            disabled={isSuccess !== null || isLoading}
                          />
                        </div>
                      </div>
                      {errorCode === 202 ? (
                        <div className="notification is-danger">
                          <p>
                            Username already <b>taken</b>.
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="field">
                        <label htmlFor="password">Password</label>
                        {passwordGood === 1 && (
                          <label className="has-text-danger">
                            {" <- "}Required field
                          </label>
                        )}
                        <div className="control has-icons-left">
                          <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="unlock-alt"></FontAwesomeIcon>
                          </span>
                          <input
                            className="input"
                            type="password"
                            id="password"
                            name="password"
                            ref={register({ required: true })}
                            disabled={isSuccess !== null || isLoading}
                          />
                        </div>
                      </div>
                      <div className="control">
                        <button
                          className={`button  ${
                            isLoading ? "is-loading" : null
                          }`}
                          type="submit"
                          disabled={isSuccess !== null || isLoading}
                          onClick={() => checkSubmitted()}
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="tile is-4"></div>
                  <div className="tile is-child is-4">
                    {isSuccess === true && (
                      <div className="notification is-success is-light">
                        <p className="title is-5">
                          Registration successfull <br />
                          <br />
                          Success!
                        </p>
                      </div>
                    )}
                    {isSuccess === false && (
                      <div className="notification is-danger is-light">
                        <p className="title is-5">
                          There was an error. <br />
                          <br /> Please try again later.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;
