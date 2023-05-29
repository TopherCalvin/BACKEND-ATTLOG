import "../css/login.css";
import {
  Box,
  Center,
  InputGroup,
  Input,
  Flex,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../redux/midllewares/userauth";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const toast = useToast();
  const [account, setAccount] = useState({
    emna: "",
    password: "",
  });

  async function onSubmit() {
    toast.closeAll();
    const status = await dispatch(userLogin(account));
    if (status) {
      toast({
        title: "You are successfully logged in",
        status: "success",
        isClosable: true,
      });
      return nav("/");
    }
    return toast({
      title: "wrong email/password",
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  }

  async function inputHandler(event) {
    const { value, id } = event.target;
    const tempObj = { ...account };
    tempObj[id] = value;
    setAccount(tempObj);
  }

  return (
    <Center h={"100vh"} w={"100vw"}>
      <Box id="boxLogin" w={"390px"} h={"844px"}>
        <Center
          h={"100%"}
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
        >
          <Center paddingTop={"40px"} paddingBottom={"20px"}>
            Sign into your Account
          </Center>
          <Box>
            <InputGroup
              gap={"20px"}
              paddingLeft={"30px"}
              paddingRight={"30px"}
              paddingBottom={"20px"}
              display={"flex"}
              flexDir={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Input
                placeholder="Email"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                value={account.emna}
                id="emna"
                onChange={inputHandler}
              ></Input>
              <Input
                placeholder="Password"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                id="password"
                type={"password"}
                value={account.password}
                onChange={inputHandler}
              ></Input>
            </InputGroup>
            <Link>
              <Link to={"/forget/request"}>
                <Flex
                  gap={"20px"}
                  paddingLeft={"30px"}
                  paddingRight={"30px"}
                  paddingBottom={"20px"}
                  color={"blue.600"}
                  textDecor={"underline"}
                >
                  Forget Password
                </Flex>
              </Link>
            </Link>
          </Box>

          <Center
            w={"150px"}
            h={"48px"}
            borderRadius={"25px"}
            border={"1px solid #A5A5A5"}
            onClick={onSubmit}
            cursor={"pointer"}
          >
            LOGIN
          </Center>

          <Center paddingTop={"20px"}>Don't have an account?</Center>

          <Link to={"/register"}>
            <Center color={"blue.600"} textDecor={"underline"}>
              SIGN UP
            </Center>
          </Link>
        </Center>
      </Box>
    </Center>
  );
}
