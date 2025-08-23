import './App.css';
import ChatWindow from './components/ChatWindow';
import BackgroundParticles from './components/BackgroundParticles';
import logo from './assets/logo.png';
import instagramLogo from './assets/instagram-logo.png';

function App() {
  return (
    <>
      <BackgroundParticles />
      <div className="app-container">
        
        {/* --- CHECK THIS SECTION CAREFULLY --- */}
        <div className="header">

          {/* Child #1: A single container for the logo and title */}
          <div className="logo-title-container">
            <div className="logo-container">
              <img src={logo} alt="Naatu Ruchulu Logo" />
            </div>
            <div className="title-area">
              <h1>NAATU AI</h1>
              <p>Spicy Yet Flavourful</p>
            </div>
          </div>

          {/* Child #2: The Instagram button */}
          <a
            href="https://www.instagram.com/naatu__ruchulu?utm_source=ig_web_button_share_sheet&igsh=eWs5d2dhMDYwOGk5" // Remember to change this link
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-button"
          >
            <img src={instagramLogo} alt="Instagram Logo" />
          </a>

        </div>
        {/* --- END OF HEADER SECTION --- */}
        
        <ChatWindow />

      </div>
    </>
  );
}

export default App;