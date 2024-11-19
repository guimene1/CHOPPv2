import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { app, auth } from '../../../firebase';
import './Carrinho.css';
import { Link } from 'react-router-dom';
import Navegador from '../../navbar/navbar';

const Carrinho = () => {
    const [carrinho, setCarrinho] = useState([]);
    const [pedidoId, setPedidoId] = useState(null);
    const [formaPagamento, setFormaPagamento] = useState('');
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
                formaPagamento: formaPagamento,
            };

            const docRef = await addDoc(collection(db, 'pedidos'), pedidoData);
            setPedidoId(docRef.id);
            alert('Pedido realizado com sucesso!');

            await setDoc(doc(db, 'carrinho', user.uid), { itens: [] });
            setCarrinho([]);
        } catch (error) {
            console.error('Erro ao salvar o pedido:', error);
        }
    };

    const handleRemoverTodosItens = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("Usuário não autenticado");
            return;
        }

        const userId = user.uid;

        try {
            const carrinhoRef = doc(db, 'carrinho', userId);
            await setDoc(carrinhoRef, { itens: [] });

            setCarrinho([]);
            alert('Todos os itens foram removidos do carrinho.');
        } catch (error) {
            console.error('Erro ao remover itens do carrinho:', error);
        }
    };

    const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

    return (
        
        <div className="carrinho-container">
            <Navegador/>
            <h2>Carrinho</h2>
            {carrinho.length === 0 ? (
                <p>O carrinho está vazio.</p>
            ) : (
                <div>
                    <ul className="carrinho-list">
                        {carrinho.map((item, index) => (
                            <li key={index} className="carrinho-item">
                                <h3>{item.nome}</h3>
                                <p>Quantidade: {item.quantidade}</p>
                                <p>Preço Total: R$ {item.preco * item.quantidade}</p>
                                <div>
                                    {item.imagens && item.imagens.map((imagem, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={imagem}
                                            alt={`Imagem do produto ${item.nome} ${imgIndex + 1}`}
                                        />
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h3 className="carrinho-total">Total: R$ {total}</h3>

                    <div className="pagamento-form">
                        <label>Forma de pagamento:</label>
                        <select value={formaPagamento} onChange={handleFormaPagamentoChange}>
                            <option value="">Selecione</option>
                            <option value="pix">PIX</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="debito">Débito</option>
                            <option value="credito">Crédito</option>
                        </select>
                    </div>

                    <div className="button-container">
                        <button className="button button-remover" onClick={handleRemoverTodosItens}>
                            Remover Todos os Itens do Carrinho
                        </button>
                        <button className="button button-finalizar" onClick={handleSubmitPedido}>
                            Finalizar Pedido
                        </button>
                        <Link to="/editarproduto" className="button button-finalizar">
                            Editar produto
                        </Link>
                        
                    </div>
                </div>
            )}
            {pedidoId && <p>Pedido realizado com sucesso! ID do Pedido: {pedidoId}</p>}
        </div>
    );
};

export default Carrinho;
