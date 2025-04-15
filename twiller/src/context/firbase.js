
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBlykSvq0kyjpryrpOMfCl4kxNZYIy9BI",
  authDomain: "twiller-twitterclone-2a0e2.firebaseapp.com",
  projectId: "twiller-twitterclone-2a0e2",
  storageBucket: "twiller-twitterclone-2a0e2.firebasestorage.app",
  messagingSenderId: "299553073111",
  appId: "1:299553073111:web:6fab1ba477c78d68c3cd92"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app
// const analytics = getAnalytics(app);
