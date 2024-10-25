import React from 'react';
import { Alert } from '@digdir/designsystemet-react';
import { StudioHeading } from '@studio/components';
import { useTranslation } from 'react-i18next';

export type Image = {
  title: string;
  imageSrc: string;
};

export type ImagesProps = {
  images: Image[];
  onUpdateImage: (updatedImage: Image) => void;
};

export function Images({ images, onUpdateImage }: ImagesProps): React.ReactElement {
  const { t } = useTranslation();

  const noExistingImages = images.length === 0;

  return (
    <div>
      <StudioHeading size='small' spacing>
        {t('app_content_library.images.page_name')}
      </StudioHeading>
      {noExistingImages ? (
        <Alert size='small'>{t('app_content_library.images.no_content')}</Alert>
      ) : (
        images.map((image) => (
          <div key={image.title}>
            <img src={image.imageSrc} alt={image.title} />
            {image.title}
            <button onClick={() => onUpdateImage(image)}>Oppdater bilde</button>
          </div>
        ))
      )}
    </div>
  );
}
