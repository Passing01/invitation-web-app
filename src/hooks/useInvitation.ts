import { useState, useEffect } from 'react';

/**
 * Interface matching the Laravel API response provided by the USER
 */
export interface LaravelInvitationResponse {
  template_id: number;
  title: string;
  event_date: string;
  event_type?: string;
  dress_code?: string;
  // Handle both single location and multiple locations from the JSON variants
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
  custom_data?: {
    hashtag?: string;
    groom_photo?: string; // URL of the uploaded photo
    bride_photo?: string; // URL of the uploaded photo
    menu?: {
      starter: string;
      main: string;
      dessert: string;
    };
    [key: string]: string | number | boolean | object | undefined;
  };
  custom_fields?: {
    rsvp_deadline?: string;
    children_allowed?: boolean;
    shuttle_times?: string[];
    [key: string]: string | number | boolean | object | undefined;
  };
  // Internal mapping for the UI
  host?: string; // Derived or extra field
  musicUrl?: string;
}

// Mapping of template_id from API to our internal style strings
export const TEMPLATE_ID_MAP: Record<number, string> = {
  1: 'royal',
  2: 'minimal',
  3: 'floral',
  4: 'vintage',
  5: 'corporate'
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

        // Handling 'demo-token' for demonstration purposes
        if (token === 'demo-token') {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setData({
            template_id: 1,
            title: "Mariage d'Elegance & Prestige",
            event_date: "2026-12-24T18:30:00Z",
            event_type: "wedding",
            dress_code: "Black Tie / Tenue de Soirée",
            host: "La Famille Royale",
            location: {
              name: "Palais Bourbon",
              address: "126 Rue de l'Université, 75007 Paris",
              city: "Paris",
              country: "FR",
              lat: 48.8618,
              lng: 2.3186
            },
            custom_data: {
              hashtag: "#RoyalWedding2026",
              groom_photo: "https://images.unsplash.com/photo-1550005816-19aa849a502c?auto=format&fit=crop&q=80&w=400",
              bride_photo: "https://images.unsplash.com/photo-1594462753934-895842be4a1b?auto=format&fit=crop&q=80&w=400",
            }
          });
          setLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ceremony-api.onrender.com';
        const apiUrl = `${baseUrl}/api/public/events/${token}`;

        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error("Invitation introuvable sur le serveur.");
        }

        const json = await response.json();
        setData(json.data || json);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        const message = err instanceof Error ? err.message : "Impossible de charger l'invitation.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  return { data, loading, error };
}

