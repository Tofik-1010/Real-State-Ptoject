// API helpers - works with both Vercel API routes and localStorage fallback

const API_BASE = '/api';

// ─── Inquiries ───────────────────────────────────────────────
const INQUIRIES_KEY = 'propnest_inquiries';

export interface Inquiry {
  _id?: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const res = await fetch(`${API_BASE}/inquiries`);
    if (res.ok) return await res.json();
  } catch {}
  // Fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem(INQUIRIES_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addInquiry = async (inquiry: Omit<Inquiry, '_id' | 'status' | 'createdAt'>): Promise<boolean> => {
  const newInquiry: Inquiry = {
    ...inquiry,
    _id: crypto.randomUUID(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  // Try API first
  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    if (res.ok) {
      // Also save locally for instant display
      const local = JSON.parse(localStorage.getItem(INQUIRIES_KEY) || '[]');
      local.unshift(newInquiry);
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(local));
      return true;
    }
  } catch {}

  // Fallback: save to localStorage only
  const local = JSON.parse(localStorage.getItem(INQUIRIES_KEY) || '[]');
  local.unshift(newInquiry);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(local));
  return true;
};

// ─── User-Added Properties ──────────────────────────────────
const USER_PROPERTIES_KEY = 'propnest_user_properties';

export interface UserProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  size: string;
  type: string;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  agentName: string;
  agentPhone: string;
  createdAt: string;
  features: string[];
}

export const getUserProperties = (): UserProperty[] => {
  try {
    return JSON.parse(localStorage.getItem(USER_PROPERTIES_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addUserProperty = async (property: Omit<UserProperty, 'id' | 'createdAt'>): Promise<boolean> => {
  const newProp: UserProperty = {
    ...property,
    id: `user-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };

  // Try API
  try {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (res.ok) {
      const local = getUserProperties();
      local.unshift(newProp);
      localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(local));
      return true;
    }
  } catch {}

  // Fallback
  const local = getUserProperties();
  local.unshift(newProp);
  localStorage.setItem(USER_PROPERTIES_KEY, JSON.stringify(local));
  return true;
};
