import React, { useState } from 'react';
import { Group, Text, useMantineTheme, rem, Box, Image } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps } from '@mantine/dropzone';

export interface ImageUploadProps {
  onImageSelected: ((file: File, preview: string) => void) | ((files: File[]) => void);
  multiple?: boolean;
}

export function ImageUpload({ onImageSelected, multiple = false, ...props }: ImageUploadProps & Partial<DropzoneProps>) {
  const theme = useMantineTheme();
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      if (multiple) {
        // Si multiple est true, on passe directement le tableau de fichiers
        (onImageSelected as (files: File[]) => void)(files);
      } else {
        // Si multiple est false, on traite un seul fichier avec prévisualisation
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          setPreview(previewUrl);
          (onImageSelected as (file: File, preview: string) => void)(file, previewUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Box>
      <Dropzone
        onDrop={handleDrop}
        maxSize={5 * 1024 * 1024}
        accept={['image/png', 'image/jpeg', 'image/jpg']}
        multiple={multiple}
        {...props}
      >
        <Group justify="center" gap="xl" style={{ minHeight: rem(140), pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Glissez des images ici ou cliquez pour sélectionner
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Taille maximale: 5 MB. Formats acceptés: PNG, JPEG
            </Text>
          </div>
        </Group>
      </Dropzone>

      {preview && (
        <Box mt="md">
          <Image src={preview} alt="Aperçu" radius="md" />
        </Box>
      )}
    </Box>
  );
}

export default ImageUpload;
