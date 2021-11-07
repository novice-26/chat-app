import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

export default function Register(props) {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update:(_, res) => props.history.push("/login"),
    onError(err){
      console.log("err", err);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    registerUser({
      variables: {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
    });
  };
  return (

    <>
      <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={submitRegisterForm}>
            <Form.Group className="mb-3">
              <Form.Label className={errors.email && "text-danger"}>
                {errors.email ?? "Email Address"}
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className={errors.email && 'is-invalid'}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                value={formData.email}
              />
            </Form.Group>
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
            <Form.Group className="mb-3">
              <Form.Label className={errors.confirmPassword && "text-danger"}>
                {errors.confirmPassword ?? "Confirm Password"}
              </Form.Label>
              <Form.Control
                type="password"
                className={errors.confirmPassword && 'is-invalid'}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                value={formData.confirmPassword}
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Loading... " : "Register"}
              </Button>
              <br/>
              <small>Already have an account? <Link to="/login">Login</Link></small>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
}
