import '@fontsource-variable/inter/latin.css';
import '@fontsource-variable/jetbrains-mono/latin.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/typography.css';
import './styles/components/ui.css';
import { setupScroll } from './core/scroll';
import { setupReveals } from './core/motion';
import { setupInteractions } from './ui/interactions';

setupScroll();
setupInteractions();
document.fonts.ready.then(setupReveals);
