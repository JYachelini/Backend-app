// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAE4iMmXhIiePNoWJaxYvXF9j0YxHc5_6s',
	authDomain: 'test-ecommerce-backend.firebaseapp.com',
	projectId: 'test-ecommerce-backend',
	storageBucket: 'test-ecommerce-backend.appspot.com',
	messagingSenderId: '453720949106',
	appId: '1:453720949106:web:6c09549bb6758a09739deb',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)