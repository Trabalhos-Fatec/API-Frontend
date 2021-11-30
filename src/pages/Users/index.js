import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from "primereact/inputtext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useForm } from "react-hook-form";
import { SplitButton } from 'primereact/splitbutton'
import { confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider'
import { Card } from 'primereact/card';
import api from '../../services/api';
import { isAuthenticated, getToken, logout } from "../../services/auth";

export default function SignIn(event) {
  const [listUser, setListUser] = useState();
  const [listUserAnalitics, setListUserAnalitics] = useState();
  const history = useHistory();
  const { register, handleSubmit, setValue, getValues } = useForm({});
  const [displayEdit, setDisplayEdit] = useState(false);
  const [displayDetails, setDisplayDetais] = useState(false);
  const [displayCluster, setDisplayCluster] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const toast = useRef(null);
  const dialogFuncMap = {
    'displayEdit': setDisplayEdit,
    'displayDetails': setDisplayDetais,
    "displayCluster": setDisplayCluster
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
          console.log(response.data)
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

  function renderFooterAnalitcis(name) {
    return (
      <div>
        <Button label="Fechar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
      </div>
    );
  }

  function Analise() {
    let clusters = {}
    dialogFuncMap[`displayCluster`](true);
    setModalHeader("Análise")
    listUser.map(item => {
      if (clusters[item.score.cluster]) {
        clusters[item.score.cluster].push(item)
      }
      else {
        clusters[item.score.cluster] = [item]
      }
    })
    setListUserAnalitics(clusters)
  }

  function achaParecidos(cluster, fingerprint) {
    let jsonFinger = JSON.parse(fingerprint.replaceAll('{', '{"').replaceAll(':', '":').replaceAll(', ', ', "'))
    let listaFingerParecidos = []
    for(const person in jsonFinger){
      if(jsonFinger[person]>0.7){
        listaFingerParecidos.push(person)
      }
    }
    if(listaFingerParecidos.length === 0){
      listaFingerParecidos = 'Nenhum Fingerprint semelhante'
    }
    return listaFingerParecidos.toString()
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
              {listUser && <Button label="Análise de Usuários" className="ml-3" onClick={() => Analise()} />}
            </div>
            <div>
              {listUser &&
                <div className="card">
                  <DataTable value={listUser}>
                    <Column field="id" header="ID" style={{ width: '50px' }} sortable/>
                    <Column field="nome" header="Nome" sortable />
                    <Column body={(rowData) => getProp(rowData.dados, "email")} header="Email" />
                    <Column field="score.cluster" header="Cluster" sortable />
                    <Column body={actionTemplate} style={{ width: '150px' }} header="Ações" />
                  </DataTable>
                </div>
              }
            </div>
            <Dialog visible={displayDetails} header={`${modalHeader} Usuário`} style={{ width: '80vw' }} onHide={() => onHide('displayDetails')}>
              <Divider />

              <div className="grid">

                <div className="col-12">
                  <div className="grid">
                    <div className="col">
                      <p><b>Nome</b></p>
                      <label> {getValues("nome")}</label>
                    </div>

                    <div className="col">
                      <p><b>E-mail</b></p>
                      <label> {getValues("dados.email.0.email")}</label>
                    </div>

                    <div className="col">
                      <p><b>Telefone</b></p>
                      <label> {getValues("dados.telefone.0.telefone")}</label>
                    </div>
                  </div>
                </div>
                <Divider />

                <div className="col-12">
                  <div className="grid">
                    <div className="col">
                      <p><b>Fingerprint</b></p>
                      <label> {getValues("fingerprint")}</label>
                    </div>
                    <div className="col">
                      <p><b>Cluster</b></p>
                      <label> {getValues("score.cluster")}</label>
                    </div>
                  </div>
                </div>
                <Divider />

                <p><b>Score</b></p>

                <div className="col-12">
                  <p><b>Fingerprint</b></p>
                  <label> {getValues("score.fingerPrint")}</label>
                </div>

                <div className="col-12">
                  <p><b>Trace Router</b></p>
                  <label> {getValues("score.traceRouter")}</label>
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


            <Dialog visible={displayCluster} header={`${modalHeader} Usuário`} style={{ width: '80vw' }} footer={renderFooterAnalitcis('displayCluster')} onHide={() => onHide('displayCluster')}>


              <Accordion multiple activeIndex={0}>
                {listUserAnalitics &&
                  Object.keys(listUserAnalitics).map(item => {
                    return (
                      < AccordionTab header={`${item}`} >
                        {listUserAnalitics[item].map(usuario => {
                          return (
                            <>
                              <div className="grid">
                              <div className="col-2">
                                  <p><b>ID</b></p>
                                  <label> {usuario.id}</label>
                                </div>
                                <div className="col-5">
                                  <p><b>Nome</b></p>
                                  <label> {usuario.nome}</label>
                                </div>
                                <div className="col-5">
                                  <p><b>Fingerprint</b></p>
                                  <label> {usuario.fingerprint}</label>
                                </div>
                              </div>

                              <div className="grid">
                                <div className="col">
                                  <p><b>Finger Parecidos</b></p>
                                  <label> {achaParecidos(listUserAnalitics[item],usuario.score.fingerPrint)}</label>
                                </div>
                              </div>
                            </>
                          )
                        })
                        }

                      </AccordionTab>
                    )

                  })

                }
              </Accordion>

            </Dialog>
          </Card>
        </div>
      </div>
    </div >
  );
}
