import Hero from "@/components/Hero";
import TopProjects from "@/components/TopProjects";
import TopTutorials from "@/components/TopTutorials";
import ContactSection from "@/components/ContactSection";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { coursesService } from "@/services/courses";
import TANSTACK_QUERY_KEYS from "@/utils/tanstack_query_keys";
import { projectsService } from "@/services/projects";

export default async function Home() {
  const query = new QueryClient();
  await query.prefetchQuery({
    queryKey: [TANSTACK_QUERY_KEYS.TOP_PROJECTS_HOME],
    queryFn: () => projectsService.listProjects({ limit: 3 }),
  });
  await query.prefetchQuery({
    queryKey: [TANSTACK_QUERY_KEYS.TOP_TUTORIALS_HOME],
    queryFn: () => coursesService.listCourses(0, 4),
  });
  return (
    <div className="space-y-20">
      <Hero />
      <HydrationBoundary state={dehydrate(query)}>
        <TopProjects />
        <TopTutorials />
      </HydrationBoundary>
      <ContactSection />
    </div>
  );
}
