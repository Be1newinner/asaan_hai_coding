import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Youtube, Github, Linkedin, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { contacts, youtube_headline } from "@/constants/about";

export default function AboutPage() {
  const skills = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express",
    "FastAPI",
    "Python",
    "Docker",
    "AWS",
    "MongoDB",
    "PostgreSQL",
    "Redux",
    "TailwindCSS",
    "GraphQL",
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="md:w-1/3">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=400&width=400"
                alt="Vijay's Profile"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <Link
                href={contacts.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </Link>
              <Link
                href={contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href={contacts.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About Me</h1>

            <p className="text-gray-300 mb-4">
              Hi, I'm Vijay! I&apos;m a full-stack developer with a passion for
              building clean, efficient, and user-friendly web applications.
              With over 5 years of experience in the industry, I've worked on a
              wide range of projects from small startups to large enterprise
              applications.
            </p>

            <p className="text-gray-300 mb-6">
              I created "Asaan Hai Coding" (which means "Coding is Easy" in
              Hindi) to share my knowledge and experience with the developer
              community. Through tutorials, blog posts, and open-source
              contributions, I aim to make coding more accessible and enjoyable
              for everyone.
            </p>

            <Button className="bg-purple-600 hover:bg-purple-700 mb-8">
              <Mail className="mr-2 h-4 w-4" />
              Let's Collaborate
            </Button>

            <h2 className="text-xl font-bold mb-3">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">About Asaan Hai Coding</h2>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <p className="text-gray-300 mb-4">
              Asaan Hai Coding is a platform dedicated to making coding
              accessible to everyone. The name "Asaan Hai Coding" translates to
              "Coding is Easy" in Hindi, which reflects our mission to simplify
              complex programming concepts.
            </p>

            <p className="text-gray-300 mb-4">
              Through our blog posts, tutorials, and open-source contributions,
              we aim to help developers of all skill levels improve their craft
              and build amazing applications.
            </p>

            <p className="text-gray-300">
              Whether you&apos;re just starting your coding journey or
              you&apos;re an experienced developer looking to expand your
              skills, Asaan Hai Coding has something for you.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">YouTube Channel</h2>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="aspect-video w-full mb-6">
              <iframe
                className="w-full h-full rounded-lg"
                src={youtube_headline}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="text-center">
              <p className="text-gray-300 mb-4">
                Subscribe to our YouTube channel for video tutorials,
                code-alongs, and tech discussions.
              </p>

              <Link
                href={contacts.youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-red-600 hover:bg-red-700">
                  <Youtube className="mr-2 h-4 w-4" />
                  Subscribe to Channel
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
