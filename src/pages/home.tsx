import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";

const Home = () => {

  const {data,isLoading,isError} = useLatestProductsQuery("");

  if(isError) toast.error("Cannot Fetch the Products");


  const addToCartHandler = () => {};
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Product
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
      {isLoading ? ( <Skeleton width="80vw"/>) : (
          data?.products.map((i)=>(
            <ProductCard
            productId={i._id}
            name= {i.name}
            price={i.price}
            stock={i.stock}
            handler={addToCartHandler}
            photo={i.photo}
          />
          ))
      )}
      </main>
    </div>
  );
};

export default Home;
