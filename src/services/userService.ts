@@ .. @@
 export const userService = {
   // Save delivery address for user
   async saveDeliveryAddress(userId: string, address: DeliveryAddress): Promise<void> {
     try {
       const userRef = doc(db, 'users', userId);
       await updateDoc(userRef, {
         deliveryAddress: address,
         updatedAt: new Date().toISOString()
       });
     } catch (error) {
       console.error('Error saving delivery address:', error);
       throw new Error('Failed to save delivery address');
     }
   },

   // Get delivery address for user
   async getDeliveryAddress(userId: string): Promise<DeliveryAddress | null> {
     try {
       const userDoc = await getDoc(doc(db, 'users', userId));
       if (userDoc.exists()) {
         const userData = userDoc.data();
         return userData.deliveryAddress || null;
       }
       return null;
     } catch (error) {
       console.error('Error fetching delivery address:', error);
       return null;
     }
   },

   // Update user profile
   async updateUserProfile(userId: string, updates: Partial<any>): Promise<void> {
     try {
       const userRef = doc(db, 'users', userId);
       await updateDoc(userRef, {
         ...updates,
         updatedAt: new Date().toISOString()
       });
     } catch (error) {
       console.error('Error updating user profile:', error);
       throw new Error('Failed to update profile');
     }
+  },
+
+  // Get user profile statistics
+  async getUserStats(userId: string): Promise<{
+    totalOrders: number;
+    totalSpent: number;
+    wishlistItems: number;
+    reviewsGiven: number;
+    memberSince: string;
+    lastLogin?: string;
+  }> {
+    try {
+      const userDoc = await getDoc(doc(db, 'users', userId));
+      if (!userDoc.exists()) {
+        throw new Error('User not found');
+      }
+
+      const userData = userDoc.data();
+      
+      // These would typically come from aggregated data or separate collections
+      // For now, we'll return mock data that would be calculated from actual orders
+      return {
+        totalOrders: 0, // Would be calculated from orders collection
+        totalSpent: 0, // Would be calculated from paid orders
+        wishlistItems: 0, // Would come from wishlist collection or user data
+        reviewsGiven: 0, // Would be calculated from reviews collection
+        memberSince: userData.createdAt || new Date().toISOString(),
+        lastLogin: userData.lastLogin
+      };
+    } catch (error) {
+      console.error('Error fetching user stats:', error);
+      throw new Error('Failed to fetch user statistics');
+    }
+  },
+
+  // Update last login timestamp
+  async updateLastLogin(userId: string): Promise<void> {
+    try {
+      const userRef = doc(db, 'users', userId);
+      await updateDoc(userRef, {
+        lastLogin: new Date().toISOString(),
+        updatedAt: new Date().toISOString()
+      });
+    } catch (error) {
+      console.error('Error updating last login:', error);
+      // Don't throw error for this non-critical operation
+    }
+  },
+
+  // Save user preferences
+  async saveUserPreferences(userId: string, preferences: {
+    emailNotifications?: boolean;
+    smsNotifications?: boolean;
+    marketingEmails?: boolean;
+    orderUpdates?: boolean;
+    language?: string;
+    currency?: string;
+  }): Promise<void> {
+    try {
+      const userRef = doc(db, 'users', userId);
+      await updateDoc(userRef, {
+        preferences,
+        updatedAt: new Date().toISOString()
+      });
+    } catch (error) {
+      console.error('Error saving user preferences:', error);
+      throw new Error('Failed to save preferences');
+    }
+  },
+
+  // Get user preferences
+  async getUserPreferences(userId: string): Promise<any> {
+    try {
+      const userDoc = await getDoc(doc(db, 'users', userId));
+      if (userDoc.exists()) {
+        const userData = userDoc.data();
+        return userData.preferences || {
+          emailNotifications: true,
+          smsNotifications: false,
+          marketingEmails: true,
+          orderUpdates: true,
+          language: 'fr',
+          currency: 'EUR'
+        };
+      }
+      return null;
+    } catch (error) {
+      console.error('Error fetching user preferences:', error);
+      return null;
+    }
   }
 };