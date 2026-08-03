import { Types } from "mongoose";

import { projectRepository } from "../repositories/project.repository";
import { taskRepository } from "../repositories/task.repository";
import { activityRepository } from "../repositories/activity.repository";

class DashboardService {
  async getDashboard(
    organizationId: string
  ) {
    const orgId =
      new Types.ObjectId(organizationId);

    const [
  projects,
  tasks,
  completedTasks,
  recentActivity,
  recentProjects,
  upcomingTasks,
] = await Promise.all([
  projectRepository.count({
    organizationId: orgId,
    deletedAt: null,
  }),

  taskRepository.count({
    organizationId: orgId,
    deletedAt: null,
  }),

  taskRepository.count({
    organizationId: orgId,
    status: "DONE",
    deletedAt: null,
  }),

  activityRepository.findActivities({
    organizationId: orgId,
  }),

  projectRepository.getRecentProjects(
    organizationId,
    5
  ),

  taskRepository.getUpcomingTasks(
    organizationId,
    5
  ),
]);

    return {
  stats: {
    totalProjects: projects,
    totalTasks: tasks,
    completedTasks,
    overdueTasks: 0,
  },

  recentProjects,

  upcomingTasks,

  recentActivity:
    recentActivity.slice(0, 10),
};
  }
}

export const dashboardService =
  new DashboardService();