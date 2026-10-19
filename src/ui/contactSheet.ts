import { requireEl } from '../core/dom';
import { decodePhoneNumber, getMaskedPhonePreview } from '../data/content';
import { createDialog } from './dialog';

export function setupContactSheet() {
  const root = requireEl('#contact-modal');
  const close = requireEl('#contact-modal-close');
  const toast = requireEl('#contact-toast');
  const dialog = createDialog(root, close);
  const phone = requireEl('#contact-phone-value');
  phone.textContent = getMaskedPhonePreview();
  toast.textContent = '';
  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.textContent = 'Copied to clipboard.';
    } catch {
      toast.textContent = 'Clipboard unavailable. Select and copy the value manually.';
    }
  };
  document.querySelectorAll<HTMLElement>('[data-open-contact]').forEach((node) => node.addEventListener('click', () => {
    toast.textContent = '';
    dialog.open();
  }));
  close.addEventListener('click', dialog.close);
  document.addEventListener('contact:open', dialog.open);
  document.querySelectorAll<HTMLElement>('[data-copy-value]').forEach((row) => {
    row.addEventListener('click', () => { void copy(row.dataset.copyValue ?? ''); });
  });
  const reveal = requireEl<HTMLButtonElement>('#phone-reveal-btn');
  reveal.addEventListener('click', () => {
    const value = decodePhoneNumber();
    phone.textContent = value;
    reveal.textContent = 'Copy';
    void copy(value);
  });
  return dialog;
}
