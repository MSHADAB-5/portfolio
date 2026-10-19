import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/typography.css';
import './styles/components/ui.css';
import './styles/sections/hero.css';
import { setupScroll } from './core/scroll';
import { setupReveals } from './core/motion';
import { setupInteractions } from './ui/interactions';
import { setupHero, runPreloader } from './sections/hero';

setupScroll();
setupInteractions();
void runPreloader(setupHero());
document.fonts.ready.then(setupReveals);
