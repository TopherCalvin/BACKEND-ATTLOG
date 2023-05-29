import "../css/login.css";
import { Box, Center, InputGroup, Input, Flex } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ForgetPass() {
  const location = useLocation();
  const [account, setAccount] = useState({
    id: "",
    emna: "",
    password: "",
  });
  async function fetchAcc() {
    await axios
      .get("http://localhost:2000/Users/token2", {
        params: { token: location.pathname.split("/")[2] },
      })
      .then((res) => {
        console.log(res.data);
        setAccount(res.data);
      });
  }
  useEffect(() => {
    fetchAcc();
  }, []);
  async function onSubmit() {
    const checkEmail = await axios
      .patch("http://localhost:2000/Users/token2/changePass", account, {
        params: { id: account.id },
      })
      .then((res) => {
        if (res.data.id) {
          console.log(res.data);
          return true;
        } else {
          return false;
        }
      });
    if (checkEmail) {
      return alert("password change berhasil");
    } else {
      return alert("password change failed");
    }
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
            Enter Your Email
          </Center>
          <Center>
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
                placeholder=""
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
              ></Input>
            </InputGroup>
          </Center>
          <Center paddingTop={"40px"} paddingBottom={"20px"}>
            Enter New Password
          </Center>
          <Center>
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
                placeholder="New Password"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                id="password"
                value={account.password}
                onChange={inputHandler}
              ></Input>
              <Input
                placeholder="Confirm New Password"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
              ></Input>
            </InputGroup>
          </Center>
          <Center
            w={"150px"}
            h={"48px"}
            borderRadius={"25px"}
            border={"1px solid #A5A5A5"}
            onClick={onSubmit}
            cursor={"pointer"}
          >
            Forget
          </Center>
        </Center>
      </Box>
    </Center>
  );
}
