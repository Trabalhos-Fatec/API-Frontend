import React from 'react';
import Routes from './routes';
import PrimeReact from 'primereact/api';
import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import "primeflex/primeflex.css";
import './global.css';

PrimeReact.ripple = true;
PrimeReact.autoZIndex = true;
locale('pt-br');

export default function App() {
  return ( <Routes/>);
}
