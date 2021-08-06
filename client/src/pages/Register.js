import React from 'react'
import { Container, Row, Col, Form, Button,Card } from "react-bootstrap";
import {useState} from "react"

export default function Register() {
    const [formData,setFormData]=useState({
        email:"",
        username:"",
        password:"",
        confirmPassword:""
      });

      const submitRegisterForm=(e)=>{
        e.preventDefault()
      }
    return (
        <>
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={submitRegisterForm}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={e=>setFormData({...formData,email:e.target.value})} value={formData.email} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" onChange={e=>setFormData({...formData,username:e.target.value})} value={formData.username} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"  onChange={e=>setFormData({...formData,password:e.target.value})} value={formData.password} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" onChange={e=>setFormData({...formData,confirmPassword:e.target.value})} value={formData.confirmPassword} />
            </Form.Group>
            <div className="text-center">
            <Button variant="primary" type="submit">
              Register
            </Button>
            </div>        
          </Form>
        </Col>
      </Row>
            
        </>
    )
}
