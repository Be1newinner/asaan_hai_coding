import { sectionsService } from '@/services/sections';
import { slugToId } from '@/src/utils/slug';
import { SectionReadBase } from '@/types/api';

interface TutorialDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function TutorialDetailPage({ params }: TutorialDetailPageProps) {
  const { slug } = params;
  const courseId = slugToId(slug);

  if (!courseId) {
    return (
      <div className="container mx-auto py-8 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-4">Tutorial Not Found</h1>
        <p>Invalid tutorial slug provided.</p>
      </div>
    );
  }

  let sections: SectionReadBase[] = [];
  let error: string | null = null;

  try {
    sections = await sectionsService.listSections(courseId);
  } catch (err) {
    console.error("Failed to fetch sections:", err);
    error = "Failed to load sections for this tutorial. Please try again later.";
  }

  // You might want to fetch the course details here as well using the courseId
  // For now, we'll just display the slug as the title.

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-white capitalize">Tutorial: {slug.replace(/-/g, ' ').replace(courseId, '').trim()}</h1>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {sections.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Sections:</h2>
          <ul className="space-y-4">
            {sections.map((section) => (
              <li key={section.id} className="bg-slate-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-medium text-purple-400">{section.title}</h3>
                <p className="text-slate-400">{section.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !error && <p className="text-slate-400">No sections found for this tutorial.</p>
      )}
    </div>
  );
}