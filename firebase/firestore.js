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
    console.log('error occurred in getting user', error);
  }
};

export const updateUser = async (email, username) => {
  try {
    db.collection('users')
      .doc(email)
      .set({
        username,
        score: 0,
        currentStreak: 0,
        maxStreak: 0,
      });
  } catch (error) {
    console.log('error occured while updating user. ', error);
  }
};

export const incrementUserScore = async (matched = false) => {
  try {
    // create user document reference
    const userDocRef = db.collection('users').doc(auth.currentUser.email);

    // get the user document drom the db and extract score, currentStreak, maxStreak
    const userDoc = await userDocRef.get();
    const userDocData = userDoc.data();
    const {score, currentStreak, maxStreak} = userDocData;
    console.log(`score: ${score}\ncurrentStreak: ${currentStreak}\nmaxStreak:${maxStreak}`);

    if (matched) {
      // if user matched the pose, increment score, currentStreak, and if it's greater than maxStreak, that too
      // there should be a built-in increment method but i had trouble getting it to work:
      // https://firebase.google.com/docs/firestore/manage-data/add-data#increment_a_numeric_value
      if (currentStreak + 1 > maxStreak) {
        const response = await userDocRef.update({
          score: score + 1,
          currentStreak: currentStreak + 1,
          maxStreak: currentStreak + 1,
        });
      } else {
        const response = await userDocRef.update({
          score: score + 1,
          currentStreak: currentStreak + 1,
        });
      }
    } else {
      // if the user didn't match the pose, reset currentStreak to 0.
      const response = await userDocRef.update({currentStreak: 0});
    }
  } catch (error) {
    console.log(`error occured while updating user score: ${error}`);
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
