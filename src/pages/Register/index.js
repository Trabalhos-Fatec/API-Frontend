import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";

import api from "../../services/api";

// Styles
import "./styles.css";

export default function Resgister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState();

  const history = useHistory();

  async function handleRegister(event) {
    event.preventDefault();

    const data = { name, email, password, phone };
    history.push("/");

    // try {
    //   await api.post("/register", data);

    // } catch (err) {
    //   alert("Erro ao cadastrar, tente novamente.", err);
    // }
  }

  return (
    <div className="logon-container">
      <div className="surface-card p-5 shadow-6 border-round">
        <section className="my-4">
          <h1 className="no-underline text-blue-500">Cadastro de usuário</h1>
        </section>

        <form onSubmit={handleRegister}>
          <div className="flex">
            <div className="flex flex-row">
              <div className="col">
                <div className="">
                  <label
                    htmlFor="email"
                    className="block text-800 font-medium mt-5"
                  >
                    Nome
                  </label>
                  <InputText
                    id="username"
                    className="w-full mb-3"
                    placeholder="Nome"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="email"
                    className="block text-800 font-medium mt-3"
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
              </div>
              <div className="col">
                <div className="">
                  <label
                    htmlFor="phone"
                    className="block text-800 font-medium mt-5"
                  >
                    Telefone
                  </label>
                  <InputMask
                    id="phone"
                    mask="(99) 99999-9999"
                    className="w-full mb-3"
                    value={phone}
                    maxlength="12"
                    placeholder="(99) 99999-9999"
                    onChange={(e) => setPhone(e.value)}
                  />
                </div>
                <div className="">
                <label
                    htmlFor="email"
                    className="block text-800 font-medium mt-3"
                  >
                    Senha
                  </label>
                  <InputText
                    id="password"
                    type="password"
                    className="w-full mb-3"
                    placeholder="Senha"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  
                </div>
              </div>
            </div>
          </div>
          <div className="line-height-3 mt-5 text-sm">
            <Button label="Cadastrar" className="w-full" type="submit" />
          </div>
        </form>
        <div className="line-height-3 mt-5 text-sm flex-row-reverse">
            <Link className="no-underline text-blue-500" to="/">
            &#8617;	 Voltar ao início
            </Link>
          </div>
      </div>
    </div>
  );
}
