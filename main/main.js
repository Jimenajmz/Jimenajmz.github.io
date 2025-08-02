function stars() {
    let e = document.createElement("div");
    e.setAttribute("class", "star");
    document.getElementById('snow-container').appendChild(e);
    e.style.left = Math.random() * +innerWidth + "px";
  
    let size = Math.random() * 12;
    let duration = Math.random() * 3;
  
    e.style.fontSize = setRandomSize() + "px";
    e.style.animationDuration = 3 + duration + "s";
    setTimeout(function () {
      document.body.removeChild(e);
    }, 5000);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const star = document.querySelector('.star');
    // Additional JavaScript to control the animation if needed
  });

  setInterval(function () {
    stars();
  }, 200);

  function setRandomSize() {
    // Generate a random number between 4 and 100
    const randomSize = Math.random() * (100 - 4) + 4

    // Edit randomSize that is 99.7x more likely to be a number between 0-12 than from 13-100
    if (randomSize > 12) {
      const probability = 0.997; // Adjust the probability based on the range
      if (Math.random() > probability) {
        return Math.floor(randomSize);
      } else {
        return setRandomSize();
      }
    }

    return randomSize
  }

  function setRandomOpacity() {
    // Generate a random number between 0.1 and 1
    // const randomOpacity = Math.random() * (1 - 0.1) + 0.1

    //Generate a random number between 0 and 255
    const randomOpacity = Math.floor(Math.random() * 256)

    // Set the CSS variable --opacity to the generated random number
    document.documentElement.style.setProperty('--opacity', randomOpacity);
}

// Call the function to set a random opacity
setRandomOpacity();
