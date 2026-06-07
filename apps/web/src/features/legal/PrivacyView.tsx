import { LegalDocView } from './LegalDocView';

/** Privacy policy (GDPR/ЗЗЛД notice): controller identity, lawful basis incl. the Art. 85
 *  journalistic exemption, data categories, retention, and data-subject rights. Content lives
 *  in the `legal` i18n namespace. (docs/LEGAL_AUDIT.md §2.4–2.5) */
export function PrivacyView() {
  return <LegalDocView docKey="privacy" />;
}
