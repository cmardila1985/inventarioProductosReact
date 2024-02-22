import React, { useState } from 'react';
import axios from 'axios';
import './ProductForm.css'; // Importar archivo CSS para estilos

function ProductForm({onProductCreated}) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/productos/crear', {
        nombre,
        descripcion,
        precio: parseInt(precio),
        stock: parseInt(stock)
      });

      onProductCreated(response)
      setNombre('');
      setDescripcion('');
      setPrecio('');
      setStock('');
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Crear Nuevo Producto</h2>
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>
      <label>
        Descripción:
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>
      </label>
      <label>
        Precio:
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </label>
      <label>
        Stock:
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </label>
      <button type="submit">Crear Producto</button>
    </form>
  );
}

export default ProductForm;
