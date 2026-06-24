// ============================================================
// TYPES COMPANY — alignés sur public.companies
// ============================================================

export interface Company {
  id: string
  owner_id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  city: string | null
  country: string | null
  logo_url: string | null
  currency: string
  created_at: string
  updated_at: string
}

export type CompanyPayload = Omit<
  Company,
  'id' | 'owner_id' | 'logo_url' | 'created_at' | 'updated_at'
>

export type CompanyUpdatePayload = Partial<CompanyPayload>
