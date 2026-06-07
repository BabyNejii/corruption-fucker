import { useTranslation } from 'react-i18next';
import { AppSeo } from '@/components/layout/AppSeo';
import { PrivacyView } from '@/features/legal/PrivacyView';
import { useRenderLog } from '@/hooks/useRenderLog';

export function PrivacyPage() {
  useRenderLog('PrivacyPage');
  const { t } = useTranslation();
  return (
    <>
      <AppSeo title={t('legal:privacy.title')} description={t('legal:privacy.intro')} />
      <PrivacyView />
    </>
  );
}
