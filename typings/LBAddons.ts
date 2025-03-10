export type LBSettings = {
  airplaneMode: boolean;
  display: { theme: 'dark' | 'light' };
  doNotDisturb: boolean;
  locale: string;
  name: string;
  sound: { silent: boolean; volume: number };
};
