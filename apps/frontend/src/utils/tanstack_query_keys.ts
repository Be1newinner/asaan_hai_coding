const TANSTACK_QUERY_KEYS = {
  TOP_PROJECTS_HOME: "TOP_PROJECTS_HOME",
  PROJECTS_PAGE_: "PROJECTS_PAGE_",
  TOP_TUTORIALS_HOME: "TOP_TUTORIALS_HOME",
  TUTORIALS_PAGE_: "TUTORIALS_PAGE_",
  PROFILE_PAGE: "PROFILE_PAGE"
};

export const projectKeys = {
  all: () => ["projects"] as const,
  lists: () => [...projectKeys.all(), "list"] as const,
  list: (params: any) => [...projectKeys.lists(), params] as const,
  detail: (id: number) => [...projectKeys.all(), "detail", id] as const,
};

export const coursesKeys = {
  all: () => ["courses"] as const,
  lists: () => [...coursesKeys.all(), "list"] as const,
  list: (params: any) => [...coursesKeys.lists(), params] as const,
  detail: (id: number) => [...coursesKeys.all(), "detail", id] as const,
};

//
// queries = projectKeys.list({ page: 1, pageSize: 10, sort: 'top', categoryId: 'react' })
//
// mutation invalidation = projectKeys.lists()

export default TANSTACK_QUERY_KEYS;
