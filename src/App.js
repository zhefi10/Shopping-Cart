import Header from './components/Header';
import Main from './components/Main';
import Cart from './components/Cart';
import dataProducts from './data';
import useDataApi from './dataApi'
import { useState } from 'react';

function App() {
  const {products} = dataProducts;
  const [items, setItems] = useState(products);
  const [cartItems, setCartItems] = useState([]);
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data}, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );

  const addToCart = (item) => {     
    
    if (item.instock === 0) return; 
    item.instock = item.instock - 1;
    
    let itemExist = cartItems.filter((x) => x.id === item.id); 

    if (itemExist[0]){
      setCartItems(cartItems.map((x) => 
        x.id === itemExist[0].id ? {...itemExist[0], qty: itemExist[0].qty + 1} : x
      ));
    }else{
      setCartItems([...cartItems, {...item, qty: 1}]);     
    }
  };

  const removeItem = (item) => {   

    if (item.qty === 1) {
      setCartItems(cartItems.filter((x)=> x.id !== item.id));
    }else {
      setCartItems(
        cartItems.map((x) =>
          x.id === item.id ? {...item, qty: item.qty - 1} : x
      ));
    }    
    let itemExist = items.filter((x) => x.id === item.id);
    if(itemExist[0]){
      setItems(
        items.map((x) =>
          x.id === itemExist[0].id ? {...itemExist[0], instock: itemExist[0].instock + 1}  : x
        )
      );
    }
  };

  const restockProducts = (url) => {
    doFetch(url);
    let newItems = data.map((item) => {
      let { id, name, country, cost, instock } = item;
      return { id, name, country, cost, instock };
    });

    let newProducts = items.concat(newItems);

    let prod = newProducts.reduce(
      (product,elem) => {
        if (product[elem.id]){
          product[elem.id].instock = product[elem.id].instock + elem.instock;
        }else {
          product[elem.id] = elem;
        }
        return product;
      }, {});

    setItems(Object.values(prod));
  };


  return (
    <div className="App">
      <Header />
      <section className="h-100 gradient-custom">
      <div className="row d-flex justify-content-center my-10">
        <div className="col-md-5">
            <Main products={items} addToCart={addToCart}></Main>            
        </div> 
        <div className="col-md-5">
          <Cart cartItems={cartItems} removeItem={removeItem}></Cart>
        </div>
      </div>
      <div className="row d-flex justify-content-center my-10">
        <div className="col-md-10">
        <form
          onSubmit={(event) => {
            restockProducts(`${query}`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">re-stock products</button>
        </form>
                       
        </div>         
      </div>
      </section>      
    </div>
  );
}
export default App;
