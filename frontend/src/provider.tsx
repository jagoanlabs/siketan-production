import { I18nProvider } from "@react-aria/i18n";

export function Provider({ children }: { children: React.ReactNode }) {
  return <I18nProvider locale="en-GB">{children}</I18nProvider>;
}
