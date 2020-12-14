import React,{useState,useEffect} from 'react'
import queryString from 'query-string';
import io from "socket.io-client";
import './Chat.css'
import InfoBar from '../InfoBar/InforBar.js';
import '../Input/Input.css'
import Messages from '../Messages/Messages.js'
import TextContainer from '../TextContainer/TextContainer';
let socket;


const Chat=({location})=>{
    const[name,setName]=useState('');
    const[room,setRoom]=useState('');
    const [users,setUsers]=useState('');
    const[message,setMessage]=useState('');
    const[messages,setMessages]=useState([]);


    const ENDPOINT='https://realtime-chat-application1.herokuapp.com/';
    useEffect(()=>{
const {name,room}= queryString.parse(location.search)
socket=io(ENDPOINT);

setName(name);
setRoom(room);
 socket.emit('join',{name,room},()=>{});
return ()=>{
    socket.emit('disconnected');
    socket.off();
}

},[ENDPOINT,location.search]);

useEffect(()=>{
    socket.on('message',(message)=>{
      setMessages([...messages,message]);
    })


  socket.on("roomData",({users})=>{
      setUsers(users)
  })
},[messages]);
  const sendMessage = (event) =>{
     event.preventDefault();
      if(message){
          socket.emit('sendMessage',message,()=>setMessage(''));
      }
      
  }
  console.log(message,messages);
    return(
    <div className="outerContainer"> 
        <div className="container">
               <InfoBar  room={room}/>
               
               <Messages messages={messages} name={name} />
         <form className="form"> <input className="input"
   type="text"
   placeholder="type a message" value={message} onChange={(event)=>setMessage(event.target.value)}
            onKeyPress={event=>event.key==='Enter'? sendMessage(event) : null}/>
     <button className="sendButton" onClick={(event)=>sendMessage(event)}>Send</button>
  </form>
   {/*<Input message={message} setMessage={sendMessage} sendMessage={sendMessage} />*/}  

           </div>
           <TextContainer users={users} />
    </div>

) 

}
export default Chat;