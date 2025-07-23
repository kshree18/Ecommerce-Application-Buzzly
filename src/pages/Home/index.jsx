import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Product from "~components/Product";
import Hero from "~containers/Hero";
import ProductsFilter from "~containers/ProductsFilter";
import { ProductContext } from "~contexts/ProductContext";

const Home = () => {
  const { products, loading, error } = useContext(ProductContext);
  const [items, setItems] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setItems(products);
  }, [products]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && products.length > 0) {
      const filteredItems = products.filter((product) => {
        return product.category === categoryParam;
      });
      setItems(filteredItems);
    }
  }, [searchParams, products]);

  const menuItems = [...new Set(products.map((item) => item.category))];
  
  const filterItems = (curcat) => {
    const newItems = products.filter((newItem) => {
      return newItem.category === curcat;
    });
    setItems(newItems);
  };

  if (loading) {
    return (
      <div>
        <Hero />
        <section className="py-16">
          <div className="container mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Hero />
        <section className="py-16">
          <div className="container mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-red-600 mb-4">Error loading products: {error}</p>
                <p className="text-gray-600">Please try refreshing the page</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <section className="py-16">
        <div className="w-full mb-4">
          <ProductsFilter
            setItems={setItems}
            menuItems={menuItems}
            filterItems={filterItems}
            products={products}
            initialCategory={searchParams.get('category')}
          />
        </div>
        <div className="container mx-auto">
          <div
            className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-[30px] 
          max-w-sm mx-auto md:max-w-none md:mx-0
                      "
          >
            {items.map((product) => {
              return <Product product={product} key={product.id} />;
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
