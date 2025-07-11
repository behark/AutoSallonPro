import { useQuery } from '@tanstack/react-query';
import { ContentSection } from '@shared/content-schema';

export function useContent(sectionKey: string, defaultValue: string = '') {
  const { data: contentSections = [] } = useQuery<ContentSection[]>({
    queryKey: ['/api/content'],
  });

  const content = contentSections.find(section => section.sectionKey === sectionKey);
  return content?.content || defaultValue;
}

export function useContentByPage(page: string) {
  const { data: contentSections = [] } = useQuery<ContentSection[]>({
    queryKey: ['/api/content'],
  });

  return contentSections.filter(section => section.page === page);
}