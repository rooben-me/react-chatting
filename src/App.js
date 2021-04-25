import {useState} from 'react';
import './App.css';

import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCwk1ALNCRptmBOFtF40xrFsMyS4IQyDtg",
    authDomain: "chat-application-6fd3d.firebaseapp.com",
    projectId: "chat-application-6fd3d",
    storageBucket: "chat-application-6fd3d.appspot.com",
    messagingSenderId: "687719031213",
    appId: "1:687719031213:web:905fd036f610cf33fd4124"
}
);

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
       <header>
         <h1>⚛️🔥💬</h1>
         <SignOut />
       </header>

       <section>
         {user ? <ChatRoom/> : <SignIn/>}
       </section>
    </div>
  );
}

function SignIn () {

  const handleSigninwithgoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={handleSigninwithgoogle}>Sign in with google</button>
  )
}

function SignOut () {
  return auth.currentUser && (<button onclick={() => auth.signOut()}>Sign Out</button>)
}

function ChatRoom () {
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, {idField: "id"});

  const [formValue, setFormValue] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    const {uid , photoURL} = auth.currentUser;

    messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }

  return (
    <div>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} messages={msg}/>  )}
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" placeholder="say something nice" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

function ChatMessage (props) {
  const {text, uid , photoURL} = props.messages;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}



export default App;
