import { Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** One section of a legal document, as stored in the `legal` i18n namespace. */
interface LegalSection {
  h: string;
  p: string[];
}

export interface LegalDocViewProps {
  /** Key into the `legal` i18n namespace (e.g. 'privacy', 'corrections'). */
  docKey: 'privacy' | 'corrections';
  /** Optional footer slot (e.g. a contact CTA). */
  children?: ReactNode;
}

/** Generic renderer for a legal/policy page: title + last-updated + intro + heading/paragraph
 *  sections, all pulled from i18n (no hardcoded strings — frontend.md §3). Reused by the
 *  privacy policy and the right-of-reply page (docs/LEGAL_AUDIT.md §4). */
export function LegalDocView({ docKey, children }: LegalDocViewProps) {
  const { t } = useTranslation();
  const raw = t(`legal:${docKey}.sections`, { returnObjects: true });
  const sections: LegalSection[] = Array.isArray(raw) ? (raw as LegalSection[]) : [];

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <Stack spacing={1}>
        <Typography variant="h4" component="h1">
          {t(`legal:${docKey}.title`)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t(`legal:${docKey}.updated`)}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {t(`legal:${docKey}.intro`)}
        </Typography>
      </Stack>

      {sections.map((section) => (
        <Stack key={section.h} spacing={1} component="section">
          <Typography variant="h6" component="h2">
            {section.h}
          </Typography>
          {section.p.map((para) => (
            <Typography key={para} variant="body2" sx={{ lineHeight: 1.75 }}>
              {para}
            </Typography>
          ))}
        </Stack>
      ))}

      {children}
    </Stack>
  );
}
