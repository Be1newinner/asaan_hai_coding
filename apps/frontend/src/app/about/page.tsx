import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import HydratedAbout from "./HydratedAbout";
import TANSTACK_QUERY_KEYS from "@/utils/tanstack_query_keys";
import { profileService } from "@/services/profile";

export default async function AboutPage() {
  const query = new QueryClient();
  await query.prefetchQuery({
    queryKey: [TANSTACK_QUERY_KEYS.PROFILE_PAGE],
    queryFn: () => profileService.getProfile(),
  });
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <HydrationBoundary state={dehydrate(query)}>
        <HydratedAbout />
      </HydrationBoundary>
    </div>
  );
}
