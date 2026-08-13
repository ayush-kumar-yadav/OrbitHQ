import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { successResponse } from "../responses/apiResponse";

import { notificationService } from "../services/notification.service";

class NotificationController {
  getNotifications = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.id;
      const organizationId =
        req.user.organizationId;

      if (!organizationId) {
        return res.status(400).json(
          successResponse(
            null,
            "User does not belong to an organization"
          )
        );
      }

      const limit = req.query.limit
        ? Number(req.query.limit)
        : 20;

      const notifications =
        await notificationService.getNotifications(
          userId,
          organizationId,
          limit
        );

      return res.status(200).json(
        successResponse(
          notifications,
          "Notifications fetched successfully"
        )
      );
    }
  );

  getUnreadCount = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.id;
      const organizationId =
        req.user.organizationId;

      if (!organizationId) {
        return res.status(400).json(
          successResponse(
            null,
            "User does not belong to an organization"
          )
        );
      }

      const count =
        await notificationService.getUnreadCount(
          userId,
          organizationId
        );

      return res.status(200).json(
        successResponse(
          { count },
          "Unread notification count fetched successfully"
        )
      );
    }
  );

  markAsRead = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user.id;
      const organizationId =
        req.user.organizationId;

      if (!organizationId) {
        return res.status(400).json(
          successResponse(
            null,
            "User does not belong to an organization"
          )
        );
      }

      const notificationId =
        String(req.params.id);

      const notification =
        await notificationService.markAsRead(
          notificationId,
          userId,
          organizationId
        );

      return res.status(200).json(
        successResponse(
          notification,
          "Notification marked as read"
        )
      );
    }
  );
}

export const notificationController =
  new NotificationController();