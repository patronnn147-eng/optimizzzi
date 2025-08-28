import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'client';
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        throw new Error('Données utilisateur non trouvées');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('Utilisateur non trouvé');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Mot de passe incorrect');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email invalide');
      }
      throw new Error(error.message || 'Erreur de connexion');
    }
  },

  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      const userData: User = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || '',
        role: 'client', // Default role
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Cette adresse email est déjà utilisée');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Le mot de passe est trop faible');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email invalide');
      }
      throw new Error(error.message || 'Erreur lors de la création du compte');
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Erreur lors de la déconnexion');
    }
  },

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Get user data from Firestore
  async getUserData(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Validate user role for admin interface
  async validateAdminAccess(uid: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role || 'client';
        return userRole === 'admin';
      }
      return false;
    } catch (error) {
      console.error('Error validating admin access:', error);
      return false;
    }
  },

  // Validate user role for client interface
  async validateClientAccess(uid: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role || 'client';
        return userRole === 'client';
      }
      return false;
    } catch (error) {
      console.error('Error validating client access:', error);
      return false;
    }
  },

  // Change user password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('Utilisateur non authentifié');
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Update user document with password change timestamp
      await updateDoc(doc(db, 'users', user.uid), {
        lastPasswordChange: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Mot de passe actuel incorrect');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Le nouveau mot de passe est trop faible');
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Veuillez vous reconnecter avant de changer votre mot de passe');
      }
      throw new Error(error.message || 'Erreur lors du changement de mot de passe');
    }
  },

  // Verify email address
  async sendEmailVerification(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      await sendEmailVerification(user);
    } catch (error: any) {
      console.error('Send email verification error:', error);
      throw new Error(error.message || 'Erreur lors de l\'envoi de l\'email de vérification');
    }
  }
};