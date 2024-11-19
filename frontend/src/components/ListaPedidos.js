import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { app } from '../firebase'; // Certifique-se de que 'app' é sua instância inicializada do Firebase.

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Criando uma consulta que ordena os pedidos pela data
        const pedidosQuery = query(
          collection(db, 'pedidos'),
          orderBy('data', 'desc')  // Ordena pela data de forma decrescente (mais recentes primeiro)
        );

        // Obtendo os pedidos ordenados
        const pedidosSnapshot = await getDocs(pedidosQuery);

        // Mapeando os pedidos para adicionar o ID e os dados
        const pedidosList = pedidosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Atualizando o estado com os pedidos ordenados
        setPedidos(pedidosList);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    fetchPedidos();
  }, [db]);

  // Função para calcular o valor total de um pedido
  const calcularTotalPedido = (produtos) => {
    return produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
  };

  return (
    <div>
      <h2>Lista de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => {
            // Calculando o total de cada pedido
            const totalPedido = calcularTotalPedido(pedido.produtos);

            return (
              <li key={pedido.id}>
                <h3>ID do Pedido: {pedido.id}</h3>
                <p>Data do Pedido: {new Date(pedido.data).toLocaleString()}</p>

                {/* Exibindo a forma de pagamento */}
                <p><strong>Forma de Pagamento: </strong>{pedido.formaPagamento}</p>

                <div>
                  <h4>Produtos:</h4>
                  <ul>
                    {pedido.produtos.map((produto, index) => (
                      <li key={index}>
                        <h5>{produto.nome}</h5>
                        <p>Quantidade: {produto.quantidade}</p>
                        <p>Preço Unitário: R$ {produto.preco}</p>
                        <p>Preço Total: R$ {produto.preco * produto.quantidade}</p>
                        <div>
                          {produto.imagens && produto.imagens.map((imagem, idx) => (
                            <img key={idx} src={imagem} alt={`Imagem ${idx + 1}`} style={{ width: '100px', margin: '10px' }} />
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <h4>Total da Compra: R$ {totalPedido.toFixed(2)}</h4> {/* Exibindo o total do pedido */}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ListaPedidos;
