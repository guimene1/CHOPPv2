import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';  


function Voltar() {
    return (
        <Link to="/produtos">
            <button className="voltar-button">
                Voltar
            </button>
        </Link>
    );
}

export default Voltar;