import "../css/login.css";
import { Box, Center, InputGroup, Input, Select } from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Register() {
  const nav = useNavigate();

  useEffect(() => {
    companyId();
  }, []);

  const [companyList, setCompanyList] = useState([]);

  const companyId = async () => {
    await axios
      .get("http://localhost:2000/Companies", companyList)
      .then((res) => {
        setCompanyList(res.data);
        console.log(res.data);
      });
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      company_id: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Enter a name for your profile."),
      email: Yup.string()
        .required("You need to enter your email.")
        .email(
          "This email is invalid. Make sure it's written like example@email.com."
        ),
      address: Yup.string().required("Enter your address."),

      password: Yup.string().min(8, "Your password is too short."),
      ConfirmPassword: Yup.string()
        .required("Re-enter your password")
        .oneOf([Yup.ref("password"), "Passwords do NOT match"]),
      company_id: Yup.string().required("Select your company"),
    }),
    onSubmit: async () => {
      const { name, email, address, password, company_id } = formik.values;
      const account = { name, email, address, password, company_id };
      console.log(account);
      const checkEmail = await axios
        .get("http://localhost:2000/Users/v1", {
          params: { emna: account.email, password: account.password },
        })
        .then((res) => {
          if (res.data.length) {
            return true;
          } else {
            return false;
          }
        });
      if (checkEmail) {
        return alert("email already used");
      } else {
        await axios
          .post("http://localhost:2000/Users/", account)
          .then((res) => {
            alert("register was successful");
            nav("/login");
          });
      }
    },
  });

  async function inputHandler(event) {
    const { value, id } = event.target;
    formik.setFieldValue(id, value);
  }

  console.log(formik);

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
            Create Account
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
                onChange={inputHandler}
                placeholder="Enter Your Full Name"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                id="name"
              ></Input>
              <Box color={"red"} display={formik.errors.name ? "box" : "none"}>
                {formik.errors.name}
              </Box>
              <Input
                onChange={inputHandler}
                placeholder="Email"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                id="email"
              ></Input>
              <Box color={"red"} display={formik.errors.email ? "box" : "none"}>
                {formik.errors.email}
              </Box>
              <Input
                onChange={inputHandler}
                placeholder="Address"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                id="address"
              ></Input>
              <Box
                color={"red"}
                display={formik.errors.address ? "box" : "none"}
              >
                {formik.errors.address}
              </Box>
              <Input
                onChange={inputHandler}
                placeholder="Password"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                type={"password"}
                id="password"
              ></Input>
              <Box
                color={"red"}
                display={formik.errors.password ? "box" : "none"}
              >
                {formik.errors.password}
              </Box>
              <Input
                onChange={inputHandler}
                placeholder="Confirm Password"
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                type={"password"}
                id="ConfirmPassword"
              ></Input>
              <Box
                color={"red"}
                display={formik.errors.ConfirmPassword ? "box" : "none"}
              >
                {formik.errors.ConfirmPassword}
              </Box>
              <Select
                onChange={inputHandler}
                w={"300px"}
                h={"48px"}
                border={"1px solid #A5A5A5"}
                placeholder="Select Company"
                id="company_id"
              >
                {companyList.map((val) => (
                  <option value={val.id}>{val.name}</option>
                ))}
              </Select>
              <Box
                color={"red"}
                display={formik.errors.company_id ? "box" : "none"}
              >
                {formik.errors.company_id}
              </Box>
            </InputGroup>
          </Box>

          <Center
            w={"150px"}
            h={"48px"}
            borderRadius={"25px"}
            border={"1px solid #A5A5A5"}
            onClick={formik.handleSubmit}
            cursor={"pointer"}
          >
            Register Now
          </Center>

          <Center paddingTop={"20px"} gap={"5px"}>
            Already have an account?
            <Link to={"/login"}>
              <Center color={"blue.600"} textDecor={"underline"}>
                Login
              </Center>
            </Link>
          </Center>
        </Center>
      </Box>
    </Center>
  );
}
