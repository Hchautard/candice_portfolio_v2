import { Component } from 'react';

// Isole un composant optionnel (ex. le modèle 3D) : s'il plante — WebGL indisponible,
// modèle introuvable… — on affiche le fallback au lieu de faire tomber toute la page.
export default class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.warn('Composant optionnel désactivé :', error.message);
    }

    render() {
        return this.state.hasError ? (this.props.fallback ?? null) : this.props.children;
    }
}
