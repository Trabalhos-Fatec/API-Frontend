import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useForm } from "react-hook-form";
import { ToggleButton } from 'primereact/togglebutton';
import { confirmDialog } from 'primereact/confirmdialog';
import { Checkbox } from "primereact/checkbox";
import { Card } from 'primereact/card';
import { useDispatch } from 'react-redux';
import { logout } from "../../feature/userSlice";

import api from '../../services/api';
import { isAuthenticated, getToken, Loggedout } from "../../services/auth";


export default function Profile() {
  const [listUser, setListUser] = useState();
  const { register, handleSubmit, setValue } = useForm({});
  const [displayEdit, setDisplayEdit] = useState(false);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [checkedToggle, setCheckedToggle] = useState(false);
  const [position, setPosition] = useState("center");
  const [checked, setChecked] = useState(false);

  const toast = useRef(null);

  const dialogFuncMap = {
    displayEdit: setDisplayEdit,
    displayBasic: setDisplayBasic
  }

  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/usuario', {
          Authorization: localStorage.getItem("token"),
        })
        .then(response => {
          setListUser(response.data);
        })
        .catch((error) => {
          toast.current.show({ severity: 'error', summary: 'Erro ao listar usuários', life: 3000 });
        })
    } else {
      toast.current.show({ severity: 'error', summary: 'Falha de autenticação', life: 3000 });
    }
  }, [history]);

  const dispatch = useDispatch();
  
  function HandleLogout(e) {
    e.preventDefault();

    dispatch(logout());

    Loggedout();
    history.push("/");
  }

  function onSubmit(json) {
    editSave(json)
  }

  function editSave(json) {
    if (isAuthenticated) {
      api.put(`/usuario`, json,{
          Authorization: 'Bearer' + getToken
      })
        .then(response => {
          loadUserList()
          toast.current.show({ severity: 'success', summary: 'Editado com Sucesso', life: 3000 });
        })
        .catch((error) => {
          console.log((error))
          toast.current.show({ severity: 'error', summary: 'Erro ao editar', life: 3000 });
        })
        .finally(() => {
          onHide('displayEdit')
        })
    }
  }

  function confirm(userData) {
    confirmDialog({
      message: `Certeza que deseja deletar ${userData.nome}`,
      header: 'Deletar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: "Sim",
      rejectLabel: "Não",
      acceptIcon: "pi pi-check p-mr-2",
      rejectIcon: "pi pi-times",
      accept: () => { deleteUser(userData.id) },
      reject: null
    });
  };

  function deleteUser(id) {
    api.delete(`/usuario/${id}`,{
        Authorization: localStorage.getItem("token"),
    })
      .then(response => {
        loadUserList()
        toast.current.show({ severity: 'success', summary: 'Deletado com Sucesso', life: 3000 });
      })
      .catch((error) => {
        if (error.response.data.status === 403)
          toast.current.show({ severity: 'error', summary: 'Sem autorização para isso', life: 3000 });
        toast.current.show({ severity: 'error', summary: 'Erro ao deletar', life: 3000 });
      })
      .finally(() => {
        onHide('displayEdit')
      })
  }

  function loadUserList() {
    api.get('/usuario',{
        Authorization: localStorage.getItem("token"),
    })
      .then(response => {
        setListUser(response.data);
      })
      .catch((error) => {
        toast.current.show({ severity: 'error', summary: 'Erro ao listar usuários', life: 3000 });
      })
  }

  function getProp(data, props) {
    return data[props][0][props]
  }

  function showModal(name, context, rowData) {
    dialogFuncMap[`${name}`](true);
    setModalHeader(context)
    setAtributos(rowData)
  }

  function setAtributos(json) {
    let properties = Object.getOwnPropertyNames(json)
    for (let variavel in properties) {
      let att = properties[variavel]
      setValue(att, json[att])
    }
  }

  function actionTemplate(rowData) {
    return (
      <Button icon="pi pi-external-link" onClick={() => showModal('displayEdit', "Editar", rowData)} ></Button>
    );
  }

  function actionBodyTemplate(rowData) {
    return [
      { label: 'Excluir', icon: 'pi pi-fw pi-trash', command: () => { confirm(rowData) } }
    ];
  }

  function onHide(name) {
    dialogFuncMap[`${name}`](false);
  }

  function renderFooter(name) {
    return (
      <div>
        <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
        <Button label="Confirmar" icon="pi pi-check" onClick={handleSubmit(onSubmit)} autoFocus />
      </div>
    );
  }

  const renderFooterUser = (name) => {
    return (
      <div>
        <Button
          label="Análise 2º Nível"
          className="p-button-warning"
          name="analise_auto"
        />
        <Button
          label="Não Aprovar"
          className="p-button-danger"
          name="analise_auto"
        />
        <Button
          label="Aprovar"
          className="p-button-success"
          name="analise_auto"
        />
      </div>
    );
  };

  const showModalAutomatic = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  return (
    <div className="">
      <Toast ref={toast} />
      <header
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "lightgray",
          borderBottomStyle: "solid",
        }}
        className="py-2 mb-5"
      >
        <div className="flex">
          <div className="flex-none flex align-items-center justify-content-center">
            <Button className="ml-3" onClick={e => HandleLogout(e)}>
              Sair
            </Button>
          </div>
          <></>
          <div className="flex-grow-1 flex align-items-center justify-content-center">
            <h3 className="text-blue-900">Painel de controle</h3>
          </div>
          <div className="flex-none flex align-items-center justify-content-center">
            <Button className="mr-3" onClick={() => { history.push("/users"); }}>
              Usuários
            </Button>
          </div>
        </div>
      </header>

      {/* TABLE */}
      <div>
        <div class="flex flex-wrap align-items-center justify-content-center card-container yellow-container">
          <div className="col-8">
            <Card>
              <div className="mb-4">
                <Button
                  type="button"
                  label="Análise Usuário"
                  name="analise_user"
                  style={{ width: "10rem" }}
                  onClick={() => showModalAutomatic("displayBasic")}
                />
              </div>
              <div>
                {listUser &&
                  <div className="card">
                    <DataTable value={listUser}>
                      <Column field="id" header="ID"></Column>
                      <Column field="nome" header="Nome"></Column>
                      <Column body={(rowData) => getProp(rowData.dados, "email")} header="Email"></Column>
                      <Column body={(rowData) => getProp(rowData.dados, "telefone")} header="Telefone"></Column>
                      <Column body={actionTemplate} style={{ width: '150px' }} header="Ações"></Column>
                    </DataTable>
                  </div>
                }
              </div>
              <Dialog visible={displayEdit} header={`Análise do Usuário`} footer={renderFooterUser('displayEdit')} onHide={() => onHide('displayEdit')}>
                <div className="card">
                  <div>
                    <div className="field my-4">
                      <p htmlFor="Nome">Nome</p>
                      <InputText className="inputfield  w-full mt-2" {...register(`nome`)} type="text" disabled />
                    </div>

                    <div className="field mb-4">
                      <p htmlFor="Email">E-mail</p>
                      <InputText className="inputfield  w-full mt-2" {...register(`dados.email.0.email`)} type="text" disabled />
                    </div>
                    <div className="field mb-4">
                      <p htmlFor="Telefone">Telefone</p>
                      <InputText className="inputfield  w-full mt-2" {...register(`dados.telefone.0.telefone`)} type="text" disabled />
                    </div>

                  </div>
                </div>
              </Dialog>
              <Dialog
                className="max-w-3"
                visible={displayBasic}
                id="header"
                header={
                  <h3> Análise de Cadastro </h3>
                }
                footer={renderFooter("displayBasic")}
                onHide={() => onHide("displayBasic")}
              >
                <p>
                  Processo automatizado para aprovação de cadastros...
                </p>
                <br />
                <div className="flex p-field-checkbox">
                  <Checkbox
                    className="mr-2"
                    inputId="binary"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked)}
                  />
                  <p>
                    Eu autorizo a utilização dos dados cadastrais dos usuários para
                    a verificação automática de cadastro
                  </p>
                </div>
              </Dialog>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
