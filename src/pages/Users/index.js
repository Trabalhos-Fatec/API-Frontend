import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useForm } from "react-hook-form";
import { SplitButton } from 'primereact/splitbutton'
import { confirmDialog } from 'primereact/confirmdialog';
import { Card } from 'primereact/card';
import api from '../../services/api';
import { isAuthenticated, getToken, logout } from "../../services/auth";

export default function SignIn(event) {
  const [listUser, setListUser] = useState();
  const history = useHistory();
  const { register, handleSubmit, setValue, getValues } = useForm({});
  const [displayEdit, setDisplayEdit] = useState(false);
  const [displayDetails, setDisplayDetais] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [objDetail, setObjDetail] = useState();
  const toast = useRef(null);
  const dialogFuncMap = {
    'displayEdit': setDisplayEdit,
    'displayDetails': setDisplayDetais
  }

  function handleLogout() {
    history.push("/profile");
  }

  function onSubmit(json) {
    editSave(json)
  }

  function editSave(json) {
    if (isAuthenticated) {
      api.put('/usuario', json, {
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
    if (isAuthenticated) {
      api.delete(`/usuario/${id}`, {
        Authorization: 'Bearer' + getToken
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
  }

  function loadUserList() {
    if (isAuthenticated) {
      api('/usuario', {
        Authorization: 'Bearer' + getToken
      })
        .then(response => {
          setListUser(response.data);
        })
        .catch((error) => {
          console.log((error))
          toast.current.show({ severity: 'error', summary: 'Erro ao listar usuários', life: 3000 });
        })
    }
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
      <SplitButton label="Detalhes" className="p-button-rounded" onClick={() => detalhar(rowData)} model={actionBodyTemplate(rowData)} ></SplitButton>
    );
  }

  function detalhar(rowData) {
    showModal('displayDetails', "Detalhar", rowData)
    setObjDetail(listUser.find(item => { return item.id == rowData.id }))
  }

  function actionBodyTemplate(rowData) {
    return [
      { label: 'Excluir', command: () => { confirm(rowData) } },
      { label: 'Editar', command: () => showModal('displayEdit', "Editar", rowData) }
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
            <Button className="ml-3" onClick={handleLogout}>
              Voltar
            </Button>
          </div>
          <></>
          <div className="flex-grow-1 flex align-items-center justify-content-center">
            <h1 className="text-blue-900">Usuários do sistema</h1>
          </div>
        </div>
      </header>
      <div class="flex flex-wrap align-items-center justify-content-center card-container yellow-container">
        <div className="col-8">
          <Card>

            <div>
              <Button label="Mostra lista de usuários" className="ml-3" onClick={loadUserList} />
              <Button label="Limpar lista de usuários" className="ml-3" onClick={() => setListUser()} />
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
            <Dialog visible={displayDetails} header={`${modalHeader} Usuário`} style={{ width: '40vw' }} onHide={() => onHide('displayDetails')}>

              <div className="row">
                <div className="col offset-s3 s6">

                  <div className="row">
                    <p htmlFor="Nome">Nome</p>
                    <label> {getValues("nome")}</label>
                  </div>

                  <div className="row">
                    <p htmlFor="Email">E-mail</p>
                    <label> {getValues("dados.email.0.email")}</label>
                  </div>
                  <div className="row">
                    <p htmlFor="Telefone">Telefone</p>
                    <label> {getValues("dados.telefone.0.telefone")}</label>
                  </div>
                  <div className="row">
                    <p htmlFor="Telefone">Telefone</p>
                    <label> {getValues("dados.telefone.0.telefone")}</label>
                  </div>
                  <div className="row">
                    <p htmlFor="Telefone">Telefone</p>
                    <label> {getValues("dados.telefone.0.telefone")}</label>
                  </div>
                  <div className="row">
                    <p htmlFor="Telefone">Telefone</p>
                    <label> {getValues("dados.telefone.0.telefone")}</label>
                  </div>
                </div>
              </div>
            </Dialog>

            <Dialog visible={displayEdit} header={`${modalHeader} Usuário`} style={{ width: '40vw' }} footer={renderFooter('displayEdit')} onHide={() => onHide('displayEdit')}>

              <div className="row">
                <div className="col offset-s3 s6">

                  <div className="row">
                    <p htmlFor="Nome">Nome</p>
                    <InputText  {...register(`nome`)} type="text" />
                  </div>

                  <div className="row">
                    <p htmlFor="Email">E-mail</p>
                    <InputText {...register(`dados.email.0.email`)} type="text" />
                  </div>
                  <div className="row">
                    <p htmlFor="Telefone">Telefone</p>
                    <InputText {...register(`dados.telefone.0.telefone`)} type="text" />
                  </div>

                </div>
              </div>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
}
