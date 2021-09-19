import React, { useState, useEffect, useRef} from "react";
import { Link, useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast"
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import axios from 'axios'
import api from "../../services/api";

// Styles
import "./styles.css";
import { func } from "prop-types";

export default function Resgister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState();
  const [fingerprint, setFingerprint] = useState("");
  const [components, setComponents] = useState("");

  const toast = useRef();

  const history = useHistory();

  useEffect(() => {
    const fpPromise = FingerprintJS.load()

      ; (async () => {
        const fp = await fpPromise
        const result = await fp.get()

        setFingerprint(result.visitorId)
        setComponents(JSON.stringify(result))
      })()

  }, []);

  async function handleRegister(event) {
    event.preventDefault();

    const data = {
      "nome": name,
      "senha": password,
      "fingerprint": fingerprint,
      "components": components,
      "autorizacao": [{ "nome": "ROLE_USER" }],
      "dados": {
        "telefone": [{ phone }],
        "email": [{ email }],
      }
    };
    console.log(data)
    axios({
      timeout: 500,
      method: 'post',
      url: 'http://localhost:8080/usuario/',
      data: data
    })
      .then(function (response) {
        history.push("/")
      }).catch((error) => {
        toast.current.show({severity: 'error', summary: 'Erro!', detail: 'Falha ao contatar o servidor'});
      })
    //  history.push("/");

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
        <Toast ref={toast} />
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
                    required
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
                    required
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
                    mask="(99) 9999-9999?9"
                    className="w-full mb-3"
                    required
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
                    required
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
