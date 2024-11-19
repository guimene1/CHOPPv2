import { Link } from "react-router-dom";

function Navegador(){
    return(
        <div className="nav-bar">
        <Link to="/produtos" className="nav-link">
          Produtos
        </Link>
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
        <Link to="/logout" className="nav-link">
          Logout
        </Link>
      </div>
    )
}

export default Navegador;