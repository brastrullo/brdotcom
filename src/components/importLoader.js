import animateMenuItems from './animateMenuItem';
import dimUI from './dimUI';
import introAnimation from './introAnimation';

export default function loader() {
  animateMenuItems();
  introAnimation();
  dimUI();
}
