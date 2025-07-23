import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "~contexts/CartContext";
import { ProductContext } from "~contexts/ProductContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);

  useEffect(() => {
    if (!loading && products.length > 0) {
      // Try to find product by MongoDB ObjectId first, then by integer ID as fallback
      let foundProduct = products.find((item) => item._id === id);
      
      if (!foundProduct) {
        // Fallback to integer ID (for backward compatibility)
        foundProduct = products.find((item) => item.id === parseInt(id));
      }
      
      setProduct(foundProduct);
      setProductLoading(false);
    } else if (!loading && products.length === 0) {
      setProductLoading(false);
    }
  }, [id, products, loading]);

  if (loading || productLoading) {
    return (
      <section className="pt-32 pb-12 lg:py-32 flex items-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-32 pb-12 lg:py-32 flex items-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading product: {error}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="pt-32 pb-12 lg:py-32 flex items-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
              <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { title, price, description, image, rating, category, stock } = product;

  return (
    <section className="pt-32 pb-12 lg:py-32 flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between lg:min-h-screen">
          <div className="flex flex-1 justify-center items-center mb-8 lg:mb-0">
            <img
              className="
                        max-w-[200px] md:max-w-[300px] lg:max-w-sm 
                        max-h-[300px] lg:max-h-sm object-contain
                        "
              src={image}
              alt={title}
            />
          </div>
          <div className="flex-1 text-center lg:text-left lg:pl-8">
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-2">
                {category}
              </span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 max-w-[500px] mx-auto lg:mx-0">
              {title}
            </h1>
            
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(rating?.rate || 0) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({rating?.count || 0} reviews)
                </span>
              </div>
            </div>
            
            <div className="text-2xl lg:text-3xl text-red-500 font-bold mb-4">
              ${price}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed max-w-[500px] mx-auto lg:mx-0">
                {description}
              </p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Availability:</span> {stock > 0 ? `${stock} in stock` : 'Out of stock'}
              </p>
            </div>
            
            <button
              className="bg-primary text-white py-4 px-8 text-lg font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => addToCart(product, product._id || product.id)}
              disabled={stock <= 0}
            >
              {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
