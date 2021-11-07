import React,{useState,useEffect} from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../../context/auth";

import { gql, useQuery,useLazyQuery } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    getUsers {
    username
    createdAt
    imageUrl
    latestMessage{
      content
    }
    }
  }
`;

const GET_MESSAGES = gql`
query getMessages($from:String!){
  getMessages(from:$from){
      uuid
      from
      to
      content
      createdAt   
  }
}
`;

export default function Home({ history }) {
  const dispatch = useAuthDispatch();

  const [selectedUser,setSelectedUser]= useState(null)
  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const [getMessages,{loading:messagesLoading,data:messagesData}]=useLazyQuery(GET_MESSAGES)
  useEffect(() => {
    if(selectedUser){
      getMessages({variables:{from:selectedUser}})
    }
    
  }, [selectedUser]);

  if(messagesData){
    console.log("bg-white",messagesData.getMessages)
  }

  const { loading, data, error } = useQuery(GET_USERS);
  let userMarkup = null;
  if (!data || loading) {
    userMarkup = <p>Loading ...</p>;
  } else if (data.getUsers.length === 0) {
    userMarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    userMarkup = data.getUsers.map((user) =>  (<div className="d-flex p-3" key={user.username} onClick={()=>setSelectedUser(user.username)}>
        <Image src={user.imageUrl} roundedCircle style={{height:50, width:50, objectFit:'cover',marginRight:'4%'}}/>
        <div>
        <p>{user.username}</p>
        <p className="font-weight-light">
         {user.latestMessage ? user.latestMessage.content : 'You are now connected'} 
        </p>
        </div>
      </div>)
    );
  }

  return (
    <>
    <Row>
      <Col xs={12} className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="link">Register</Button>
        </Link>
        <Button variant="link" onClick={logOut}>
          LOGOUT
        </Button>
      </Col>
      </Row>
      <Row className="bg-white">
        <Col className="p-0 bg-secondary" xs={4}>
          {userMarkup}
        </Col>
        <Col xs={8}>
          {messagesData && messagesData.getMessages.length > 0 ? (
            messagesData.getMessages.map(msg=>(
              <p key={msg.uuid}>{msg.content}</p>
            ))
          ):(<p>You are now connected</p>)}
        </Col>
      </Row>
    </>
  );
}
 