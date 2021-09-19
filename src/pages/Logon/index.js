import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast"
import axios from "axios"

// import api from '../../services/api';

import "./styles.css";
// import { login, hasUser } from "services/auth";

export default function SignIn(event) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const toast = useRef();


  async function handleSignIn(event) {
    event.preventDefault();

    const login = {
      "email":email,
      "senha":password
    };

    axios({
      timeout: 500,
      method: 'post',
      url: 'http://localhost:8080/usuario/login/',
      data: login
    }).then(function (response){
      if(response.data){
        history.push("/profile");
      } else {
        toast.current.show({severity: 'error', summary: 'Erro!', detail: 'E-mail ou senha incorretos'});
      }
    }).catch(function (error){
      toast.current.show({severity: 'error', summary: 'Erro!', detail: 'E-mail ou senha incorretos'});
    })
  }

  //   async function handleSignIn(event) {
  //     event.preventDefault();

  //     if(email.length === 0) return;

  //     if (!email || !password) {
  //       this.setState({ error: "Preencha o campo usuário e senha para continuar!" });
  //     } else {
  //       try {
  //         const response = await api.post("/login", { email, password });

  //         login(response.data.token);
  //         hasUser(response.data.user.name);

  //         props.history.push("/profile");

  //       } catch (err) {
  //         console.log(err);

  //         setError('Houve um problema com o login, verifique suas credenciais.')
  //       }
  //     }
  //   };

  return (
    <div className="logon-container">
      <div className="surface-card p-5 shadow-6 border-round lg:w-6">
      <Toast ref={toast} />
        <section className="">
          <form onSubmit={handleSignIn}>
            {/* {!!error && <p>{error}</p>} */}
            {/* <div className="text-center mb-5">
              <img
                src="https://i.pinimg.com/originals/61/6f/ba/616fba9c30a55bb84b7cd41dd69779e7.png"
                alt="hyper"
                height={50}
                className="mb-3"
              />
            </div> */}

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
