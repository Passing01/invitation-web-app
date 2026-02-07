export interface TemplateElement {
    id: string;
    type: 'text' | 'image' | 'qrcode' | 'rsvp-form' | 'map' | 'countdown' | 'gift-list';
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    style: {
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string | number;
        color?: string;
        textAlign?: 'left' | 'center' | 'right';
        width?: number; // percentage
        letterSpacing?: string;
        textTransform?: 'uppercase' | 'none' | 'capitalize';
        italic?: boolean;
    };
    content?: string;
}

export interface TemplatePage {
    id: string;
    title: string;
    bgUrl?: string;
    bgColor?: string;
    elements: TemplateElement[];
}

export interface TemplateConfig {
    id: string; // Internal key (royal, minimal)
    numericId: number; // Official ID for Laravel (1, 2, 3)
    name: string;
    description: string;
    previewUrl: string;
    bgUrl?: string;
    bgColor: string;
    accentColor: string;
    fonts: string[];
    openingVideoUrl?: string;
    pages: TemplatePage[];
}

export const TEMPLATE_STYLES: Record<string, TemplateConfig> = {
    royal: {
        id: 'royal',
        numericId: 1,
        name: 'Gala Royal',
        description: 'Élégance intemporelle, or et noir profond.',
        previewUrl: '/wedding.mp4',
        bgUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070',
        bgColor: '#1a1a1a',
        accentColor: '#D4AF37',
        fonts: ['Cormorant+Garamond', 'Playfair+Display'],
        pages: [
            {
                id: 'cover',
                title: 'Accueil',
                elements: [
                    { id: 'host', type: 'text', x: 50, y: 15, style: { fontSize: 16, fontFamily: 'Cormorant Garamond', color: '#D4AF37', textAlign: 'center', letterSpacing: '0.4em', textTransform: 'uppercase' } },
                    { id: 'photo', type: 'image', x: 50, y: 40, style: { width: 60 } },
                    { id: 'title', type: 'text', x: 50, y: 65, style: { fontSize: 48, fontFamily: 'Playfair Display', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' } },
                    { id: 'names', type: 'text', x: 50, y: 78, style: { fontSize: 24, fontFamily: 'Cormorant Garamond', color: '#D4AF37', textAlign: 'center', italic: true } },
                    { id: 'subtitle', type: 'text', x: 50, y: 88, style: { fontSize: 16, fontFamily: 'Cormorant Garamond', color: '#D4AF37', textAlign: 'center', italic: true }, content: 'Une soirée d’exception' }
                ]
            },
            {
                id: 'details',
                title: 'Événement',
                elements: [
                    { id: 'section-title', type: 'text', x: 50, y: 20, style: { fontSize: 24, fontFamily: 'Playfair Display', color: '#D4AF37', textAlign: 'center', textTransform: 'uppercase' }, content: 'Le Programme' },
                    { id: 'date', type: 'text', x: 50, y: 50, style: { fontSize: 32, fontFamily: 'Cormorant Garamond', color: '#ffffff', textAlign: 'center' } },
                    { id: 'time', type: 'text', x: 50, y: 65, style: { fontSize: 18, fontFamily: 'Cormorant Garamond', color: '#D4AF37', textAlign: 'center' }, content: 'Réception à partir de 19h00' }
                ]
            },
            {
                id: 'location',
                title: 'Lieu',
                elements: [
                    { id: 'location-title', type: 'text', x: 50, y: 20, style: { fontSize: 24, fontFamily: 'Playfair Display', color: '#D4AF37', textAlign: 'center' }, content: 'Le Palais' },
                    { id: 'location', type: 'text', x: 50, y: 40, style: { fontSize: 18, fontFamily: 'Cormorant Garamond', color: '#ffffff', textAlign: 'center', width: 80 } },
                    { id: 'map', type: 'map', x: 50, y: 70, style: { width: 90 } }
                ]
            },
            {
                id: 'rsvp',
                title: 'RSVP',
                elements: [
                    { id: 'rsvp-title', type: 'text', x: 50, y: 15, style: { fontSize: 24, fontFamily: 'Playfair Display', color: '#D4AF37', textAlign: 'center' }, content: 'Votre Présence' },
                    { id: 'rsvp-form', type: 'rsvp-form', x: 50, y: 55, style: { width: 85 } }
                ]
            },
            {
                id: 'end',
                title: 'Merci',
                elements: [
                    { id: 'qr', type: 'qrcode', x: 50, y: 40, style: { width: 35 } },
                    { id: 'thanks', type: 'text', x: 50, y: 70, style: { fontSize: 32, fontFamily: 'Playfair Display', color: '#ffffff', textAlign: 'center' }, content: 'Au plaisir de vous voir' },
                    { id: 'footer', type: 'text', x: 50, y: 85, style: { fontSize: 12, fontFamily: 'Cormorant Garamond', color: '#D4AF37', textAlign: 'center', textTransform: 'uppercase' }, content: 'Veuillez présenter ce code à l’entrée' }
                ]
            }
        ]
    },
    minimal: {
        id: 'minimal',
        numericId: 2,
        name: 'Minimal Modern',
        description: 'Simplicité, clarté et typographie audacieuse.',
        previewUrl: '/video2.mp4',
        bgColor: '#ffffff',
        accentColor: '#1a1a1a',
        fonts: ['Inter', 'Montserrat'],
        pages: [
            { id: 'cover', title: 'Cover', elements: [{ id: 'title', type: 'text', x: 50, y: 50, style: { fontSize: 48, fontFamily: 'Montserrat', color: '#1a1a1a', textAlign: 'center', fontWeight: 900, textTransform: 'uppercase' } }] },
            { id: 'details', title: 'Date', elements: [{ id: 'date', type: 'text', x: 50, y: 50, style: { fontSize: 24, fontFamily: 'Inter', color: '#1a1a1a', textAlign: 'center', fontWeight: 300 } }] },
            { id: 'location', title: 'Lieu', elements: [{ id: 'location', type: 'text', x: 50, y: 40, style: { fontSize: 18, fontFamily: 'Inter', color: '#1a1a1a', textAlign: 'center', width: 80 } }, { id: 'map', type: 'map', x: 50, y: 70, style: { width: 90 } }] },
            { id: 'rsvp', title: 'RSVP', elements: [{ id: 'rsvp-form', type: 'rsvp-form', x: 50, y: 50, style: { width: 85 } }] },
            { id: 'end', title: 'Merci', elements: [{ id: 'thanks', type: 'text', x: 50, y: 40, style: { fontSize: 24, fontFamily: 'Montserrat', color: '#1a1a1a', textAlign: 'center', fontWeight: 700 }, content: 'À BIENTÔT.' }, { id: 'qr', type: 'qrcode', x: 50, y: 70, style: { width: 30 } }] }
        ]
    },
    floral: {
        id: 'floral',
        numericId: 3,
        name: 'Jardin Floral',
        description: 'Aquarelle, douceur et romantisme pour vos moments.',
        previewUrl: '/video3.mp4',
        bgColor: '#fffafb',
        accentColor: '#b27b8d',
        fonts: ['Great+Vibes', 'Lato'],
        pages: [
            { id: 'cover', title: 'Accueil', elements: [{ id: 'title', type: 'text', x: 50, y: 50, style: { fontSize: 72, fontFamily: 'Great Vibes', color: '#b27b8d', textAlign: 'center' } }] },
            { id: 'details', title: 'Quand', elements: [{ id: 'date', type: 'text', x: 50, y: 50, style: { fontSize: 24, fontFamily: 'Lato', color: '#b27b8d', textAlign: 'center' } }] },
            { id: 'location', title: 'Où', elements: [{ id: 'location', type: 'text', x: 50, y: 40, style: { fontSize: 18, fontFamily: 'Lato', color: '#4a4a4a', textAlign: 'center' } }, { id: 'map', type: 'map', x: 50, y: 70, style: { width: 90 } }] },
            { id: 'rsvp', title: 'RSVP', elements: [{ id: 'rsvp-form', type: 'rsvp-form', x: 50, y: 50, style: { width: 85 } }] },
            { id: 'end', title: 'Merci', elements: [{ id: 'thanks', type: 'text', x: 50, y: 50, style: { fontSize: 32, fontFamily: 'Great Vibes', color: '#b27b8d', textAlign: 'center' }, content: 'Merci d’être là' }] }
        ]
    },
    vintage: {
        id: 'vintage',
        numericId: 4,
        name: 'Parchemin Antique',
        description: 'Style rétro, papier vieilli et charme d’autrefois.',
        previewUrl: '/video4.mp4',
        bgColor: '#f4e0c8',
        accentColor: '#4a3728',
        fonts: ['Tangerine', 'Merriweather'],
        pages: [
            { id: 'cover', title: 'Accueil', elements: [{ id: 'title', type: 'text', x: 50, y: 50, style: { fontSize: 84, fontFamily: 'Tangerine', color: '#4a3728', textAlign: 'center', fontWeight: 'bold' } }] },
            { id: 'details', title: 'Date', elements: [{ id: 'date', type: 'text', x: 50, y: 50, style: { fontSize: 20, fontFamily: 'Merriweather', color: '#4a3728', textAlign: 'center', italic: true } }] },
            { id: 'location', title: 'Lieu', elements: [{ id: 'location', type: 'text', x: 50, y: 40, style: { fontSize: 16, fontFamily: 'Merriweather', color: '#4a4a4a', textAlign: 'center' } }, { id: 'map', type: 'map', x: 50, y: 70, style: { width: 90 } }] },
            { id: 'rsvp', title: 'Réponse', elements: [{ id: 'rsvp-form', type: 'rsvp-form', x: 50, y: 50, style: { width: 85 } }] },
            { id: 'end', title: 'Fin', elements: [{ id: 'thanks', type: 'text', x: 50, y: 50, style: { fontSize: 48, fontFamily: 'Tangerine', color: '#4a3728', textAlign: 'center' }, content: 'Bien à vous' }] }
        ]
    },
    corporate: {
        id: 'corporate',
        numericId: 5,
        name: 'Business Elite',
        description: 'Précision géométrique et professionnalisme moderne.',
        previewUrl: '/video5.mp4',
        bgColor: '#f0f4f8',
        accentColor: '#003366',
        fonts: ['Roboto', 'Oswald'],
        pages: [
            { id: 'cover', title: 'Event', elements: [{ id: 'title', type: 'text', x: 50, y: 50, style: { fontSize: 40, fontFamily: 'Oswald', color: '#003366', textAlign: 'center', textTransform: 'uppercase' } }] },
            { id: 'details', title: 'Schedule', elements: [{ id: 'date', type: 'text', x: 50, y: 50, style: { fontSize: 20, fontFamily: 'Roboto', color: '#333333', textAlign: 'center', fontWeight: 'bold' } }] },
            { id: 'location', title: 'Address', elements: [{ id: 'location', type: 'text', x: 50, y: 40, style: { fontSize: 16, fontFamily: 'Roboto', color: '#333333', textAlign: 'center' } }, { id: 'map', type: 'map', x: 50, y: 70, style: { width: 90 } }] },
            { id: 'rsvp', title: 'Register', elements: [{ id: 'rsvp-form', type: 'rsvp-form', x: 50, y: 50, style: { width: 85 } }] },
            { id: 'end', title: 'Network', elements: [{ id: 'thanks', type: 'text', x: 50, y: 50, style: { fontSize: 24, fontFamily: 'Oswald', color: '#003366', textAlign: 'center' }, content: 'JOIN THE NETWORK' }] }
        ]
    },
    storyteller: {
        id: 'storyteller',
        numericId: 6,
        name: 'Éclat de Récit',
        description: 'Une narration immersive façon "Story" pour raconter votre plus belle histoire.',
        previewUrl: '/video2.mp4',
        openingVideoUrl: '/video2.mp4',
        bgColor: '#fdfaf5',
        accentColor: '#D4AF37',
        fonts: ['Cormorant+Garamond', 'Montserrat'],
        pages: [
            {
                id: 'intro',
                title: 'Notre Histoire',
                bgUrl: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=2000',
                elements: [
                    { id: 'story-1', type: 'text', x: 50, y: 80, style: { fontSize: 24, fontFamily: 'Cormorant Garamond', color: '#ffffff', textAlign: 'center', italic: true, width: 80 }, content: 'Tout a commencé un jour ordinaire...' }
                ]
            },
            {
                id: 'meeting',
                title: 'La Rencontre',
                bgUrl: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=2000',
                elements: [
                    { id: 'story-2', type: 'text', x: 50, y: 80, style: { fontSize: 24, fontFamily: 'Cormorant Garamond', color: '#ffffff', textAlign: 'center', italic: true, width: 80 }, content: 'Dans un petit café au coin de la rue.' }
                ]
            },
            {
                id: 'proposal',
                title: 'L\'Engagement',
                bgUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=2000',
                elements: [
                    { id: 'title', type: 'text', x: 50, y: 40, style: { fontSize: 48, fontFamily: 'Cormorant Garamond', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' } },
                    { id: 'names', type: 'text', x: 50, y: 55, style: { fontSize: 24, fontFamily: 'Cormorant Garamond', color: '#D4AF37', textAlign: 'center', italic: true } },
                    { id: 'story-3', type: 'text', x: 50, y: 80, style: { fontSize: 18, fontFamily: 'Montserrat', color: '#ffffff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.2em' }, content: 'Dites OUI à notre bonheur' }
                ]
            },
            {
                id: 'details',
                title: 'Le Jour J',
                bgUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000',
                elements: [
                    { id: 'date', type: 'text', x: 50, y: 30, style: { fontSize: 32, fontFamily: 'Cormorant Garamond', color: '#ffffff', textAlign: 'center' } },
                    { id: 'location', type: 'text', x: 50, y: 50, style: { fontSize: 18, fontFamily: 'Montserrat', color: '#ffffff', textAlign: 'center', width: 80 } },
                    { id: 'map', type: 'map', x: 50, y: 75, style: { width: 90 } }
                ]
            },
            {
                id: 'rsvp',
                title: 'Confirmez',
                bgColor: '#1a1a1a',
                elements: [
                    { id: 'rsvp-title', type: 'text', x: 50, y: 20, style: { fontSize: 28, fontFamily: 'Cormorant Garamond', color: '#D4AF37', textAlign: 'center' }, content: 'Serez-vous des nôtres ?' },
                    { id: 'rsvp-form', type: 'rsvp-form', x: 50, y: 55, style: { width: 90 } }
                ]
            }
        ]
    },
    majestic_story: {
        id: 'majestic_story',
        numericId: 7,
        name: 'Majestic Story',
        description: 'Une expérience cinématographique ultime avec ouverture vidéo et tableau de bord complet.',
        previewUrl: '/video2.mp4',
        openingVideoUrl: '/video2.mp4',
        bgColor: '#fdfaf5',
        accentColor: '#D4AF37',
        fonts: ['Playfair+Display', 'Allison', 'Montserrat'],
        pages: [
            { id: 'story-1', title: 'Le Début', bgUrl: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=2000', elements: [{ id: 's1', type: 'text', x: 50, y: 80, style: { fontSize: 28, fontFamily: 'Allison', color: '#ffffff', textAlign: 'center', width: 80 }, content: 'Tout a commencé par un simple regard...' }] },
            { id: 'story-2', title: 'Complicité', bgUrl: 'https://images.unsplash.com/photo-1516589174184-c685bc016a30?q=80&w=2000', elements: [{ id: 's2', type: 'text', x: 50, y: 80, style: { fontSize: 28, fontFamily: 'Allison', color: '#ffffff', textAlign: 'center', width: 80 }, content: 'Nos rires sont devenus notre plus belle mélodie.' }] },
            { id: 'story-3', title: 'Voyage', bgUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000', elements: [{ id: 's3', type: 'text', x: 50, y: 80, style: { fontSize: 28, fontFamily: 'Allison', color: '#ffffff', textAlign: 'center', width: 80 }, content: 'Main dans la main, nous avons parcouru le monde.' }] },
            { id: 'story-4', title: 'Engagement', bgUrl: 'https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2000', elements: [{ id: 's4', type: 'text', x: 50, y: 80, style: { fontSize: 28, fontFamily: 'Allison', color: '#ffffff', textAlign: 'center', width: 80 }, content: 'Une promesse pour la vie.' }] },
            { id: 'story-5', title: 'Demande', bgUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2000', elements: [{ id: 's5', type: 'text', x: 50, y: 80, style: { fontSize: 28, fontFamily: 'Allison', color: '#ffffff', textAlign: 'center', width: 80 }, content: 'Sous un ciel étoilé, j\'ai dit OUI.' }] },
            { id: 'story-6', title: 'Préparatifs', bgUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000', elements: [{ id: 's6', type: 'text', x: 50, y: 80, style: { fontSize: 28, fontFamily: 'Allison', color: '#ffffff', textAlign: 'center', width: 80 }, content: 'Chaque détail compte.' }] },
            { id: 'story-7', title: 'La Promesse', bgUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000', elements: [{ id: 's7', type: 'text', x: 50, y: 80, style: { fontSize: 28, fontFamily: 'Allison', color: '#ffffff', textAlign: 'center', width: 80 }, content: 'Notre plus belle aventure commence.' }] },
            { id: 'story-8', title: 'Invitation', bgUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000', elements: [{ id: 'title', type: 'text', x: 50, y: 40, style: { fontSize: 40, fontFamily: 'Playfair Display', color: '#ffffff', textAlign: 'center', fontWeight: 'bold' } }, { id: 'names', type: 'text', x: 50, y: 55, style: { fontSize: 32, fontFamily: 'Allison', color: '#D4AF37', textAlign: 'center' } }] },
            {
                id: 'dashboard',
                title: 'Infos Utiles',
                bgColor: '#0f172a',
                elements: [
                    { id: 'section-title', type: 'text', x: 50, y: 5, style: { fontSize: 20, fontFamily: 'Playfair Display', color: '#D4AF37', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3em' }, content: 'Détails de la Célébration' },
                    { id: 'countdown', type: 'countdown', x: 50, y: 15, style: { width: 90 } },
                    { id: 'date', type: 'text', x: 50, y: 25, style: { fontSize: 22, fontFamily: 'Playfair Display', color: '#ffffff', textAlign: 'center' } },
                    { id: 'location-title', type: 'text', x: 50, y: 35, style: { fontSize: 18, fontFamily: 'Playfair Display', color: '#D4AF37', textAlign: 'center' }, content: 'Le Lieu Magique' },
                    { id: 'location', type: 'text', x: 50, y: 42, style: { fontSize: 14, fontFamily: 'Montserrat', color: '#ffffff', textAlign: 'center', width: 80 } },
                    { id: 'map', type: 'map', x: 50, y: 55, style: { width: 90 } },
                    { id: 'gift-list-title', type: 'text', x: 50, y: 70, style: { fontSize: 18, fontFamily: 'Playfair Display', color: '#D4AF37', textAlign: 'center' }, content: 'Liste de Mariage' },
                    { id: 'gift-list', type: 'gift-list', x: 50, y: 78, style: { width: 85 } },
                    { id: 'rsvp-title', type: 'text', x: 50, y: 88, style: { fontSize: 20, fontFamily: 'Playfair Display', color: '#D4AF37', textAlign: 'center' }, content: 'Confirmez votre présence' },
                    { id: 'rsvp-form', type: 'rsvp-form', x: 50, y: 95, style: { width: 90 } }
                ]
            }
        ]
    }
};
