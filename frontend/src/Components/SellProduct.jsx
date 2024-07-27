import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import { useParams } from "react-router-dom";
import productAtom from "../../atoms/productAtoms";



const SellProduct = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useRecoilState(productAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
      const { name, value } = e.target;  
      
      if (name === 'title') setTitle(value);
      else if (name === 'price') setPrice(value);
      else if (name === 'description') setDescription(value);
  };

  const handleSellProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products/sellproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          title: title,
          price: price,
          description: description,
          img:imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Product added successfully", "success");
      if (username === user.username) {
        setProducts([data, ...products]);
      }
      onClose();
        setTitle("");
        setPrice("");
        setDescription("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        position={"fixed"}
        bottom={20}
        right={5}
        marginBottom={4}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        Sell
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Add new product</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Flex alignItems="center" justifyContent="center">
                <BsFillImageFill
                  style={{ cursor: "pointer" }}
                  size={16}
                  onClick={() => imageRef.current.click()}
                />
                Add photo
              </Flex>
              <Textarea
                              placeholder="Title"
                              name="title"
                onChange={handleTextChange}
                value={title}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              ></Text>
              <Textarea
                              placeholder="Price"
                              name="price"
                onChange={handleTextChange}
                value={price}
              />
              <Textarea
                              placeholder="Description(Optional)"
                              name="description"
                onChange={handleTextChange}
                value={description}
              />
              

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSellProduct}
              isLoading={loading}
            >Publish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SellProduct;
