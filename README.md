# 🔒 Secure Vault Door Simulator

[![Vault Door Preview](image.png)](https://vault.digital-synergy.org/)

> An interactive web-based vault simulator featuring realistic dial mechanics, satisfying animations, and authentic sound effects. Experience the thrill of cracking a combination lock with this high-fidelity security vault interface built with HTML5, CSS3, and JavaScript.

## ✨ Features

- **Interactive Combination Lock**: Rotate the dial using mouse wheel or keyboard controls to select numbers
- **Realistic Mechanics**: Authentic vault door interaction with proper dial positioning
- **Visual Feedback**: Success/failure animations with realistic visuals
- **Sound Effects**: Immersive audio feedback for dial rotation, selection, success, and errors
- **Security System**: Server-validated combination code stored in JSON configuration
- **Responsive Design**: Works on various screen sizes using Bootstrap 5
- **Keyboard Controls**: Alternative controls using keyboard arrows and Enter key

## 🎮 Demo

Enter the correct combination (default: 30-60-90) to unlock the vault and gain access to the secure contents.

### Controls

- **Mouse Wheel**: Rotate the dial clockwise/counterclockwise
- **Click**: Select the current number
- **Arrow Keys**: Rotate the dial left/right
- **Enter**: Select current position
- **Escape**: Reset code entry

## 🛠️ Installation

1. Clone this repository:
```bash
git clone https://github.com/Digital-Synergy2024/vault-door.git
cd vault-door
```

2. No build process required - this is a static web application.

3. Serve the files using any HTTP server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js with http-server
npx http-server
```

4. Open your browser and navigate to `http://localhost:8000` or the appropriate port.

## 🔧 Configuration

The vault combination can be configured in the `vault.json` file:

```json
{
    "validCode": [30, 60, 90],
    "securityLevel": "high",
    "lockoutEnabled": true,
    "maxAttempts": 5,
    "lastUpdated": "05/22/2025"
}
```

Modify the `validCode` array to change the combination.

## 🔍 How It Works

1. The vault door displays a rotating dial with numbers from 0 to 110
2. Users rotate the dial to select specific numbers in sequence
3. The system validates the entered combination against the secure code
4. If correct, access is granted and the user is redirected to the congratulations page
5. If incorrect, the system resets and requires a new attempt

## 🧰 Technologies Used

- **HTML5/CSS3**: Structure and styling
- **JavaScript**: Core functionality and interaction logic
- **Bootstrap 5**: Responsive layout framework
- **SVG**: Vector graphics for the vault door interface
- **Howler.js**: Audio library for sound effects
- **CSS Animations**: Visual feedback and effects

## 💻 Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📋 Future Enhancements

- [ ] Mobile touch controls
- [ ] Multiple security levels with increasing difficulty
- [ ] User-configurable combinations
- [ ] Timed lockout after multiple failed attempts
- [ ] Additional vault door designs/themes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Sound effects from [CodePen Assets](https://codepen.io)
- Inspired by classic bank vault mechanisms
- Icon designs based on traditional security systems
