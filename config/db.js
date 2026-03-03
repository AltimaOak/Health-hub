const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
require('dotenv').config();

const firebaseConfig = {
    apiKey: "AIzaSyB50iKIjx6NRnnrMcJSaZMnmLkjBx73LdM",
    authDomain: "hack-7bde8.firebaseapp.com",
    databaseURL: "https://hack-7bde8-default-rtdb.firebaseio.com",
    projectId: "hack-7bde8",
    storageBucket: "hack-7bde8.firebasestorage.app",
    messagingSenderId: "567145523824",
    appId: "1:567145523824:web:8a75ced35c19f3150622b5",
    measurementId: "G-6KJSN0GXWV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = db;
