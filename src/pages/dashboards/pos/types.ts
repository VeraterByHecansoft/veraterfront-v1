export type Pad2 = number | `0${number}`;
export type IsoDate = `${number}-${Pad2}-${Pad2}`;
export type URL = null | `${'http://' | 'https://'}${string}`;

export type Link = {
  url: URL;
  label: '&laquo; Previous' | `${number}` | `Next &raquo;`;
  active: boolean;
};

export type TClient = {
  id: number;
  name: string;
  description: string;
  rating: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
  created_at: IsoDate;
  updated_at: IsoDate;
};

