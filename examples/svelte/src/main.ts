import { mount } from 'svelte';
import App from './App.svelte';
import '@cubit-ui/tokens/css/tokens.css';
import '@cubit-ui/tokens/css/dark.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
