// Autor: Ognjen Bjeletic 2018/0447
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Title from "../../components/title";

import { useForm } from "react-hook-form";
import NotLogged from "../../components/notlogged";

function ChangePassword() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(null);

  const [passwordGood, setPasswordGood] = useState(0);
  const [newPassGood, setNewPassGood] = useState(0);

  const reg = async (data) => {
    try {
      data.email = sessionStorage.getItem("email");
      setIsLoading(true);

      fetch(process.env.host + "/REST/account/change-pwd.php", {
        method: "POST",
        body: JSON.stringify(data),
      }).then(function (response) {
        const code = response.status;
        if (code === 200) {
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("password", data.new_password);
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      });
    } catch (err) {
      setSuccess(false);
    }
    setIsLoading(false);
  };

  const checkSubmitted = () => {
    var password = window.document.forms.registerform.password.value;
    if (password === "") {
      setPasswordGood(1);
    } else {
      setPasswordGood(0);
    }

    var newPassword = window.document.forms.registerform.new_password.value;
    if (newPassword === "") {
      setNewPassGood(1);
    } else {
      setNewPassGood(0);
    }
  };

  const ISSERVER = typeof window === "undefined";
  let isLogged = false;

  if (!ISSERVER) {
    // Access sessionStorage
    const username = sessionStorage.getItem("email");
    if (username !== null) {
      isLogged = true;
    }
  }

  return isLogged ? (
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
                      <div className="control">
                        <input
                          type="text"
                          name="name"
                          style={{ display: "none" }}
                          ref={register()}
                        />
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
                            disabled={isSuccess !== null}
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label htmlFor="new_password">New Password</label>
                        {newPassGood === 1 && (
                          <label className="has-text-danger">
                            {" <- "}Required field
                          </label>
                        )}
                        <div className={`control has-icons-left`}>
                          <span className="icon is-small is-left">
                            <FontAwesomeIcon icon="unlock-alt"></FontAwesomeIcon>
                          </span>
                          <input
                            className={`input`}
                            type="password"
                            id="new_password"
                            name="new_password"
                            ref={register({ required: true })}
                            disabled={isSuccess !== null}
                          />
                        </div>
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
                        <p className="title is-5">Success!</p>
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
  ) : (
    <div className="container">
      <NotLogged />
    </div>
  );
}

export default ChangePassword;
