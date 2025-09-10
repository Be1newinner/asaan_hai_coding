"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Award,
  Code2,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import TANSTACK_QUERY_KEYS from "@/utils/tanstack_query_keys";
import { profileService } from "@/services/profile";
import Link from "next/link";

const skills = [
  { name: "JavaScript/TypeScript", level: 95, category: "Frontend" },
  { name: "React/Next.js", level: 90, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 80, category: "Backend" },
  { name: "Tailwind CSS", level: 90, category: "Frontend" },
  { name: "PostgreSQL", level: 75, category: "Database" },
  { name: "MongoDB", level: 70, category: "Database" },
  { name: "Docker", level: 65, category: "DevOps" },
];

const experience = [
  {
    title: "Senior Full Stack Developer",
    company: "Tech Innovations Inc.",
    period: "2022 - Present",
    description:
      "Leading development of scalable web applications using Next.js, TypeScript, and cloud technologies. Mentoring junior developers and architecting solutions for enterprise clients.",
  },
  {
    title: "Frontend Developer",
    company: "Digital Solutions Ltd.",
    period: "2020 - 2022",
    description:
      "Developed responsive web applications using React and modern JavaScript. Collaborated with design teams to implement pixel-perfect UI components and optimize user experiences.",
  },
  {
    title: "Junior Developer",
    company: "StartupXYZ",
    period: "2019 - 2020",
    description:
      "Built and maintained web applications using various technologies. Gained experience in full-stack development and agile methodologies.",
  },
];

const achievements = [
  "Published 50+ programming tutorials with 100K+ views",
  "Built and deployed 25+ production applications",
  "Contributed to 10+ open source projects",
  "Mentored 200+ aspiring developers",
  "Speaker at 5 tech conferences",
];

export default function HydratedAbout() {
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: [TANSTACK_QUERY_KEYS.PROFILE_PAGE],
    queryFn: () => profileService.getProfile(),
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-white">
        <p>Loading profile...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30 text-center text-red-500">
        <p>Failed to load profile</p>
      </section>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            About Me
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          {profile?.about_me}
        </p>
      </div>

      {/* Hero Section */}
      <Card className="bg-slate-900/50 border-slate-800 mb-12">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1 text-center">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <Image
                  src={
                    profile?.profile_image?.secure_url ||
                    "/placeholder.svg?height=200&width=200&text=Profile+Photo"
                  }
                  alt="Profile Photo"
                  width={200}
                  height={200}
                  className="rounded-full object-cover border-4 border-blue-500"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20"></div>
              </div>
              <div className="flex justify-center space-x-4">
                {profile?.support_links?.map((link) => (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 hover:bg-slate-800"
                    asChild
                    key={link.id}
                  >
                    <Link href={link.url}>
                      <Image
                        height={64}
                        width={64}
                        src={link.icon}
                        alt={link.title + "URL"}
                        className="h-4 w-4 mr-2"
                      />
                      {link.title}
                    </Link>
                  </Button>
                ))}
              </div>

              <div className="lg:col-span-2 mt-4">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Hi, I&apos;m {profile?.full_name}
                </h2>
                <h4 className="text-1xl font-bold mb-4 text-slate-400">
                  FULL STACK AI ML DEVELOPER
                </h4>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {profile?.description}
                </p>
                <div className="flex items-center space-x-6 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Remote, Worldwide</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{profile?.availability}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-400" />
              <span>Technical Skills</span>
            </CardTitle>
            <CardDescription>
              Technologies and tools I work with regularly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile?.technical_skills?.map((skill) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">
                    {skill.title}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-slate-800 text-slate-400 text-xs"
                    >
                      {skill.category}
                    </Badge>
                    {/* <span className="text-slate-400 text-sm">
                      {skill.level}%
                    </span> */}
                  </div>
                </div>
                {/* <Progress value={skill.level} className="h-2" /> */}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-green-400" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>
              Milestones and accomplishments in my journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {profile?.achievements?.map((achievement) => (
                <li key={achievement.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">{achievement.title}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Experience Section */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-purple-400" />
            <span>Professional Experience</span>
          </CardTitle>
          <CardDescription>
            My journey in the world of software development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {profile?.experiences?.map((job, index) => (
              <div key={index} className="relative">
                {index !== experience.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-700"></div>
                )}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {job.title}
                    </h3>
                    <p className="text-purple-400 font-medium">{job.company}</p>
                    <p className="text-slate-400 text-sm mb-2">
                      {job.from_date} - {job.to_date}
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
