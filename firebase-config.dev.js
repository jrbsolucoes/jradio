import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// CONFIGURAÇÃO DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCh6YLmFrh4x15PP3-c9NktGj83JUR5cqk",
  authDomain: "jrb-web-radio.firebaseapp.com",
  databaseURL: "https://jrb-web-radio-default-rtdb.firebaseio.com",
  projectId: "jrb-web-radio",
  storageBucket: "jrb-web-radio.firebasestorage.app",
  messagingSenderId: "591499619207",
  appId: "1:591499619207:web:d2076af8eef392072a4122"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Referência ao nó da comunicação ao vivo
const liveDisplayRef = ref(db, "live_display");

export {
  db,
  auth,
  liveDisplayRef,
  ref,
  onValue,
  set,
  update,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};
