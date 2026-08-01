import { api } from "../api/client";

export const commentService = {
  async getComments(taskId: string) {
    const response = await api.get(
      `/tasks/${taskId}/comments`
    );

    return response.data;
  },

  async createComment(
    taskId: string,
    content: string
  ) {
    const response = await api.post(
      `/tasks/${taskId}/comments`,
      {
        content,
      }
    );

    return response.data;
  },

  async updateComment(
    commentId: string,
    content: string
  ) {
    const response = await api.put(
      `/comments/${commentId}`,
      {
        content,
      }
    );

    return response.data;
  },

  async deleteComment(
    commentId: string
  ) {
    const response = await api.delete(
      `/comments/${commentId}`
    );

    return response.data;
  },
};