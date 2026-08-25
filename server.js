const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get(['/', '/index.html'], (req, res) => {
    const fs = require('fs');
    const indexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Inject Firebase API key
    const firebaseApiKey = process.env.FIREBASE_API_KEY || 'AIzaSyAXl39CYI1yWH_CNeS0psgmUfNMBvKLKy0';
    html = html.replace('__FIREBASE_API_KEY__', firebaseApiKey);
    
    res.send(html);
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Send index.html for any other requests
app.get('*', (req, res) => {
    const fs = require('fs');
    const indexPath = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf-8');
    
    const firebaseApiKey = process.env.FIREBASE_API_KEY || 'AIzaSyAXl39CYI1yWH_CNeS0psgmUfNMBvKLKy0';
    html = html.replace('__FIREBASE_API_KEY__', firebaseApiKey);
    
    res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
