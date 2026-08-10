import { Types } from "mongoose";

import { projectRepository } from "../repositories/project.repository";
import { taskRepository } from "../repositories/task.repository";
import { activityRepository } from "../repositories/activity.repository";

import { cacheService } from "../cache/cache.service";
import { cacheKeys } from "../cache/cache.keys";

class DashboardService {
  async getDashboard(
    organizationId: string
  ) {
    const cacheKey =
      cacheKeys.dashboard(organizationId);

    // =========================================================
    // REDIS CACHE
    // =========================================================

    const cachedDashboard =
      await cacheService.get(cacheKey);

    if (cachedDashboard) {
      return cachedDashboard;
    }

    // =========================================================
    // MONGODB
    // =========================================================

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

    const dashboard = {
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

    // =========================================================
    // SAVE TO REDIS
    // Dashboard TTL = 5 minutes
    // =========================================================

    await cacheService.set(
      cacheKey,
      dashboard,
      300
    );

    return dashboard;
  }
}

export const dashboardService =
  new DashboardService();