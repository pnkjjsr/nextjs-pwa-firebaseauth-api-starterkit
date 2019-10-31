import firebase from "firebase/app";
import "firebase/firestore";

import clientCredentials from "./client";

const db = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
        let db = firebase.firestore();
    }
}
export default db