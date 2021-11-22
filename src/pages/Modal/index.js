import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Checkbox } from "primereact/checkbox";
import { ToggleButton } from "primereact/togglebutton";
import { Card } from "primereact/card";
import "./styles.css";

const Modal = () => {
  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayUser, setDisplayUser] = useState(false);
  const [position, setPosition] = useState("center");
  const [displayPosition, setDisplayPosition] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedToggle, setCheckedToggle] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setNome("Marcos Paulo");
    setEmail("marcospaulo@bol.com");
    setNivel("Usuário Final");
    setStatus("Em Análise");
  });

  const dialogFuncMap = {
    displayBasic: setDisplayBasic,
    displayPosition: setDisplayPosition,
    displayUser: setDisplayUser,
  };

  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <ToggleButton
          onLabel="Automático"
          offLabel="Manual"
          onIcon="pi pi-check"
          offIcon="pi pi-times"
          checked={checkedToggle}
          onChange={(e) => setCheckedToggle(e.value)}
        />
      </div>
    );
  };

  const renderFooterUser = (name) => {
    return (
      <div>
        <Button
          label="Análise 2º Nível"
          className="p-button-rounded p-button-warning"
          name="analise_auto"
        />
        <Button
          label="Não Aprovar"
          className="p-button-rounded p-button-danger"
          name="analise_auto"
        />
        <Button
          label="Aprovar"
          className="p-button-rounded p-button-success"
          name="analise_auto"
        />
      </div>
    );
  };

  return (
    <div className="modal-container">
      <div style={{ justifyContent: "center" }} className="flex">
        <div className="col">
          <Button
            label="Análise Automática"
            name="analise_auto"
            onClick={() => onClick("displayBasic")}
          />
          <Dialog
            id="header"
            header={
              <div
                style={{ fontSize: "40px" }}
                className="p-mb-3 p-text-uppercase"
              >
                Análise de Cadastro
              </div>
            }
            visible={displayBasic}
            style={{ width: "40vw", height: "18vw" }}
            footer={renderFooter("displayBasic")}
            onHide={() => onHide("displayBasic")}
          >
            <p
              style={{
                marginBottom: "40px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Processo automatizado para aprovação de cadastros...
            </p>
            <div className="p-field-checkbox">
              <Checkbox
                style={{ marginRight: "20px" }}
                inputId="binary"
                checked={checked}
                onChange={(e) => setChecked(e.checked)}
              />
              <label style={{ fontWeight: "lighter" }} htmlFor="analise_auto">
                Eu autorizo a utilização dos dados cadastrais dos usuários para
                a verificação automática de cadastro
              </label>
            </div>
          </Dialog>

          <Divider />

          <Button
            type="button"
            label="Análise Usuário"
            name="analise_user"
            style={{ width: "10rem" }}
            onClick={() => onClick("displayUser")}
          />

          <Dialog
            id="header"
            header={
              <div
                style={{ fontSize: "40px" }}
                className="p-mb-3 p-text-uppercase"
              >
                Análise de Cadastro
              </div>
            }
            visible={displayUser}
            style={{ width: "40vw", height: "30vw" }}
            footer={renderFooterUser("displayUser")}
            onHide={() => onHide("displayUser")}
          >
            <p
              style={{
                marginBottom: "40px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Verificação da veracidade dos dados do usuário
            </p>

            <div
              className="surface-card p-5 shadow-7 border-round lg:w-8"
              style={{ width: "35vw", height: "15vw" }}
            >
              <h2
                style={{
                  lineHeight: "1.5",
                  fontWeight: "lighter",
                  marginBottom: "14px",
                }}
              >
                Nome: {nome}
              </h2>
              <h2
                style={{
                  lineHeight: "1.5",
                  fontWeight: "lighter",
                  marginBottom: "14px",
                }}
              >
                Email: {email}
              </h2>
              <h2
                style={{
                  lineHeight: "1.5",
                  fontWeight: "lighter",
                  marginBottom: "14px",
                }}
              >
                Nível de Usuário: {nivel}
              </h2>
              <h2 style={{ lineHeight: "1.5", fontWeight: "lighter" }}>
                Status: {status}
              </h2>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Modal;
