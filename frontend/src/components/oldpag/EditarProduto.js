import React, { useState, useEffect } from 'react';
import { getFirestore, doc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../firebase';

const EditarProduto = () => {
  const [produtos, setProdutos] = useState([]);
  const db = getFirestore(app);
  const storage = getStorage(app);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosCollection = collection(db, 'produtos');
        const produtosSnapshot = await getDocs(produtosCollection);
        const produtosList = produtosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProdutos(produtosList);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    fetchProdutos();
  }, [db]);

  // Atualiza os campos do produto (nome, tipo, preço, etc.)
  const handleInputChange = (e, produtoId, field) => {
    const value = e.target.value;
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) =>
        produto.id === produtoId ? { ...produto, [field]: value } : produto
      )
    );
  };

  // Atualiza as imagens do produto
  const handleImageChange = async (e, produtoId) => {
    const imagens = Array.from(e.target.files);
    if (imagens.length > 0) {
      const produto = produtos.find(prod => prod.id === produtoId);

      // Primeiro, excluir as imagens antigas
      for (let imagemUrl of produto.imagens) {
        const imageRef = ref(storage, imagemUrl);
        try {
          await deleteObject(imageRef); // Exclui a imagem antiga
        } catch (error) {
          console.error('Erro ao deletar imagem antiga:', error);
        }
      }

      const updatedImagensUrls = [];

      // Subir as novas imagens para o Firebase Storage
      for (let imagem of imagens) {
        const imagemRef = ref(storage, `produtos/${produtoId}/${imagem.name}`);
        try {
          await uploadBytes(imagemRef, imagem);
          const imagemUrl = await getDownloadURL(imagemRef);
          updatedImagensUrls.push(imagemUrl);
        } catch (error) {
          console.error('Erro ao fazer upload da imagem:', error);
        }
      }

      // Atualizar o produto com as novas URLs de imagens
      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.id === produtoId ? { ...produto, imagens: updatedImagensUrls } : produto
        )
      );
    }
  };

  // Atualiza o produto no Firestore
  const handleUpdate = async (produto) => {
    try {
      const produtoRef = doc(db, 'produtos', produto.id);
      await updateDoc(produtoRef, {
        nome: produto.nome,
        tipo: produto.tipo,
        descricao: produto.descricao,
        preco: produto.preco,
        imagens: produto.imagens, // Salvar as URLs das imagens no Firestore
      });
      alert('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  // Deleta o produto do Firestore e Storage
  const handleDelete = async (produtoId) => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      try {
        const produto = produtos.find(prod => prod.id === produtoId);

        // Deletar as imagens associadas ao produto, se existirem
        for (let imagemUrl of produto.imagens) {
          const imageRef = ref(storage, imagemUrl);
          try {
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Erro ao deletar imagem:', error);
          }
        }

        // Deletar o produto do Firestore
        await deleteDoc(doc(db, 'produtos', produtoId));
        setProdutos((prevProdutos) => prevProdutos.filter((produto) => produto.id !== produtoId));
        alert('Produto removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover produto:', error);
      }
    }
  };

  return (
    <div>
      <h2>Lista de Produtos para Editar</h2>
      {produtos.map((produto) => (
        <div key={produto.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <div>
            <label>Nome do Produto:</label>
            <input
              type="text"
              value={produto.nome}
              onChange={(e) => handleInputChange(e, produto.id, 'nome')}
            />
          </div>
          <div>
            <label>Tipo do Produto:</label>
            <input
              type="text"
              value={produto.tipo}
              onChange={(e) => handleInputChange(e, produto.id, 'tipo')}
            />
          </div>
          <div>
            <label>Descrição:</label>
            <textarea
              value={produto.descricao}
              onChange={(e) => handleInputChange(e, produto.id, 'descricao')}
            ></textarea>
          </div>
          <div>
            <label>Preço:</label>
            <input
              type="number"
              value={produto.preco}
              onChange={(e) => handleInputChange(e, produto.id, 'preco')}
            />
          </div>
          <div>
            <label>Imagens do Produto:</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleImageChange(e, produto.id)}
            />
            {produto.imagens && produto.imagens.map((imagem, index) => (
              <img key={index} src={imagem} alt={`Produto ${index + 1}`} style={{ width: '200px', marginTop: '10px' }} />
            ))}
          </div>
          <button onClick={() => handleUpdate(produto)}>Salvar Alterações</button>
          <button onClick={() => handleDelete(produto.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>Remover Produto</button>
        </div>
      ))}
    </div>
  );
};

export default EditarProduto;
