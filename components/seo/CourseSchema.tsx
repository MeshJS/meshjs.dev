export interface CourseLesson {
  name: string;
  description: string;
  url?: string;
}

export interface CourseSchemaProps {
  name: string;
  description: string;
  provider?: string;
  lessons?: CourseLesson[];
  isAccessibleForFree?: boolean;
}

export function CourseSchema({
  name,
  description,
  provider = "MeshJS",
  lessons,
  isAccessibleForFree = true,
}: CourseSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      url: "https://meshjs.dev",
    },
    isAccessibleForFree,
    ...(lessons && {
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT10H",
      },
      syllabusSections: lessons.map((lesson, index) => ({
        "@type": "Syllabus",
        position: index + 1,
        name: lesson.name,
        description: lesson.description,
        ...(lesson.url && { url: lesson.url }),
      })),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
