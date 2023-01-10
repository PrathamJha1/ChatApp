import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import {useLocation} from "react-router-dom";
import InfoBar from "../InfoBar/InforBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import './Chat.css';
import TextContainer from "../TextContainer/TextContainer";

const ENDPOINT = 'https://chatapp-dicordstyle.netlify.app/';
let socket;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const url = useLocation().search;
  useEffect(() => {
    const { name, room } = queryString.parse(url);
    socket = io(ENDPOINT,{
      cors:{
        origin:"*"
      }
    });
    console.log(socket);
    setRoom(room);
    setName(name);
    socket.emit('join',{name,room},()=>{});
    return ()=>{
      socket.emit('disconnect');
      socket.off();
    }
    //console.log(socket)
  }, [ENDPOINT, url]);
  useEffect(()=>{
    socket.on('message',(message)=>{
      setMessages([...messages,message]);
    })
    socket.on('roomData',({users})=>{
      setUsers(users);
    })
  },[messages]);
  //function for sending messages
const sendMessage =(event)=>{
  event.preventDefault();
  if(message){
    socket.emit('sendMessage',message,()=>{
      setMessage('');
    });
  }
}

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room}/>
        <Messages messages={messages} name={name}/>
        <Input message={message} sendMessage ={sendMessage} setMessage={setMessage}/>
      </div>
      <TextContainer users ={users}/>
    </div>
  );
}

export default Chat;