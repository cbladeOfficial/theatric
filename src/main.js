// import 'animate.css';

function execOnLoad() {
  new Audio('/assets/sounds/startup.mp3').play();
  document.getElementById("homebtn").focus();
  focussed = "homebtn";
  document.getElementById("homepage").style.display = "block";
}