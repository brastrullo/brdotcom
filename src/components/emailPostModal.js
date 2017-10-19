import modal from './modal';
import { elClass } from '../utils';

const emailConfirmedModal = () => {
  const confirmed = elClass('div', 'email-confirmation');
  const options = {
    header: 'Sent',
    size: 'xsmall',
    primaryBtn: 'Okay',
    primaryFn: modal.close,
  };
  confirmed.innerHTML = 'Message sent.';
  modal.options(options);
  return confirmed;
};

export default emailConfirmedModal;
