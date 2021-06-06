// Autor: Ognjen Bjeletic 2018/0447
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Title from "../../components/title";

import { useForm } from "react-hook-form";

function Login() {
  const router = useRouter();

  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(null);
  const [emailGood, setEmailGood] = useState(0);
  const [passwordGood, setPasswordGood] = useState(0);

  // OK => 200

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

      fetch(process.env.host + "/REST/account/login.php", {
        method: "POST",
        body: JSON.stringify(data),
      }).then(function (response) {
        setIsLoading(false);
        const code = response.status;
        if (code === 200) {
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("password", data.password);
          router.push("/");
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      });
    } catch (err) {
      setSuccess(false);
    }
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
                        {emailGood === 1 && (
                          <label className="has-text-danger">
                            {" <- "}Required field
                          </label>
                        )}
                        <div
                          className={`control has-icons-left
                          }`}
                        >
                          <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="envelope"></FontAwesomeIcon>
                          </span>
                          <input
                            className="input"
                            type="email"
                            id="email"
                            name="email"
                            ref={register({ required: true })}
                            disabled={isSuccess !== null || isLoading}
                          />
                        </div>
                      </div>
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
