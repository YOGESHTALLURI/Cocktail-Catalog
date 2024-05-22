import React, { useState, useEffect } from "react";

const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const loadimg = "https://res.cloudinary.com/bytesizedpieces/image/upload/v1656084931/article/a-how-to-guide-on-making-an-animated-loading-image-for-a-website/animated_loader_gif_n6b5x0.gif";

function Upifetch() {
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ status: false, msg: "" });
  const [cart, setCart] = useState([]);

  const fetchdata = async (url) => {
    setLoading(true);
    setError({ status: false, msg: "" });
    try {
      const response = await fetch(url);
      const { drinks } = await response.json();
      setDrinks(drinks);
      setLoading(false);
      setError({ status: false, msg: "" });
      if (!drinks) {
        throw new Error("No such drinks");
      }
    } catch (error) {
      setLoading(false);
      setError({ status: true, msg: error.message || "Oops! Something went wrong." });
    }
  };

  useEffect(() => {
    const correcturl = `${url}${searchTerm}`;
    fetchdata(correcturl);
  }, [searchTerm]);

  const addToCart = (drink) => {
    setCart([...cart, drink]);
  };

  let loadingElement = null;
  if (loading) {
    loadingElement = (
      <div>
        <img src={loadimg} alt="Loading" />
        <h1>Loading...</h1>
      </div>
    );
  }

  let errorElement = null;
  if (error.status) {
    errorElement = (
      <div>
        <h1 className="error-msg">{error.msg}</h1>
      </div>
    );
  }

  let drinksListElement = null;
  if (!loading && !error.status) {
    drinksListElement = (
      <ul className="drinks-list">
        {drinks.map((drink) => {
          const { idDrink, strDrink, strDrinkThumb } = drink;
          return (
            <li className="drink-item" key={idDrink}>
              <img src={strDrinkThumb} alt={strDrink} />
              <div className="drink-details">
                <h4>{strDrink}</h4>
                <button onClick={() => addToCart(drink)}>Add to Cart</button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  let cartElement = null;
  if (cart.length > 0) {
    cartElement = (
      <div className="cart">
        <h2>Cart Items</h2>
        <ul className="cart-list">
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <h4>{item.strDrink}</h4>
              <img className="cart-item-img" src={item.strDrinkThumb} alt={item.strDrink} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <form>
          <input
            type="text"
            name="search"
            placeholder="Search for drinks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      {loadingElement}
      {errorElement}
      {drinksListElement}
      {cartElement}
    </div>
  );
}

export default Upifetch;
