import React, {
  useEffect, useState, useCallback,

} from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';


import api from '../../services/api';

import logo from '../../assets/logo.svg';

import DropZone from '../../components/DropZone';
import './styles.css';


interface Item {
  id: number,
  title: string,
  image_url: string
}
interface UF {
  id: number,
  sigla: string
}

interface CITY {
  id: number,
  nome: string
}
const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  const [uf, setUf] = useState<UF[]>([]);
  const [municipios, setMunicipios] = useState<CITY[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [selectCity, setSelectCity] = useState('');
  const [selectUf, setSelectUf] = useState('');

  const [initialMarker, setInitialMarker] = useState<[number, number]>([0, 0]);
  const [selectMarker, setSelectMarker] = useState<[number, number]>([0, 0]);

  const [selectedFile, setSelectedFile] = useState<File>();


  const history = useHistory();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      setInitialMarker([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    api.get('/items').then((response) => {
      setItems(response.data);
    });
  }, []);


  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then((response) => {
      setUf(response.data);
    });
  }, []);


  const changeUF = useCallback((name) => {
    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${name}/municipios`).then((response) => {
      setMunicipios(response.data);
      setSelectUf(name);
    });
  }, []);

  const handleMapClick = useCallback((event) => {
    const { lat, lng } = event.latlng;
    setSelectMarker([lat, lng]);
  }, []);

  const changeCITY = useCallback((city) => {
    setSelectCity(city);
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }, [formData]);

  const handleSelectItem = useCallback((id: number) => {
    const alreadySelected = selectedItems.findIndex((item) => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }, [selectedItems]);


  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const { email, whatsapp, name } = formData;
    const uf = selectUf;
    const city = selectCity;
    const [latitude, longitude] = selectMarker;
    const items = selectedItems;


    const data = new FormData();


    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if (selectedFile) {
      data.append('image', selectedFile);
    }

    await api.post('/points', data);
    alert('Ponto de coleta criado');

    history.push('/');
  }, [formData, selectedItems, selectMarker, selectUf, selectCity, history]);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>

        <h1>
          Cadastro
          {' '}
          <br />
          do ponto
          de coleta
        </h1>

        <DropZone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>


          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>


          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>

          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>


          <Map
            center={initialMarker}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectMarker} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" onChange={(e) => { changeUF(e.target.value); }}>
                <option value="0">Selecione uma UF</option>
                {uf.map((state: UF) => (
                  <option key={state.id} value={state.sigla}>{state.sigla}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" onChange={(e) => { changeCITY(e.target.value); }}>
                <option value="0">Selecione uma cidade</option>
                {municipios.map((city: CITY) => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">

            {items.map((item: Item) => (

              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >

                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}

          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
