import { useTranslation } from 'react-i18next';
import { AppSeo } from '@/components/layout/AppSeo';
import { CorrectionsView } from '@/features/legal/CorrectionsView';
import { useRenderLog } from '@/hooks/useRenderLog';

export function CorrectionsPage() {
  useRenderLog('CorrectionsPage');
  const { t } = useTranslation();
  return (
    <>
      <AppSeo title={t('legal:corrections.title')} description={t('legal:corrections.intro')} />
      <CorrectionsView />
    </>
  );
}
