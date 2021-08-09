import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const LOGIN_USER = gql`
  query login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Login(props) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError:(err)=>setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted:(data)=>{
        localStorage.setItem('token',data.login.token);
        props.history.push("/")
    }
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    loginUser({
      variables: {
        username: formData.username,
        password: formData.password,
      },
    });
  };

  return (

    <>
      <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Login</h1>
          <Form onSubmit={submitLoginForm}>
            <Form.Group className="mb-3">
              <Form.Label className={errors.username && "text-danger"}>
                {errors.username ?? "Username"}
              </Form.Label>
              <Form.Control
                type="text"
                className={errors.username && 'is-invalid'}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                value={formData.username}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={errors.password && "text-danger"}>
                {errors.password ?? "Password"}
              </Form.Label>
              <Form.Control
                type="password"
                className={errors.password && 'is-invalid'}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                value={formData.password}
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Loading... " : "Login"}
              </Button>
              <br/>
              <small>Don't have an account? <Link to="/register">Register</Link></small>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}

