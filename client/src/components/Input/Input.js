import React from "react";
import "./Input.css";

const Input = ({message,setMessage,sendMessage})=>{
    const HandleChange = (event)=>{
        //console.log(event.target.value);
        setMessage(event.target.value);
    }
    return(
        <form className="form">
            <input 
            className="input" 
            type="text" 
            value={message}
            placeholder="Type a Message"
            onChange={HandleChange}
            onKeyPress = {event=>event.key==='Enter'?sendMessage(event):null}
            />
            <button className="sendButton" onClick={(event)=>sendMessage(event)}>Send </button>
        </form>
    );
}
export default Input;