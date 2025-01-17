import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import productAtom from "../../atoms/productAtoms";

const Product = ({ product, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [products, setProducts] = useRecoilState(productAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

//   const handleDeleteProduct = async (e) => {
//     try {
//       e.preventDefault();
//       if (!window.confirm("Are you sure you want to delete this post?")) return;

//       const res = await fetch(`/api/products/${product._id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (data.error) {
//         showToast("Error", data.error, "error");
//         return;
//       }
//       showToast("Success", "Post deleted", "success");
//       setProducts(products.filter((p) => p._id !== product._id));
//     } catch (error) {
//       showToast("Error", error.message, "error");
//     }
//   };

  if (!user) return null;
  return (
    <Link to={`/${user.username}/product/${product._id}`}>
      <Flex gap={3} mb={4} py={5}>
        {/* <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
        </Flex> */}
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            {/* <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex> */}
            {/* <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(product.createdAt))} ago
              </Text> */}

            {/* {currentUser?._id === user._id && (
                <DeleteIcon size={20} onClick={handleDeleteProduct} />
              )} */}
            {/* </Flex> */}
          </Flex>

          <Text fontStyle={"normal"}>
            {product.title}
            {" • "}
            {product.price} ₹
          </Text>
          {product.img && (
            <>
              <Box
                borderRadius={6}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={product.img} w={"full"} />
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </Link>
  );
};

export default Product;
