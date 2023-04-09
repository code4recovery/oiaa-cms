export type User = {
  currentAccountID: string;
  email: string;
  emailHash: string;
  id: string;
  isAdmin: boolean;
  name?: string;
  theme: {
    background: string;
    backgroundHover: string;
    border: string;
    focusOutline: string;
    focusRing: string;
    label: string;
    text: string;
  };
};
