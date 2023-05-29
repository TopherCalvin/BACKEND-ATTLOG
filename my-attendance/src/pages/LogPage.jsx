import { Center, Box, Flex, Icon, Input } from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Log() {
  const userSelector = useSelector((state) => state.auth);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (userSelector.id) {
      getAll();
    }
  }, []);
  async function getAll() {
    const all = await axios.get("http://localhost:2000/attendancelog/all", {
      params: {
        user_id: userSelector.id,
      },
    });
    setAttendance(all);
  }
  async function getFilter(time) {
    const filter = await axios.get(
      "http://localhost:2000/attendancelog/filter",
      {
        params: {
          user_id: userSelector.id,
          time: time,
        },
      }
    );
    setAttendance(filter);
  }
  return (
    <Center h={"100vh"} w={"100vw"}>
      <Box id="boxLogin" w={"390px"} h={"844px"}>
        <Box
          w={"100%"}
          bg={"rgb(191,41,53)"}
          borderTopRadius={"30px"}
          borderBottom={"1px"}
        >
          <Flex
            fontSize={"30px"}
            color={"white"}
            alignItems={"center"}
            padding={"10px"}
          >
            <Link to={"/"}>
              <Icon as={AiOutlineArrowLeft}></Icon>
            </Link>
            <Center paddingLeft={"45px"}>Attendance Log</Center>
          </Flex>
          <Flex flexDir={"column"} padding={"15px"} fontSize={"20px"}>
            <Flex>Select month:</Flex>
            <Input
              type="month"
              onChange={(e) => getFilter(e.target.value)}
            ></Input>
          </Flex>
        </Box>
        <Flex
          justifyContent={"space-between"}
          w={"100%"}
          padding={"15px"}
          alignItems={"center"}
          borderBottom={"1px"}
        >
          <Flex
            w={"25%"}
            justifyContent={"center"}
            fontWeight={"bold"}
            border={"1px"}
            borderRadius={"5px"}
          >
            Date
          </Flex>
          <Flex
            w={"25%"}
            justifyContent={"center"}
            fontWeight={"bold"}
            border={"1px"}
            borderRadius={"5px"}
          >
            Clock In
          </Flex>
          <Flex
            w={"25%"}
            justifyContent={"center"}
            fontWeight={"bold"}
            border={"1px"}
            borderRadius={"5px"}
          >
            Clock Out
          </Flex>
        </Flex>
        {attendance.data?.length
          ? attendance?.data.map((val) => {
              return (
                <Flex
                  justifyContent={"space-between"}
                  w={"100%"}
                  padding={"15px"}
                  alignItems={"center"}
                  borderBottom={"1px"}
                >
                  <Flex w={"25%"} justifyContent={"center"}>
                    {moment().format("ll").split(",")[0]}
                  </Flex>
                  <Flex w={"25%"} justifyContent={"center"}>
                    {val.clock_in ? moment(val.clock_in).format("HH:mm") : "-"}
                  </Flex>
                  <Flex w={"25%"} justifyContent={"center"}>
                    {val.clock_out
                      ? moment(val.clock_out).format("HH:mm")
                      : "-"}
                  </Flex>
                </Flex>
              );
            })
          : null}
      </Box>
    </Center>
  );
}
