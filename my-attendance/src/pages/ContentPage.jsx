import "../css/content.css";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Input,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineCheck } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { auth_types } from "../redux/types";
import { useNavigate } from "react-router-dom";

export default function Content() {
  const userSelector = useSelector((state) => state.auth);
  const [clock, setClock] = useState({});
  const inputFileRef = useRef(null);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  let user;
  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    console.log(userSelector);
    if (userSelector.id) {
      getClock();
    }
  }, []);

  async function getClock() {
    const attLog = await axios.get(
      "http://localhost:2000/attendancelog/today",
      {
        params: { user_id: userSelector.id },
      }
    );
    console.log(attLog);
    setClock(attLog.data);
  }

  async function addClockIn() {
    await axios.post(
      "http://localhost:2000/attendancelog?user_id=" + userSelector.id
    );
    getClock();
  }
  async function addClockOut() {
    await axios.patch(
      "http://localhost:2000/attendancelog?user_id=" + userSelector.id
    );
    getClock();
  }

  const [time, setTime] = useState(moment());
  const Clock = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(moment());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return (
      <div>
        <Center fontSize={"30px"} fontWeight={"bold"} color={"white"}>
          {time.format("LTS")}
        </Center>
      </div>
    );
  };

  const [date, setDate] = useState(moment());
  const Date = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        setDate(moment());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return (
      <div>
        <Center>{date.format("LL")}</Center>
      </div>
    );
  };

  async function uploadAvatar() {
    const formData = new FormData();
    formData.append("avatar", selectedFile);
    await axios
      .post("http://localhost:2000/Users/image/v1/" + userSelector.id, formData)
      .then((res) => (user = res.data));
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      const userData = await axios
        .get("http://localhost:2000/Users/token2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
      if (user) {
        await dispatch({
          type: auth_types.login,
          payload: userData,
        });
      }
    }
  }

  function logout() {
    dispatch({ type: auth_types.logout });
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <Center h={"100vh"} w={"100vw"}>
      <Box id="boxLogin" w={"390px"} h={"844px"} maxH={"844px"}>
        <Box h={"500px"} bg={"rgb(191,41,53)"} borderRadius={"30px"}>
          <Flex
            justifyContent={"end"}
            paddingRight={"15px"}
            paddingTop={"15px"}
            gap={"10px"}
          >
            {selectedFile ? (
              <Icon
                as={AiOutlineCheck} //AiOutlineCheck
                boxSize={"30px"}
                color={"white"}
                border={"1px"}
                borderRadius={"5px"}
                onClick={() => {
                  uploadAvatar();
                  setSelectedFile("");
                }}
                cursor={"pointer"}
                _hover={{ color: "black" }}
              ></Icon>
            ) : (
              <Icon
                as={FiLogOut} //AiOutlineCheck
                boxSize={"30px"}
                color={"white"}
                border={"1px"}
                borderRadius={"5px"}
                onClick={logout}
                cursor={"pointer"}
                _hover={{ color: "black" }}
              ></Icon>
            )}
          </Flex>
          <Center
            paddingTop={"20px"}
            paddingBottom={"10px"}
            fontSize={"30px"}
            color={"white"}
          >
            Live Attendance
          </Center>
          <Center>
            <Input
              accept="image/png, image/jpeg"
              ref={inputFileRef}
              type="file"
              onChange={handleFile}
              display={"none"}
            ></Input>
            <Button
              onClick={() => inputFileRef.current.click()}
              colorScheme="teal"
              w={"50px"}
              h={"50px"}
              borderRadius={"50px"}
            >
              <Avatar
                marginY={"5px"}
                src={userSelector.avatar_url}
                w={"50px"}
                h={"50px"}
              />
            </Button>
          </Center>
          <Center color={"white"}>{Date()}</Center>
          <Center id="date">{Clock()}</Center>
          <Center>
            <Box
              id="boxCheck"
              w={"350px"}
              padding={"15px"}
              borderRadius={"15px"}
            >
              <Flex justifyContent={"center"} flexDir={"column"} gap={"5px"}>
                <Center color={"#9a9a9a"}>Schedule: {Date()}</Center>
                <Center fontWeight={"bold"}>SH2OPA</Center>
                <Center fontWeight={"bold"} fontSize={"22"}>
                  08:00 - 17:00
                </Center>
                <Center color={"#617aca"}>
                  See 1 other attendance location
                </Center>
                <Center
                  bg={"rgb(224,235,247)"}
                  borderRadius={"15px"}
                  color={"#787677"}
                >
                  Selfie photo is required to Clock In/Out
                </Center>
                <Flex justifyContent={"center"} gap={"15px"}>
                  <Flex
                    w={"100%"}
                    h={"50px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bg={"#031eaf"}
                    _hover={{ bg: "#035ebf" }}
                    borderRadius={"10px"}
                    color={"white"}
                    onClick={!clock.clock_in ? addClockIn : null}
                    cursor={"pointer"}
                  >
                    Clock In
                  </Flex>
                  <Flex
                    w={"100%"}
                    h={"50px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    bg={"#031eaf"}
                    _hover={{ bg: "#035ebf" }}
                    borderRadius={"10px"}
                    color={"white"}
                    onClick={!clock.clock_out ? addClockOut : null}
                    cursor={"pointer"}
                  >
                    Clock Out
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </Center>
        </Box>
        <Box>
          <Flex
            justifyContent={"space-between"}
            w={"100%"}
            padding={"15px"}
            // borderBottom={"1px"}
          >
            <Flex fontSize={"22px"}>Attendance Log</Flex>
            <Link to={"/log"}>
              <Flex color={"#9a9a9a"} h={"100%"} alignItems={"center"}>
                View Log
              </Flex>
            </Link>
          </Flex>
        </Box>

        {clock.clock_in ? (
          <div>
            <Flex
              justifyContent={"space-between"}
              w={"100%"}
              paddingLeft={"15px"}
              paddingRight={"15px"}
              alignItems={"center"}
              borderBottom={"1px"}
            >
              <Flex flexDir={"column"} w={"80px"}>
                <Flex>{moment(clock.clock_in).format("HH:mm")}</Flex>
                <Flex>{moment().format("ll").split(",")[0]}</Flex>
              </Flex>
              <Flex w={"80px"} justifyContent={"center"} id="clock">
                Clock In
              </Flex>
              <Flex w={"80px"} justifyContent={"end"} id="icon">
                <Icon as={IoIosArrowForward}></Icon>
              </Flex>
            </Flex>
          </div>
        ) : null}
        {clock.clock_out ? (
          <div>
            <Flex
              justifyContent={"space-between"}
              w={"100%"}
              paddingLeft={"15px"}
              paddingRight={"15px"}
              alignItems={"center"}
              borderBottom={"1px"}
            >
              <Flex flexDir={"column"} w={"80px"}>
                <Flex>{moment(clock.clock_out).format("HH:mm")}</Flex>
                <Flex>{moment().format("ll").split(",")[0]}</Flex>
              </Flex>
              <Flex w={"80px"} justifyContent={"center"} id="clock">
                Clock Out
              </Flex>
              <Flex w={"80px"} justifyContent={"end"} id="icon">
                <Icon as={IoIosArrowForward}></Icon>
              </Flex>
            </Flex>
          </div>
        ) : null}
      </Box>
    </Center>
  );
}
