# Posele

by Luke Joo, Smit Patel, John Arroyo, and Tyler Monaghan

POSEle is a machine learning mobile game where users can compete against each other by matching a random daily pose. The user gets 3 seconds to view today's full-body pose, and then has 5 seconds to match it to earn a point.

![posele_image](https://user-images.githubusercontent.com/65692356/154356933-a8b41370-a72a-4edd-8362-fcd4ad93e705.png)

### Deployed Site

Check out posele here! https://www.posele.com/

### Tech Stack
- React Native
- Expo
- Node
- Firebase
- Tensorflow.js


<!-- ## Requirements

_'user' refers to a logged-in user unless otherwise specified_

### **Tier 0: MVP**

  <details>

**user experience**

- [ ] Users can open our app on up-to-date iPhone device
- [x] Users can open our app on up-to-date Android device
- [x] Users can Sign Up for an account by providing an email address and password
- [x] Users can Log In to the app by providing their email address and/or username and password
- [x] Users can select a PLAY button to play a single posele
- [x] Users can see their "score"
  - [x] how many posele's they have successfully matched in total
  - [x] users score persists and will display on log-in even if they leave or logout of the app
- [x] Users can share a message to social media saying whether they matched and a link to posele

**engineering requirements**

- [ ] At least one 'posele' hosted through Firebase. Each posele consists of an image and a ML model
      that is trained to recognize the posture/pose of the image subject.
- [x] Create a machine learning model for each posele
- [x] Train the model with our own poses.
- [x] Users authenticate via Firebase
- [x] User database model is established in Firebase

**gameplay**

_When a user presses play to begin a posele:_

- [x] User is provided instructions and prompted to be sure they are in a space where they can move
      and take photographs safely
- [x] User is presented with an image
- [x] User presses READY button
- [x] User device camera opens; photograph is captured after 5 second countdown
- [x] User is taken to a screen telling them whether they matched the posele (pass/fail)

</details>

### **Tier 1**

<details>

**user experience**

- [ ] As a user,
- [ ] A guest:
- [ ] A **guest** can play a trial with a single posele
- [ ] Can’t view global leader board, or anonymized
- [ ] Global leader board: can view your score and others’ scores
- [ ] Users can share a message with a screenshot to social media
- [ ] User can select new gameplay option: multi-user party mode (local)

**engineering requirements**

- [ ] **Five 'poseles' hosted through Firebase (high priority)**

**gameplay**

_Users can now select a new game mode: local hot-phone multiplayer ("party mode")_

- [ ] User will be prompted to select a number of players
- [ ] Instructions will appear on screen (players should complete one posele then pass the phone)
- [ ] The game will rapidly display a posele for each player with a short delay and message to PASS
      the device between each
- [ ] After all poseles are complete, show a scoreboard showing the results for each player

</details>

### **Tier 2**

<details>

**user experience**

- [ ] Daily limit - can only attempt one posele per day
  - [ ] accounts marked as admin can ignore this limit and play over and over
- [ ] Users can share link to specific pose/share their results after completing a posele
- [ ] Friends: Users can mark other players on the leaderboard as "Friends"
- [ ] Users can filter leaderboard to show only friends
- [ ] Share username
- [ ] Add/remove friends by username
- [ ] Each user friends list
- [ ] Friends private leader board

**engineering requirements**

- [ ] database model must have a way of indicating whether an account has admin permissions
- [ ] players who are not admin can't access poseles other than the current daily posele

</details>

### **Tier ∞**

<details>

**user experience**

- [ ] Additional user stats and metrics available, e.g:
  - [ ] % of users who successfully completed this posele
  - [ ] current streak of correct poseles
  - [ ] current daily streak
- [ ] Display POSEle rank
- [ ] Subscription to allow users to send us money
- [ ] User can select to receive daily push notification reminders of daily posele at select time
- [ ] User can receive push notifications alerting them that a friend has shared or completed a
      posele
- [ ] New gameplay mode: Synchronous game experience
- [ ] Share pose improvements:
  - [ ] Share button redirects to social networking site with pre-formed post including screenshot
        and link
- [ ] Link to the same pose the user attempted (from outside of app)
- [ ] Practice mode: play without a timer to understand the game mechanics without time pressure
- [ ] Camera overlay: the partially-transparent image source is overlaid over the camera preview
      when counting down to take posele photo
- [ ] Choose difficulty (easy vs hard)
- [ ] Post to Instagram/Twitter

**gameplay**

- [ ] new gameplay mode: remote synchronous multiplayer ("BYOD" party mode)

  - [ ] one user starts the app and selects this option, then "host"
  - [ ] user is provided with a short code to share with friends
  - [ ] friends start the app and select this option, then "join"
  - [ ] friends each enter the key and are joined to the host lobby
  - [ ] once all players have joined, host can press Play
  - [ ] all players play the same single posele simultaneously. Hijinks ensue

- [ ] altering difficulty changes the selection of poseles available and time limit

**engineering requirements**

- [ ] Admin panel - admin users can access backend and add/edit/delete users, poseles, and
      leaderboards via the app or a web portal
- [ ] Add license

</details>
 -->
