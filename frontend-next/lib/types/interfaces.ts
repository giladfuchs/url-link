export type Link = {
  id: number;
  owner_id: number;
  alias: string;
  url: string;
  active: boolean;
  password_hash?: string | null;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type DataPoint = [string, number];

export interface Totals {
  clicks: number;
  uniques: number;
}

export interface Series {
  uniques: DataPoint[];
  clicks: DataPoint[];
}

export interface Breakdown extends Totals {
  value: string;
}

export interface Breakdowns {
  country: Breakdown[];
  region: Breakdown[];
  city: Breakdown[];
  referrer: Breakdown[];
  device: Breakdown[];
  os: Breakdown[];
  browser: Breakdown[];
}

export interface Report {
  series: Series;
  breakdowns: Breakdowns;
  totals: Totals;
}

export interface SingleLinkResponse {
  report: Report;
  link: Link;
}
