import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../../../firebase'; // Certifique-se de que 'app' e 'auth' são as instâncias inicializadas do Firebase
import './Produtos.css'
import { Link } from 'react-router-dom';

const ListaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [quantidade, setQuantidade] = useState({}); // Estado para armazenar a quantidade de cada produto
  const db = getFirestore(app);

  // Função para buscar os produtos no Firestore
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

  // Função para alterar a quantidade de cada produto
  const handleQuantidadeChange = (id, value) => {
    setQuantidade((prevQuantidade) => ({
      ...prevQuantidade,
      [id]: Math.max(1, value), // Garante que a quantidade não seja menor que 1
    }));
  };

  // Função para adicionar o produto ao carrinho
  const adicionarAoCarrinho = async (produto) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    const userId = user.uid;
    const quantidadeSelecionada = parseInt(quantidade[produto.id]) || 1; // Se a quantidade não estiver definida ou for inválida, assume 1
    const novoItem = {
      ...produto,
      quantidade: quantidadeSelecionada,
    };

    try {
      // Verifica se o carrinho já existe
      const carrinhoRef = doc(db, 'carrinho', userId);
      const carrinhoSnap = await getDoc(carrinhoRef);

      let itensExistentes = [];

      if (carrinhoSnap.exists()) {
        // Se o carrinho existir, pega os itens existentes
        itensExistentes = carrinhoSnap.data().itens || [];

        // Verifica se o produto já está no carrinho
        const indexProdutoExistente = itensExistentes.findIndex(item => item.id === produto.id);

        if (indexProdutoExistente !== -1) {
          // Se o produto já existe no carrinho, atualiza a quantidade somando o valor
          itensExistentes[indexProdutoExistente].quantidade += quantidadeSelecionada;
        } else {
          // Se o produto não existe, adiciona ao carrinho
          itensExistentes.push(novoItem);
        }
      } else {
        // Se o carrinho não existe, cria um novo carrinho com o produto
        itensExistentes = [novoItem];
      }

      // Atualiza o carrinho no Firestore
      await setDoc(carrinhoRef, { itens: itensExistentes }, { merge: true });

      alert(`Produto ${produto.nome} adicionado ao carrinho com quantidade: ${quantidadeSelecionada}`);
    } catch (error) {
      console.error('Erro ao salvar o carrinho no Firestore:', error);
    }
  };

  return (
    <div>
      <div className="nav-bar">
        <Link to="/carrinho" className="nav-link">
          Carrinho
        </Link>
        <Link to="/novo-produto" className="nav-link">
          Cadastrar Produto
        </Link>
        <Link to="/editarproduto" className="nav-link">
          Editar produto
        </Link>
        <Link to="/listapedidos" className="nav-link">
          Lista de Pedidos
        </Link>
      </div>

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
                  <img key={index} src={imagem} alt={`Imagem ${index + 1}`} style={{ width: '100px', margin: '10px' }} />
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
