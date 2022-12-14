import React from "react";
import "./Messages.css";
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from "../Message/Message"
const Messages =({messages,name})=>{
    //console.log(messages);
    return(
        <ScrollToBottom className="messages">
        {
            messages.map((row) => {
                return (<Message key={name} text ={row.text}  user = {row.user} name={name}>
                </Message>);
            
        })
        }
        </ScrollToBottom>
    );
}
export default Messages;