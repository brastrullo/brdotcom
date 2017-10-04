import loadingScreen from './loadingScreen';
import animateMenuItems from './animateMenuItem';
import dimUI from './dimUI';
import introAnimation from './introAnimation';

export default function loader() {
  loadingScreen();
  animateMenuItems();
  introAnimation();
  dimUI();
}

