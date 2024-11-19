import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app, auth } from '../firebase';

const Carrinho = () => {
    const [carrinho, setCarrinho] = useState([]);
    const [pedidoId, setPedidoId] = useState(null);
    const [formaPagamento, setFormaPagamento] = useState(''); // Novo estado para forma de pagamento
    const db = getFirestore(app);

    useEffect(() => {
        const fetchCarrinho = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.error("Usuário não autenticado");
                return;
            }

            const userId = user.uid;
            const carrinhoRef = doc(db, 'carrinho', userId);

            try {
                const carrinhoSnap = await getDoc(carrinhoRef);

                if (carrinhoSnap.exists()) {
                    setCarrinho(carrinhoSnap.data().itens);
                }
            } catch (error) {
                console.error('Erro ao buscar carrinho:', error);
            }
        };

        fetchCarrinho();
    }, [db]);

    const handleFormaPagamentoChange = (e) => {
        setFormaPagamento(e.target.value);
    };

    const handleSubmitPedido = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("Usuário não autenticado");
            return;
        }

        if (!formaPagamento) {
            alert("Por favor, selecione uma forma de pagamento.");
            return;
        }

        try {
            const pedidoData = {
                produtos: carrinho,
                data: new Date().toISOString(),
                formaPagamento: formaPagamento, // Adiciona a forma de pagamento
            };

            const docRef = await addDoc(collection(db, 'pedidos'), pedidoData);
            setPedidoId(docRef.id);
            alert('Pedido realizado com sucesso!');

            // Limpar carrinho após o pedido ser realizado
            await setDoc(doc(db, 'carrinho', user.uid), { itens: [] });
            setCarrinho([]); // Limpar o carrinho local
        } catch (error) {
            console.error('Erro ao salvar o pedido:', error);
        }
    };

    // Função para remover todos os itens do carrinho
    const handleRemoverTodosItens = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("Usuário não autenticado");
            return;
        }

        const userId = user.uid;

        try {
            // Atualiza o Firestore removendo todos os itens do carrinho
            const carrinhoRef = doc(db, 'carrinho', userId);
            await setDoc(carrinhoRef, { itens: [] }); // Limpa o carrinho no Firestore

            // Atualiza o estado local para refletir a remoção
            setCarrinho([]);

            alert('Todos os itens foram removidos do carrinho.');
        } catch (error) {
            console.error('Erro ao remover itens do carrinho:', error);
        }
    };

    const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

    return (
        <div>
            <h2>Carrinho</h2>
            {carrinho.length === 0 ? (
                <p>O carrinho está vazio.</p>
            ) : (
                <div>
                    <ul>
                        {carrinho.map((item, index) => (
                            <li key={index}>
                                <h3>{item.nome}</h3>
                                <p>Quantidade: {item.quantidade}</p>
                                <p>Preço Total: R$ {item.preco * item.quantidade}</p>
                                {/* Exibindo as imagens do produto */}
                                <div>
                                    {item.imagens && item.imagens.map((imagem, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={imagem}
                                            alt={`Imagem do produto ${item.nome} ${imgIndex + 1}`}
                                            style={{ width: '100px', margin: '10px' }}
                                        />
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: R$ {total}</h3>

                    {/* Formulário de escolha da forma de pagamento */}
                    <div>
                        <label>Forma de pagamento:</label>
                        <select value={formaPagamento} onChange={handleFormaPagamentoChange}>
                            <option value="">Selecione</option>
                            <option value="pix">PIX</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="debito">Débito</option>
                            <option value="credito">Crédito</option>
                        </select>
                    </div>

                    <button onClick={handleSubmitPedido}>Finalizar Pedido</button>

                    {/* Botão para remover todos os itens */}
                    <button onClick={handleRemoverTodosItens} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
                        Remover Todos os Itens do Carrinho
                    </button>
                </div>
            )}
            {pedidoId && <p>Pedido realizado com sucesso! ID do Pedido: {pedidoId}</p>}
        </div>
    );
};

export default Carrinho;
