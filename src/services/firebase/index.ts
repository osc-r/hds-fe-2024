import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  AuthError,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "../../config/firebase.config";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

class FirebaseService {
  app: FirebaseApp;
  auth: Auth;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  async logout() {
    try {
      await signOut(this.auth);
      return true;
    } catch (error: unknown) {
      console.log(error);
      return false;
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  async login() {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
      const result = await signInWithPopup(this.auth, provider);
      return { success: true, msg: null, payload: result };
    } catch (error: AuthError | unknown) {
      const errorCode = (error as AuthError).code;

      let msg = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      switch (errorCode) {
        case "auth/user-not-found":
        case "auth/wrong-password":
          msg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
          break;
        case "auth/user-disabled":
          msg = "บัญชีถูกระงับการใช้งาน";
          break;
        default:
          break;
      }

      return { success: false, msg, payload: null };
    }
  }
}
const firebaseService = new FirebaseService();

export default firebaseService;
