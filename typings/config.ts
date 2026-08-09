export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type IdentifierType = 'license' | 'xbox' | 'discord' | 'steam';

export interface PolyZone {
  position: {
    x: number;
    y: number;
    z: number;
  };
  length: number;
  width: number;
  heading: number;
  minZ: number;
  maxZ: number;
}

interface BlipCoords {
  x: number;
  y: number;
  z: number;
}
export interface ResourceConfig {
  general: {
    language: string;
    currency: string;
    identifierType: string;
  };
  /** See docs/framework-integration.md */
  frameworkIntegration: {
    /** false = standalone; true/"auto" = resolve bridge from resource + detection */
    enabled: boolean | 'auto';
    /** "auto"/"builtin" = built-in qb/qbx/esx; any other name = external bridge resource */
    resource: string;
    syncInitialBankBalance: boolean;
    isCardsEnabled: boolean;
    maxPlayerDistance: number;
    /** Inventory item used by built-in bridges for bank cards */
    cardItem?: string;
    /** Optional job shared-account rules for built-in bridges */
    businessAccounts?: Record<
      string,
      {
        AccountName?: string;
        AdminRole?: number;
        ContributorRole?: number;
      }
    >;
  };
  database: {
    profileQueries: boolean;
    shouldSync?: boolean;
  };
  prices: {
    newAccount: number;
  };
  accounts: {
    firstAccountStartBalance: number;
    otherAccountStartBalance: number;
    clearingNumber: string | number;
    maximumNumberOfAccounts: number;
  };
  cards: {
    cost: number;
    maxCardsPerAccount: number;
  };
  cash: {
    startAmount: number;
  };
  atms: {
    distance: number;
    props: number[];
    withdrawOptions: number[];
  };
  bankBlips: {
    enabled: boolean;
    name: string;
    colour: number;
    icon: number;
    scale: number;
    display: number;
    shortRange: boolean;
    coords: BlipCoords[];
  };
  atmBlips: {
    enabled: boolean;
    name: string;
    colour: number;
    icon: number;
    scale: number;
    display: number;
    shortRange: boolean;
    coords: BlipCoords[];
  };
  target: {
    enabled: boolean;
    bankZones: PolyZone[];
    type: string;
    debug: boolean;
  };
  debug: {
    level: string;
    mockLicenses: boolean;
  };
}
