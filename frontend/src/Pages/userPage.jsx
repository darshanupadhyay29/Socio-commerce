import { useEffect, useState } from "react";
import UserHeader from './../Components/UserHeader'
import { useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../Components/post";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postAtoms";
import productAtom from "../../atoms/productAtoms";
import Product from "../Components/product";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);
    const [fetchingProducts, setFetchingProducts] = useState(true);
    const [products, setProducts] = useRecoilState(productAtom);
    const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts, user]);
    
    useEffect(() => {
        const getProducts = async () => {
            if (!user) {
                return;
            } setFetchingProducts(true);
            try {
                const res = await fetch(`/api/products/product/${username}`);
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setProducts([]);
            } finally {
                setFetchingProducts(false);
            }
        };
        getProducts();
    }, [username, showToast, setProducts, user]);
    

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader
        user={user}
        setShowProducts={setShowProducts}
        showProducts={showProducts}
      />

      {!showProducts && !fetchingPosts && posts.length === 0 && <h1>No posts!</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {showProducts && !fetchingProducts && products.length === 0 && (
        <h1>No products!</h1>
      )}
      {fetchingProducts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {showProducts
        ? products.map((product) => (
            <Product
              key={product.id}
              product={product}
              postedBy={product.postedBy}
            />
          ))
        : posts.map((post) => (
            <Post key={post.id} post={post} postedBy={post.postedBy} />
          ))}
    </>
  );
};

export default UserPage;
