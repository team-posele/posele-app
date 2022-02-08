import {auth, db} from '../firebase';

export let score = 0;

export const getUser = async () => {
  try {
    const users = db.collection('users').doc(auth.currentUser.email);
    const doc = await users.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
      score = doc.data().score;
    }
  } catch (error) {
    console.log('error occured in getting user', error);
  }
};

export const updateUser = async email => {
  try {
    db.collection('users')
      .doc(email)
      .set({
        name: 'Smit Patel',
        score: 3,
      });
  } catch (error) {
    console.log('error occured while updating user. ', error);
  }
};

export const getAllUsers = async () => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    snapshot.forEach(user => {
      console.log('users : ', user.data());
    });
  } catch (error) {
    console.log(error);
  }
};
