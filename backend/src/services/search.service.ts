import {
  GlobalSearchResult,
  SearchResultType,
} from "../constants/search";

import { searchRepository } from "../repositories/search.repository";

class SearchService {
  async globalSearch(
    organizationId: string,
    query: string,
    limit = 5
  ) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return {
        query: "",
        results: [],
        total: 0,
      };
    }

    const safeLimit = Math.min(
      Math.max(limit, 1),
      20
    );

    const [
      projects,
      tasks,
      users,
      comments,
    ] = await Promise.all([
      searchRepository.searchProjects(
        organizationId,
        trimmedQuery,
        safeLimit
      ),

      searchRepository.searchTasks(
        organizationId,
        trimmedQuery,
        safeLimit
      ),

      searchRepository.searchUsers(
        organizationId,
        trimmedQuery,
        safeLimit
      ),

      searchRepository.searchComments(
        organizationId,
        trimmedQuery,
        safeLimit
      ),
    ]);

    const projectResults: GlobalSearchResult[] =
      projects.map((project: any) => ({
        id: project._id.toString(),

        type: SearchResultType.PROJECT,

        title: project.name,

        description:
          project.description || undefined,

        subtitle: project.status,

        url: `/projects/${project._id}`,

        metadata: {
          status: project.status,
        },
      }));

    const taskResults: GlobalSearchResult[] =
      tasks.map((task: any) => ({
        id: task._id.toString(),

        type: SearchResultType.TASK,

        title: task.title,

        description:
          task.description || undefined,

        subtitle:
          task.projectId?.name ||
          "Task",

        url: `/tasks/${task._id}`,

        metadata: {
          status: task.status,
          priority: task.priority,
          projectId:
            task.projectId?._id?.toString(),
          assignee:
            task.assignee?.name,
        },
      }));

    const userResults: GlobalSearchResult[] =
      users.map((user: any) => ({
        id: user._id.toString(),

        type: SearchResultType.USER,

        title: user.name,

        description: user.email,

        subtitle: user.role,

        // Was `/settings/members` — that route never existed (no
        // /settings page was ever built), and /settings has since
        // been removed from the app entirely. /organizations now
        // shows the full member list, so that's the real destination
        // for a person search result.
        url: `/organizations`,

        metadata: {
          email: user.email,
          role: user.role,
        },
      }));

    const commentResults: GlobalSearchResult[] =
      comments.map((comment: any) => ({
        id: comment._id.toString(),

        type: SearchResultType.COMMENT,

        title: comment.content,

        description:
          comment.author?.name ||
          "Unknown user",

        subtitle:
          comment.taskId?.title ||
          "Task comment",

        url: comment.taskId?._id
          ? `/tasks/${comment.taskId._id}`
          : "/tasks",

        metadata: {
          taskId:
            comment.taskId?._id?.toString(),
          author:
            comment.author?.name,
          createdAt:
            comment.createdAt,
        },
      }));

    const results = [
      ...projectResults,
      ...taskResults,
      ...userResults,
      ...commentResults,
    ];

    return {
      query: trimmedQuery,

      results,

      total: results.length,

      groups: {
        projects: projectResults,
        tasks: taskResults,
        users: userResults,
        comments: commentResults,
      },
    };
  }
}

export const searchService =
  new SearchService();