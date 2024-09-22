import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilState } from "recoil";
import productAtom from "../../atoms/productAtoms";
import Product from "../Components/product";

const MarketPlace = () => {
  const [products, setProducts] = useRecoilState(productAtom);
  const [loading, setLoading] = useState(true);
    const showToast = useShowToast();
    
  useEffect(() => {
    const getFeedProducts = async () => {
      setLoading(true);
      setProducts([]);
      try {
        const res = await fetch("/api/products/allproducts");
        const data = await res.json();
        if (data.error) {
            showToast("Error", data.error, "error");
            
          return;
        }
        console.log(data);
        setProducts(data);
      } catch (error) {
          console.log(error.message);
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedProducts();
  }, [showToast]);

  return (
    <>
      <Flex gap="10" alignItems={"flex-start"}>
        <Box flex={70}>
          {!loading && products.length === 0 && <h1>No products to show</h1>}

          {loading && (
            <Flex justify="center">
              <Spinner size="xl" />
            </Flex>
          )}

          {products?.map((product) => (
            <Product
              key={product._id}
              product={product}
              postedBy={product.postedBy}
            />
          ))}
        </Box>
        <Box
          flex={30}
          display={{
            base: "none",
            md: "block",
          }}
        >
          {/* <SuggestedUsers /> */}
        </Box>
      </Flex>
    </>
  );
};

export default MarketPlace;
