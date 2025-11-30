// Courses API Service with test/production mode
import { isTestMode } from "../config";
import { apiClient } from "../client";
import {
  dummyCourses,
  dummySections,
  dummyLessons,
  generateId,
} from "../dummy-data";
import type {
  Course,
  CourseCreate,
  CourseUpdate,
  Section,
  SectionCreate,
  SectionUpdate,
  Lesson,
  LessonCreate,
  LessonUpdate,
  PaginatedResponse,
} from "../types";

// In-memory stores for test mode
let testCourses = [...dummyCourses];
let testSections = [...dummySections];
let testLessons = [...dummyLessons];

export const coursesService = {
  // Courses
  async listCourses(params?: {
    skip?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Course>> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = [...testCourses];
      if (params?.status && params.status !== "all") {
        filtered = filtered.filter((c) => c.status === params.status);
      }
      const skip = params?.skip || 0;
      const limit = params?.limit || 100;
      return {
        items: filtered.slice(skip, skip + limit),
        total: filtered.length,
        skip,
        limit,
      };
    }
    const queryParams = new URLSearchParams();
    if (params?.skip) queryParams.set("skip", params.skip.toString());
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.status) queryParams.set("status", params.status);
    return apiClient.fetch<PaginatedResponse<Course>>(
      `/api/v1/courses?${queryParams}`
    );
  },

  async getCourse(id: string): Promise<Course> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const course = testCourses.find((c) => c.id === id);
      if (!course) throw new Error("Course not found");
      return course;
    }
    return apiClient.fetch<Course>(`/api/v1/courses/${id}`);
  },

  async createCourse(data: CourseCreate): Promise<Course> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newCourse: Course = {
        id: generateId(),
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        thumbnail: data.thumbnail || null,
        price: data.price || 0,
        status: data.status || "draft",
        sections_count: 0,
        lessons_count: 0,
        students_count: 0,
        progress: 0,
        owner_id: "1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      testCourses.unshift(newCourse);
      return newCourse;
    }
    return apiClient.fetch<Course>("/api/v1/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCourse(id: string, data: CourseUpdate): Promise<Course> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = testCourses.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Course not found");
      testCourses[index] = {
        ...testCourses[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return testCourses[index];
    }
    return apiClient.fetch<Course>(`/api/v1/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteCourse(id: string): Promise<void> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = testCourses.findIndex((c) => c.id === id);
      if (index === -1) throw new Error("Course not found");
      const sectionIds = testSections
        .filter((s) => s.course_id === id)
        .map((s) => s.id);
      testLessons = testLessons.filter(
        (l) => !sectionIds.includes(l.section_id)
      );
      testSections = testSections.filter((s) => s.course_id !== id);
      testCourses.splice(index, 1);
      return;
    }
    return apiClient.fetch<void>(`/api/v1/courses/${id}`, { method: "DELETE" });
  },

  // Sections
  async listSections(courseId: string): Promise<Section[]> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return testSections
        .filter((s) => s.course_id === courseId)
        .sort((a, b) => a.order - b.order);
    }
    const response = await apiClient.fetch<PaginatedResponse<Section>>(
      `/api/v1/sections?course_id=${courseId}`
    );
    return response.items;
  },

  async getSection(id: string): Promise<Section> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const section = testSections.find((s) => s.id === id);
      if (!section) throw new Error("Section not found");
      return section;
    }
    return apiClient.fetch<Section>(`/api/v1/sections/${id}`);
  },

  async createSection(data: SectionCreate): Promise<Section> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const existingSections = testSections.filter(
        (s) => s.course_id === data.course_id
      );
      const newSection: Section = {
        id: generateId(),
        title: data.title,
        summary: data.summary || null,
        order: data.order ?? existingSections.length + 1,
        course_id: data.course_id,
        lessons_count: 0,
        duration_minutes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      testSections.push(newSection);
      // Update course sections count
      const courseIndex = testCourses.findIndex((c) => c.id === data.course_id);
      if (courseIndex !== -1) {
        testCourses[courseIndex].sections_count++;
      }
      return newSection;
    }
    return apiClient.fetch<Section>("/api/v1/sections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateSection(id: string, data: SectionUpdate): Promise<Section> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const index = testSections.findIndex((s) => s.id === id);
      if (index === -1) throw new Error("Section not found");
      testSections[index] = {
        ...testSections[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return testSections[index];
    }
    return apiClient.fetch<Section>(`/api/v1/sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteSection(id: string): Promise<void> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const section = testSections.find((s) => s.id === id);
      if (!section) throw new Error("Section not found");
      // Delete associated lessons
      const deletedLessonsCount = testLessons.filter(
        (l) => l.section_id === id
      ).length;
      testLessons = testLessons.filter((l) => l.section_id !== id);
      testSections = testSections.filter((s) => s.id !== id);
      // Update course counts
      const courseIndex = testCourses.findIndex(
        (c) => c.id === section.course_id
      );
      if (courseIndex !== -1) {
        testCourses[courseIndex].sections_count--;
        testCourses[courseIndex].lessons_count -= deletedLessonsCount;
      }
      return;
    }
    return apiClient.fetch<void>(`/api/v1/sections/${id}`, {
      method: "DELETE",
    });
  },

  // Lessons
  async listLessons(sectionId: string): Promise<Lesson[]> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return testLessons
        .filter((l) => l.section_id === sectionId)
        .sort((a, b) => a.order - b.order);
    }
    const response = await apiClient.fetch<PaginatedResponse<Lesson>>(
      `/api/v1/lessons?section_id=${sectionId}`
    );
    return response.items;
  },

  async getLesson(id: string): Promise<Lesson> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const lesson = testLessons.find((l) => l.id === id);
      if (!lesson) throw new Error("Lesson not found");
      return lesson;
    }
    return apiClient.fetch<Lesson>(`/api/v1/lessons/${id}`);
  },

  async createLesson(data: LessonCreate): Promise<Lesson> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const existingLessons = testLessons.filter(
        (l) => l.section_id === data.section_id
      );
      const newLesson: Lesson = {
        id: generateId(),
        title: data.title,
        content: data.content || null,
        content_type: data.content_type || "text",
        duration_minutes: data.duration_minutes || 0,
        order: data.order ?? existingLessons.length + 1,
        is_published: data.is_published ?? false,
        section_id: data.section_id,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
        tags: data.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      testLessons.push(newLesson);
      // Update section and course counts
      const section = testSections.find((s) => s.id === data.section_id);
      if (section) {
        const sectionIndex = testSections.findIndex(
          (s) => s.id === data.section_id
        );
        testSections[sectionIndex].lessons_count++;
        testSections[sectionIndex].duration_minutes +=
          newLesson.duration_minutes;
        const courseIndex = testCourses.findIndex(
          (c) => c.id === section.course_id
        );
        if (courseIndex !== -1) {
          testCourses[courseIndex].lessons_count++;
        }
      }
      return newLesson;
    }
    return apiClient.fetch<Lesson>("/api/v1/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateLesson(id: string, data: LessonUpdate): Promise<Lesson> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const index = testLessons.findIndex((l) => l.id === id);
      if (index === -1) throw new Error("Lesson not found");
      testLessons[index] = {
        ...testLessons[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      return testLessons[index];
    }
    return apiClient.fetch<Lesson>(`/api/v1/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async deleteLesson(id: string): Promise<void> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const lesson = testLessons.find((l) => l.id === id);
      if (!lesson) throw new Error("Lesson not found");
      const section = testSections.find((s) => s.id === lesson.section_id);
      testLessons = testLessons.filter((l) => l.id !== id);
      // Update counts
      if (section) {
        const sectionIndex = testSections.findIndex((s) => s.id === section.id);
        testSections[sectionIndex].lessons_count--;
        testSections[sectionIndex].duration_minutes -= lesson.duration_minutes;
        const courseIndex = testCourses.findIndex(
          (c) => c.id === section.course_id
        );
        if (courseIndex !== -1) {
          testCourses[courseIndex].lessons_count--;
        }
      }
      return;
    }
    return apiClient.fetch<void>(`/api/v1/lessons/${id}`, { method: "DELETE" });
  },

  // Reset test data
  resetTestData() {
    testCourses = [...dummyCourses];
    testSections = [...dummySections];
    testLessons = [...dummyLessons];
  },
};
