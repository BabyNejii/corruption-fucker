import { Link as MuiLink, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { paths } from '@/routes/paths';

const PRINCIPLE_KEYS = ['sourced', 'public', 'patterns', 'notVerdict', 'reply', 'oss'] as const;
const SECURITY_KEYS = ['csp', 'noTracking', 'sanitized'] as const;

/** Methodology + security posture — the pitch's "why trust this" page, and demonstrable proof
 *  of the sourcing/security discipline (plan §Security · CLAUDE.md §0). Also carries the
 *  public-interest / journalistic-purpose statement and links to the legal pages
 *  (docs/LEGAL_AUDIT.md §1). */
export function AboutView() {
  const { t } = useTranslation();

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" component="h1">
          {t('about:title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('about:intro')}
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h5" component="h2">
          {t('about:principles.title')}
        </Typography>
        <List dense sx={{ listStyleType: 'disc', pl: 3 }}>
          {PRINCIPLE_KEYS.map((key) => (
            <ListItem key={key} sx={{ display: 'list-item', py: 0.25 }} disableGutters>
              <ListItemText primary={t(`about:principles.${key}`)} />
            </ListItem>
          ))}
        </List>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h5" component="h2">
          {t('about:purpose.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
          {t('about:purpose.body')}
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h5" component="h2">
          {t('about:security.title')}
        </Typography>
        <List dense sx={{ listStyleType: 'disc', pl: 3 }}>
          {SECURITY_KEYS.map((key) => (
            <ListItem key={key} sx={{ display: 'list-item', py: 0.25 }} disableGutters>
              <ListItemText primary={t(`about:security.${key}`)} />
            </ListItem>
          ))}
        </List>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h5" component="h2">
          {t('about:links.title')}
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <MuiLink component={RouterLink} to={paths.privacy}>
            {t('about:links.privacy')}
          </MuiLink>
          <MuiLink component={RouterLink} to={paths.corrections}>
            {t('about:links.corrections')}
          </MuiLink>
        </Stack>
      </Stack>
    </Stack>
  );
}
