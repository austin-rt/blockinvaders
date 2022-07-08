# Block Invaders

## Date: 07/08/2022

### By: Austin Taylor

[Website](http://wwww.austinryantaylor.com) | [GitHub](https://github.com/austinryantaylor) | [LinkedIn](https://www.linkedin.com/in/austin-taylor-62594823a/)

---

### **_Hosted Site_**

[Block Invaders](https://block-invaders.surge.sh/)

### **_Description_**

This is a multi-level, in-browser version of the classic arcade game Space Invaders. The user controls a block that can shoot and move left or right while the enemy descends toward the player. The user automatically moves to the next level if the player defeats all Invader blocks. As the level increments, the speed of the invaders' descension and the bullet travel speed increase while the shooting cooldown time decreases.

### **_Technologies Used_**

- HTML
- CSS
- JavaScript

#### **_Main Javascript Conceptss:_**
    Arrays
      .filter();
      .forEach();
    Loops
      • for
      • while
    classlist.remove();
    classList.add();
    setInterval();
    clearInterval();
    setTimeout();

### **_Getting Started_**

- Use Left Arrow Key or A Key to move left.
- Use Right Arrow Key or D Key to move right.
- Use Up Arrow Key, Spacebar, or W Key to shoot.

### **_Known Bugs_**

- Block Invaders is Currently **desktop only**.
- The minimum width is set to 804px.
- If player shoots too fast, the "bullet" class gets stuck on the div until the player fires in the same column. Implemented a bullet cooldown as a temporary fix.

### **_Screen Shots_**
##### Landing Page

![block-invaders-landing-page-screenshot](https://i.imgur.com/djPMugs.png "Landing Page")

##### Gameplay

![block-invaders-gameplay-screenshot](https://i.imgur.com/DZ3vAFo.png "Gameplay")

##### Shooting

![block-invaders-shooting-screenshot](https://i.imgur.com/mX2PHEU.png "Shooting")

##### Next Level

![block-invaders-next-level-screenshot](https://i.imgur.com/VFtAp5q.png "Next Level")

##### **_Sources_**

[Ania Kubow's Space Invaders](https://github.com/kubowania/space-invaders) served as inspiration with using an array to place the invaders and using <code>classList.remove()</code> and <code>classList.add()</code> to move objects.

### ***Trello Board***

[Block Invaders Trello Board](https://trello.com/b/u5EUgnZs/space-invaders)

### ***Future Features***
1. add Hall Of Fame leaderboard
2. make mobile freindly
3. user choosable color schemes

### ***License***

MIT License

###### Copyright &copy; 2022 Austin Taylor