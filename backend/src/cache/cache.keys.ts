export const cacheKeys = {
  dashboard: (organizationId: string) =>
    `dashboard:${organizationId}`,
  organization: (organizationId: string) =>
  `organization:${organizationId}`,

  projects: (
    organizationId: string,
    page: number,
    limit: number,
    search?: string,
    sort?: string
  ) =>
    `projects:${organizationId}:page=${page}:limit=${limit}:search=${search ?? ""}:sort=${sort ?? ""}`,

  project: (projectId: string) =>
    `project:${projectId}`,

  tasks: (
    organizationId: string,
    page: number,
    limit: number,
    status?: string,
    priority?: string,
    assignee?: string,
    projectId?: string,
    search?: string,
    sort?: string
  ) =>
    `tasks:${organizationId}:page=${page}:limit=${limit}:status=${status ?? ""}:priority=${priority ?? ""}:assignee=${assignee ?? ""}:project=${projectId ?? ""}:search=${search ?? ""}:sort=${sort ?? ""}`,

  task: (taskId: string) =>
    `task:${taskId}`,

  activity: (taskId: string) =>
    `activity:${taskId}`,

  user: (userId: string) =>
    `user:${userId}`,
};