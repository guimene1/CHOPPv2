import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';
import './stylle.css';
import Navegador from '../../navbar/navbar';

const ProdutoForm = () => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagens, setImagens] = useState([]);

  const db = getFirestore(app);
  const storage = getStorage(app);

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImagens(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadPromises = imagens.map(async (imagem) => {
        const imagemRef = ref(storage, `produtos/${imagem.name}`);
        await uploadBytes(imagemRef, imagem);
        return getDownloadURL(imagemRef);
      });

      const imagensUrls = await Promise.all(uploadPromises);

      await addDoc(collection(db, 'produtos'), {
        nome,
        tipo,
        descricao,
        preco,
        imagens: imagensUrls,
      });

      alert('Produto criado com sucesso!');
      setNome('');
      setTipo('');
      setDescricao('');
      setPreco('');
      setImagens([]);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  return (
    <div>
      <Navegador />
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Nome do Produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tipo do Produto"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        ></textarea>
        <input
          type="number"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <input
          type="file"
          multiple
          onChange={handleImageChange}
        />
        <button type="submit">Salvar Produto</button>
      </form>
    </div>
  );
};

export default ProdutoForm;
