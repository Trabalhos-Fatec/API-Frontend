import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"
import { useDispatch } from 'react-redux';
import { login } from "../../feature/userSlice";
import axios from "axios";
import api from '../../services/api';

import "./styles.css";

export default function SignIn(event) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const toast = useRef();

  const dispatch = useDispatch();

  async function handleSignIn(event) {
    event.preventDefault();

    const loggedIn = dispatch(login({
      email: email,
      password: password,
    }))

    api.get('/login', loggedIn.payload).then(function (response) {
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        history.push("/profile");
      } else {
        toast.current.show({ severity: 'error', summary: 'Erro!', detail: 'E-mail ou senha incorretos' });
      }
    }).catch(function (error) {
      toast.current.show({ severity: 'error', summary: 'Erro!', detail: 'E-mail ou senha incorretos' });
    })
  }

  return (
    <div className="logon-container">
      <div className="surface-card p-5 shadow-6 border-round lg:w-6">
        <Toast ref={toast} />
        <section className="">
          <form onSubmit={handleSignIn}>

            <div className="mt-2">
              <label
                htmlFor="email"
                className="block text-800 font-medium mb-2"
              >
                E-mail
              </label>
              <InputText
                id="email"
                className="w-full mb-3"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <br />
            <div>
              <label
                htmlFor="email"
                className="block text-800 font-medium mb-2"
              >
                Senha
              </label>
              <InputText
                id="password"
                className="w-full mb-3"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <br />
            <div className="flex justify-content-center">
              <Button
                label="Entrar"
                className="w-full"
                type="submit"
              />
            </div>
            <div className="line-height-3 mt-5 text-sm">
              <span className="text-500 font-medium line-height-3">
                Você não tem uma conta?
              </span>
              &nbsp;&nbsp;
              <Link className="no-underline text-blue-500" to="/register">
                Crie uma conta!
              </Link>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
