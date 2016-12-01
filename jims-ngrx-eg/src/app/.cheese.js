"use strict";
var Cheese = (function () {
    function Cheese() {
    }
    // public static env_vars: IEnvVars;
    Cheese.hiThere = 'Hello, friend!';
    Cheese.config = {
        apiKey: "AIzaSyA30SGQ-4ozFHftYzsHlQxFdqVgbvuaLVU",
        authDomain: "cypherapp-ef93a.firebaseapp.com",
        databaseURL: "https://cypherapp-ef93a.firebaseio.com",
        storageBucket: "cypherapp-ef93a.appspot.com",
        messagingSenderId: "550160402640"
    };
    return Cheese;
}());
exports.Cheese = Cheese;
