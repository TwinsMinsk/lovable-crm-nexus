
export interface Partner {
  id: string;
  created_at: string;
  name: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  specialization?: string | null;
  terms?: string | null;
  user_id: string;
}

export interface CreatePartnerData {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  specialization?: string;
  terms?: string;
  user_id: string;
}

export interface UpdatePartnerData {
  id: string;
  name?: string;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  specialization?: string | null;
  terms?: string | null;
}
