import { Button } from '@mui/material';
import { EnvelopeIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { LegalDocView } from './LegalDocView';

/** Right-of-reply / correction page (docs/LEGAL_AUDIT.md §4 — defamation + GDPR Art. 16/21).
 *  Any named subject can ask us to correct or remove an unsupported claim, via the contact
 *  email. Content lives in the `legal` i18n namespace. */
export function CorrectionsView() {
  const { t } = useTranslation();
  const email = t('legal:corrections.email');
  const subject = encodeURIComponent(t('legal:corrections.title'));

  return (
    <LegalDocView docKey="corrections">
      <Button
        variant="contained"
        color="secondary"
        href={`mailto:${email}?subject=${subject}`}
        startIcon={<EnvelopeIcon weight="fill" />}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('legal:corrections.cta')}
      </Button>
    </LegalDocView>
  );
}
