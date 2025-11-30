// Profile API Service with test/production mode
import { isTestMode } from "../config";
import { apiClient } from "../client";
import { dummyProfile, generateId } from "../dummy-data";
import type { Profile, ProfileUpdate, ExperienceItem } from "../types";

// In-memory store for test mode
let testProfile = { ...dummyProfile };

export const profileService = {
  async get(): Promise<Profile> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { ...testProfile };
    }
    // Get the first profile (assuming single user)
    const response = await apiClient.fetch<{ items: Profile[] }>(
      "/api/v1/profiles?limit=1"
    );
    if (response.items.length === 0) {
      throw new Error("Profile not found");
    }
    return response.items[0];
  },

  async update(data: ProfileUpdate): Promise<Profile> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      testProfile = {
        ...testProfile,
        ...data,
        updated_at: new Date().toISOString(),
      };
      return { ...testProfile };
    }
    return apiClient.fetch<Profile>(`/api/v1/profiles/${testProfile.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async addExperience(
    experience: Omit<ExperienceItem, "id">
  ): Promise<Profile> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const newExperience: ExperienceItem = {
        ...experience,
        id: generateId(),
      };
      testProfile.experience.unshift(newExperience);
      testProfile.updated_at = new Date().toISOString();
      return { ...testProfile };
    }
    // In production, update the whole profile with new experience
    const currentProfile = await this.get();
    return this.update({
      experience: [
        { ...experience, id: generateId() },
        ...currentProfile.experience,
      ],
    });
  },

  async updateExperience(
    experienceId: string,
    data: Partial<ExperienceItem>
  ): Promise<Profile> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const index = testProfile.experience.findIndex(
        (e) => e.id === experienceId
      );
      if (index === -1) throw new Error("Experience not found");
      testProfile.experience[index] = {
        ...testProfile.experience[index],
        ...data,
      };
      testProfile.updated_at = new Date().toISOString();
      return { ...testProfile };
    }
    const currentProfile = await this.get();
    const updatedExperience = currentProfile.experience.map((e) =>
      e.id === experienceId ? { ...e, ...data } : e
    );
    return this.update({ experience: updatedExperience });
  },

  async deleteExperience(experienceId: string): Promise<Profile> {
    if (isTestMode()) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      testProfile.experience = testProfile.experience.filter(
        (e) => e.id !== experienceId
      );
      testProfile.updated_at = new Date().toISOString();
      return { ...testProfile };
    }
    const currentProfile = await this.get();
    return this.update({
      experience: currentProfile.experience.filter(
        (e) => e.id !== experienceId
      ),
    });
  },

  // Reset test data
  resetTestData() {
    testProfile = { ...dummyProfile };
  },
};
