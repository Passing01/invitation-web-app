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
    [key: string]: any;
  };
  custom_fields?: {
    rsvp_deadline?: string;
    children_allowed?: boolean;
    shuttle_times?: string[];
    [key: string]: any;
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

        // REAL API CALL (Replace with your actual domain)
        // const apiUrl = `https://votre-domaine.com/api/events/${token}`;
        // const response = await fetch(apiUrl, {
        //   headers: {
        //     'Accept': 'application/json',
        //     // 'Authorization': `Bearer ${tokenSanctum}` // If public access is not allowed
        //   }
        // });

        // if (!response.ok) throw new Error("Invitation introuvable.");
        // const json = await response.json();

        // --- MOCK DATA FOR DEVELOPMENT (Using your specific JSON structure) ---
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockApiResponse: LaravelInvitationResponse = {
          template_id: 1, // Royal
          title: "Le Mariage d'Alice & Bob",
          event_date: "2026-09-12T15:00:00Z",
          event_type: "wedding",
          dress_code: "Tenue de Cocktail",
          location: {
            name: "Château de Lumière",
            address: "12 Rue des Fleurs, 75000 Paris",
            city: "Paris",
            country: "FR",
            lat: 48.8566,
            lng: 2.3522
          },
          custom_data: {
            hashtag: "#AliceBob2026",
            groom_photo: "https://images.unsplash.com/photo-1550005816-19aa849a502c?auto=format&fit=crop&q=80&w=400",
            bride_photo: "https://images.unsplash.com/photo-1594462753934-895842be4a1b?auto=format&fit=crop&q=80&w=400",
          },
          custom_fields: {
            rsvp_deadline: "2026-08-20",
          },
          // Extra field for the UI to display who is hosting
          host: "Alice & Bob"
        };

        setData(mockApiResponse);
      } catch (err: any) {
        setError(err.message || "Impossible de charger l'invitation.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  return { data, loading, error };
}
