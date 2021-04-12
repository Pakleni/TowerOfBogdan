// Autor: Ognjen Bjeletic 2018/0447
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Title from "../../components/title";
import axios from "axios";

import { useForm } from "react-hook-form";

function Login() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(null);
  const [errorCode, setErrorCode] = useState(0);
  const [emailGood, setEmailGood] = useState(0);
  const [passwordGood, setPasswordGood] = useState(0);

  // "Email Doesnt Exist" => 202;
  // "Account was not succesfully created" => 203;
  // "Account was succesfully created" => 204;

  const checkSubmitted = () => {
    var email = window.document.forms.loginform.email.value;
    if (email === "") {
      setEmailGood(1);
    } else {
      setEmailGood(0);
    }

    var password = window.document.forms.loginform.password.value;
    if (password === "") {
      setPasswordGood(1);
    } else {
      setPasswordGood(0);
    }
  };

  const reg = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/login", data, {
        timeout: 60000,
      });
      setErrorCode(response.data);
      if (response.data === 200) {
        setSuccess(true);
      } else if (response.data === 203 || response.data === 204) {
        setSuccess(false);
      }
    } catch (err) {
      setSuccess(false);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Title />
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-1">Tower Of Bogdan</h1>
            <h2 className="subtitle is-3">Login</h2>
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
                    <form name="loginform" onSubmit={handleSubmit(reg)}>
                      <div className="field">
                        <label htmlFor="email">Email</label>
                        {emailGood === 1 ? (
                          <label className="has-text-danger">
                            {" <- "}Required field
                          </label>
                        ) : (
                          <span />
                        )}
                        <div
                          className={`control has-icons-left${
                            errorCode === 202 ? " has-icons-right" : ""
                          }`}
                        >
                          <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="envelope"></FontAwesomeIcon>
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
                            type="email"
                            id="email"
                            name="email"
                            ref={register({ required: true })}
                            disabled={isSuccess !== null}
                          />
                        </div>
                      </div>
                      {errorCode === 202 ? (
                        <div className="notification is-danger">
                          <p>
                            Email doesn&apos;t <b>exist</b>.
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="field">
                        <label htmlFor="password">Password</label>
                        {passwordGood === 1 ? (
                          <label className="has-text-danger">
                            {" <- "}Required field
                          </label>
                        ) : (
                          <span />
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
                            disabled={isSuccess !== null}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label className="checkbox">
                          <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            ref={register()}
                            disabled={isSuccess !== null}
                          />
                          {"  Remember me"}
                        </label>
                      </div>
                      <div className="control">
                        <button
                          className={`button  ${
                            isLoading ? "is-loading" : null
                          }`}
                          type="submit"
                          disabled={isSuccess !== null}
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
                          Login successfull <br />
                          <br />
                          Success!
                        </p>
                      </div>
                    )}
                    {isSuccess === false && (
                      <div className="notification is-danger is-light">
                        <p className="title is-5">
                          There was an error. <br />
                          <br /> Please try again.
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

export default Login;
