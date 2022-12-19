import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAtBsdWMtocEQPVS6gCbKLfxaa3wefn3y8",
    authDomain: "omg-vendor-portal.firebaseapp.com",
    databaseURL: "https://omg-vendor-portal-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "omg-vendor-portal",
    storageBucket: "omg-vendor-portal.appspot.com",
    messagingSenderId: "458075419072",
    appId: "1:458075419072:web:0b2afc3260887d1280d825",
    measurementId: "G-STW2TXVPVS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const storage = getStorage(app);

const db = getFirestore(app);

export {
    auth, storage, db
}
