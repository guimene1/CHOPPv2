import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../../../firebase';
import './Produtos.css'
import Navegador from '../../navbar/navbar';

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [quantidade, setQuantidade] = useState({});
  const db = getFirestore(app);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosSnapshot = await getDocs(collection(db, 'produtos'));
        const produtosList = produtosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProdutos(produtosList);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, [db]);

  const handleQuantidadeChange = (id, value) => {
    setQuantidade((prevQuantidade) => ({
      ...prevQuantidade,
      [id]: Math.max(1, value),
    }));
  };

  const adicionarAoCarrinho = async (produto) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    const userId = user.uid;
    const quantidadeSelecionada = parseInt(quantidade[produto.id]) || 1;
    const novoItem = {
      ...produto,
      quantidade: quantidadeSelecionada,
    };

    try {
      const carrinhoRef = doc(db, 'carrinho', userId);
      const carrinhoSnap = await getDoc(carrinhoRef);

      let itensExistentes = [];

      if (carrinhoSnap.exists()) {
        itensExistentes = carrinhoSnap.data().itens || [];

        const indexProdutoExistente = itensExistentes.findIndex(item => item.id === produto.id);

        if (indexProdutoExistente !== -1) {
          itensExistentes[indexProdutoExistente].quantidade += quantidadeSelecionada;
        } else {
          itensExistentes.push(novoItem);
        }
      } else {
        itensExistentes = [novoItem];
      }
      await setDoc(carrinhoRef, { itens: itensExistentes }, { merge: true });

      alert(`Produto ${produto.nome} adicionado ao carrinho com quantidade: ${quantidadeSelecionada}`);
    } catch (error) {
      console.error('Erro ao salvar o carrinho no Firestore:', error);
    }
  };

  return (
    <div>
      <Navegador />

      <h2>Lista de Produtos</h2>
      {produtos.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              <h3>{produto.nome}</h3>
              <p>Tipo: {produto.tipo}</p>
              <p>Descrição: {produto.descricao}</p>
              <p>Preço: R$ {produto.preco}</p>
              <div>
                {produto.imagens && produto.imagens.map((imagem, index) => (
                  <img
                    key={index}
                    src={imagem}
                    alt={`Imagem ${index + 1}`}
                    style={{ width: '100px', margin: '10px' }}
                  />
                ))}
              </div>

              <div>
                <label htmlFor={`quantidade-${produto.id}`}>Quantidade:</label>
                <input
                  type="number"
                  id={`quantidade-${produto.id}`}
                  min="1"
                  value={quantidade[produto.id] || 1}
                  onChange={(e) => handleQuantidadeChange(produto.id, e.target.value)}
                  style={{ width: '50px', marginLeft: '10px' }}
                />
                <button onClick={() => adicionarAoCarrinho(produto)} style={{ marginLeft: '10px' }}>
                  Adicionar ao Carrinho
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaProdutos;
