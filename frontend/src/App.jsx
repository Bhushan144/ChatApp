import React, { useEffect, useRef, useState } from 'react';
// TODO: Import your socket connection function here later
import { connectWebsocket } from './websocket';


function App() {
  // --- State variables ---
  const timer = useRef(null);

  const [inputName, setInputName] = useState('');
  const [username, setUsername] = useState(''); // Set default username to match image
  const [showNamePopup, setShowNamePopup] = useState(true); // Hide popup for now
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const [typers, setTypers] = useState([]);

  // TODO: Create a ref for the socket here later
  const socket = useRef(null);

  // --- Helper Functions ---
  const formatTime = (date) => {
  const d = new Date(date);

  let hours = d.getHours();        // 0–23
  const minutes = d.getMinutes().toString().padStart(2, '0');

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;        // 0 → 12, 13 → 1

  return `${hours}:${minutes} ${period}`;
};


  const handleNameSubmit = (e) => {
    e.preventDefault();

    let cleanName = inputName.trim();

    if (cleanName) {
      setUsername(cleanName);
      setShowNamePopup(false);

      socket.current.emit("joinRoom", cleanName)
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent form refresh

    if (text.trim()) {
      // TODO: 1. Create the message object
      const messageData = {
        user: username,
        text: text,
        time: new Date()
      };

      // TODO: 2. Emit the message to the server using socket
      socket.current.emit("chatMessage", messageData);

      setMessages((prev) => [...prev, messageData]);

      setText(''); // Clear input after sending
    }
  };

  // --- Effects ---
  useEffect(() => {
    // TODO: Initialize Socket.io connection here
    socket.current = connectWebsocket();

    socket.current.on("connect", () => {
      // console.log("connected", socket.current.id)
    })


    socket.current.on("roomNotice", (userName) => {  //listen for who joined the group message which is emmited from server
      // console.log(`${userName} joined the group`)
    })

    socket.current.on("chatMessage", (messageData) => {
      setMessages((prev) => {
        return [...prev, messageData]
      })
    })

    socket.current.on("typing", (username) => {
      setTypers((prev) => {
        const isExist = prev.find((typer) => typer === username)
        if (!isExist) {
          return [...prev, username]
        }
        return prev;
      })
    })

    socket.current.on("stopTyping", (username) => {
      setTypers((prev) => {
        return prev.filter((typer) => typer !== username);
      });
    });



    // Cleanup function
    return () => {
      // TODO: Disconnect socket here
      socket.current.off('roomNotice');
      socket.current.off('chatMessage');
      socket.current.off('typing');
      socket.current.off('stopTyping');
    };
  }, []);

  useEffect(() => {
    if (text) {
      socket.current.emit("typing", username);
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      socket.current.emit("stopTyping", username);
    }, 700)

    return ()=>{
      clearTimeout(timer.current)
    }

  }, [text, username])

  // --- JSX Rendering ---
  return (
    <div className="app-container" style={styles.appContainer}>

      {/* 1. Name Popup Modal */}
      {showNamePopup && (
        <div className="popup-overlay" style={styles.overlay}>
          <div className="popup" style={styles.popup}>
            <h2>Enter your name to join</h2>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Username..."
              style={styles.input}
            />
            <button onClick={handleNameSubmit} style={styles.button}>Join Chat</button>
          </div>
        </div>
      )}

      {/* 2. Main Chat Interface */}
      {!showNamePopup && (
        <div className="chat-window " style={styles.chatWindow}>
          <div className="chat-header " style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatar}>R</div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Realtime group chat</h3>
                {
                  typers.length ? <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{typers.join(", ")} is typing... </p> : ""
                }
              </div>
            </div>
            <div style={styles.headerRight}>
              Signed in as <strong>{username}</strong>
            </div>
          </div>

          <div className="messages-list" style={styles.messageList}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageBubble,
                  backgroundColor: msg.user === username ? "#dcf8c6" : "#ffffff",
                  alignSelf: msg.user === username ? 'flex-end' : 'flex-start',
                }}
              >
                <p style={{ margin: '0 0 5px 0' }}>{msg.text}</p>
                <div style={styles.messageInfo}>
                  <strong style={{ margin: '0px 5px 0px 0px' }}>{msg.user}</strong> <span>{formatTime(msg.time)}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={styles.inputArea}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              style={styles.messageInput}
            />
            <button type="submit" style={styles.sendButton}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

// Updated inline styles to match the image
const styles = {
  appContainer: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif'
  },
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  popup: {
    backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', minWidth: '300px'
  },
  chatWindow: {
    width: '500px', height: '600px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
  },
  header: {
    padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  headerLeft: {
    display: 'flex', alignItems: 'center', gap: '10px'
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
  },
  headerRight: {
    fontSize: '14px', color: '#666'
  },
  messageList: {
    flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#f8f9fa'
  },
  messageBubble: {
    padding: '10px 15px', borderRadius: '18px', maxWidth: '75%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    backgroundColor: '#dcf8c6', color: '#000',
    borderBottomRightRadius: '4px'
  },
  messageInfo: {
    fontSize: '11px', color: '#555', display: 'flex', justifyContent: 'space-between', marginTop: '5px', gap:'30px'
  },
  inputArea: {
    padding: '15px 20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', backgroundColor: '#fff'
  },
  messageInput: {
    flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none'
  },
  sendButton: {
    padding: '10px 20px', backgroundColor: '#25d366', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'
  },
  input: {
    padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%', marginBottom: '10px'
  },
  button: {
    padding: '10px 20px', backgroundColor: '#128c7e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
  }
};

export default App;
