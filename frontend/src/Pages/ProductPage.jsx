import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Actions from "../Components/Actions";
import { useEffect } from "react";
import Comments from "../Components/Comments";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import useShowToast from "../../hooks/useShowToast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../../atoms/postAtoms";
import productAtom from "../../atoms/productAtoms";

const ProductPage = () => {
  const { user, loading } = useGetUserProfile();
  const [products, setProducts] = useRecoilState(productAtom);
  const showToast = useShowToast();
  const { productId } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

    const currentProduct = products[0];

  useEffect(() => {
    const getPost = async () => {
      setProducts([]);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setProducts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, productId, setProducts]);

  const handleDeleteProduct = async () => {
    // try {
    //   if (!window.confirm("Are you sure you want to delete this post?")) return;

    //   const res = await fetch(`/api/posts/${currentPost._id}`, {
    //     method: "DELETE",
    //   });
    //   const data = await res.json();
    //   if (data.error) {
    //     showToast("Error", data.error, "error");
    //     return;
    //   }
    //   showToast("Success", "Post deleted", "success");
    //   navigate(`/${user.username}`);
    // } catch (error) {
      //   showToast("Error", error.message, "error");
      console.log("Deleting product");
    // }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentProduct) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar
            src={user.profilePic}
            size={"md"}
            cursor={"pointer"}
            name="Mark Zuckerberg"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Flex>
            <Text
              cursor={"pointer"}
              fontSize={"sm"}
              fontWeight={"bold"}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            >
              {user.username}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currentProduct.createdAt))} ago
          </Text>
          {/* 
          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeleteProduct}
            />
          )} */}
        </Flex>
      </Flex>

      <Text my={3}>
        {currentProduct.title}
        {" • "}
        {currentProduct.price} ₹
      </Text>

      {currentProduct.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentProduct.img} w={"full"} />
        </Box>
      )}

      {currentProduct.description && (
        <Text>
          <b>Description</b><br/>{currentProduct.description}
        </Text>
      )}

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      {/* <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comments
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))} */}
    </>
  );
};

export default ProductPage;
