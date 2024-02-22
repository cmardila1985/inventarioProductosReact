import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductGrid from './components/ProductGrid';


function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await axios.get('http://localhost:8080/api/v1/productos/productos');
    console.log(" result.data ", result.data)
    setProductos(result.data);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1></h1>
        <ProductGrid productos={productos} />
      </header>
    </div>
  );
}

export default App;
