"use client";

import { useState, useEffect } from 'react';

export interface LaravelInvitationResponse {
  id?: number | string;
  slug?: string;
  template_id: number;
  title: string;
  event_date: string;
  event_type: 'wedding' | 'birthday' | 'corporate' | string;
  dress_code?: string;
  location?: {
    name: string;
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  locations?: Array<{
    type: string;
    name: string;
    address: string;
    city: string;
    country: string;
    time?: string;
    lat?: number;
    lng?: number;
  }>;
  // Specific fields based on event_type
  groom_name?: string;
  bride_name?: string;
  groom_photo_url?: string;
  bride_photo_url?: string;

  celebrant_name?: string;
  celebrant_photo_url?: string;
  age?: number | string;

  company_name?: string;
  company_logo_url?: string;
  agenda?: string | string[];

  custom_data?: {
    hashtag?: string;
    [key: string]: any;
  };
  custom_fields?: {
    rsvp_deadline?: string;
    children_allowed?: boolean;
    shuttle_times?: string[];
    [key: string]: any;
  };
  host?: string;
  musicUrl?: string;
}

export const TEMPLATE_ID_MAP: Record<number, string> = {
  1: 'royal',
  2: 'minimal',
  3: 'floral',
  4: 'vintage',
  5: 'corporate',
  8: 'sweet_sixteen'
};

export function useInvitation(token: string) {
  const [data, setData] = useState<LaravelInvitationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Demo token handling
        if (token === 'demo-token' || token === 'demo' || token === 'wedding' || token === 'birthday' || token === 'corporate') {
          await new Promise((resolve) => setTimeout(resolve, 800));

          let mockData: LaravelInvitationResponse = {
            template_id: 1,
            title: "Mariage d'Elegance & Prestige",
            event_date: "2026-12-24T18:30:00Z",
            event_type: "wedding",
            dress_code: "Black Tie / Tenue de Soirée",
            host: "La Famille Royale",
            location: {
              name: "Palais Bourbon",
              address: "126 Rue de l'Université, 75007 Paris",
              city: "Paris", country: "FR", lat: 48.8618, lng: 2.3186
            },
            groom_name: "Jean-Baptiste",
            bride_name: "Marie-Antoinette",
            groom_photo_url: "https://images.unsplash.com/photo-1550005816-19aa849a502c?auto=format&fit=crop&q=80&w=400",
            bride_photo_url: "https://images.unsplash.com/photo-1594462753934-895842be4a1b?auto=format&fit=crop&q=80&w=400",
          };

          if (token === 'birthday') {
            mockData = {
              ...mockData,
              template_id: 8,
              event_type: 'birthday',
              title: "Sweet 16th Anniversary",
              celebrant_name: "Dribbble",
              age: 16,
              celebrant_photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            };
          } else if (token === 'corporate') {
            mockData = {
              ...mockData,
              event_type: 'corporate',
              title: "Sommet de l'Innovation 2026",
              company_name: "TechElite Global",
              company_logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=400",
              agenda: ["09:00 - Keynote", "12:00 - Déjeuner Networking", "15:00 - Workshops"],
            };
          }

          setData(mockData);
          setLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ceremony-api.onrender.com';
        const apiUrl = `${baseUrl}/api/public/events/${token}`;

        const response = await fetch(apiUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (response.status === 404) {
          throw new Error("L'invitation demandée est introuvable. Le lien est peut-être expiré ou incorrect.");
        }

        if (!response.ok) {
          throw new Error(`Erreur serveur (${response.status}). Veuillez réessayer plus tard.`);
        }

        const json = await response.json();
        setData(json.data || json);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Impossible de charger l'invitation. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  return { data, loading, error };
}
