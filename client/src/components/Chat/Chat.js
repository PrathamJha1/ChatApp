import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import {useLocation} from "react-router-dom";


// import './Chat.css';

const ENDPOINT = 'http://localhost:5000';

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

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)
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
console.log(message,messages);
  return (
    <div className="outerContainer">
      <div className="container">
        <input value={message} onChange={(event)=>{setMessage(event.target.value)}} onKeyPress={event => event.key === 'Enter' ? sendMessage(event):null}/>
      </div>
      Chat
    </div>
  );
}

export default Chat;