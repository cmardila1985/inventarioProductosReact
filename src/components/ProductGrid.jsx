import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css'; // Importar archivo CSS para estilos
import ProductForm from './ProductForm';

function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const [valorTotalInventario, setValorTotalInventario] = useState(0);
  const [productoMayorValor, setProductoMayorValor] = useState(null);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: ''
  });
  const [combinaciones, setCombinaciones] = useState([]);


  const handleProductCreated = async (response) => {
    alert('Producto creado exitosamente');
    const result = await axios.get('http://localhost:8080/api/v1/productos/productos');
    setProductos(result.data);
  };

  const obtenerCombinaciones = async (valor) => {
    const result = await axios.get(`http://localhost:8080/api/v1/productos/combinaciones/${valor}`);
    setCombinaciones(result.data);
    if(result.data.length > 0){
      alert(`Combinaciones encontradas: ${result.data.map(comb => comb.join(', ')).join('\n')}`);
    }else{
      alert("No se encontraron combinaciones")
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8080/api/v1/productos/productos');
      setProductos(result.data);

      let total = 0;
      let mayorValor = null;
      result.data.forEach((producto) => {
        const valorInventario = producto.precio * producto.stock;
        total += valorInventario;
        if (!mayorValor || valorInventario > mayorValor.valorInventario) {
          mayorValor = { producto, valorInventario };
        }
      });
      setValorTotalInventario(total);
      setProductoMayorValor(mayorValor);
    };

    fetchData();
  }, []);

  const handleEditar = (producto) => {
    setEditandoProducto(producto);
    setValoresEditados({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
  };

  const handleEliminar = async (producto) => {
    await axios.delete(`http://localhost:8080/api/v1/productos/eliminar/${producto.id}`);
    const result = await axios.get('http://localhost:8080/api/v1/productos/productos');
    setProductos(result.data);
  };

  const handleGuardar = async () => {
    await axios.put(`http://localhost:8080/api/v1/productos/actualizar/${editandoProducto.id}`, valoresEditados);
    setEditandoProducto(null);
    setValoresEditados({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: ''
    });
    const result = await axios.get('http://localhost:8080/api/v1/productos/productos');
    setProductos(result.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValoresEditados(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      <ProductForm onProductCreated={handleProductCreated} />
      <div style={{ paddingLeft: "30px" }}>
        <h1>Listado de Productos</h1>
        <h2>Valor Total del Inventario: {valorTotalInventario}</h2>
        {productoMayorValor && (
          <h2>Producto con Mayor Valor de Inventario: {productoMayorValor.producto.nombre}</h2>
        )}
        <div>
          <label htmlFor="valorCompra">Ingrese el valor de compra:</label>
          <input type="number" id="valorCompra" name="valorCompra" />
          <button onClick={() => obtenerCombinaciones(document.getElementById('valorCompra').value)}>Obtener Combinaciones</button>
        </div>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <React.Fragment key={producto.id}>
              <tr>
                <td>{producto.id}</td>
                <td>{editandoProducto === producto ? <input type="text" name="nombre" value={valoresEditados.nombre} onChange={handleChange} /> : producto.nombre}</td>
                <td>{editandoProducto === producto ? <input type="text" name="descripcion" value={valoresEditados.descripcion} onChange={handleChange} /> : producto.descripcion}</td>
                <td>{editandoProducto === producto ? <input type="number" name="precio" value={valoresEditados.precio} onChange={handleChange} /> : producto.precio}</td>
                <td>{editandoProducto === producto ? <input type="number" name="stock" value={valoresEditados.stock} onChange={handleChange} /> : producto.stock}</td>
                <td>
                  {editandoProducto === producto ? (
                    <button onClick={handleGuardar}>Guardar</button>
                  ) : (
                    <button onClick={() => handleEditar(producto)}>Editar</button>
                  )}
                  <button onClick={() => handleEliminar(producto)}>Eliminar</button>
                </td>
              </tr>
              {editandoProducto === producto && (
                <tr>
                  <td colSpan="6">
                    <button onClick={() => setEditandoProducto(null)}>Cancelar</button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductGrid;
