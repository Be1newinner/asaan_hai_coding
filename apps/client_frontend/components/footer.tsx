import Link from "next/link"
import { Github, Linkedin, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex space-x-6 mb-4">
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="h-6 w-6" />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-gray-400 text-sm mb-2">Made with ❤️ by Vijay</p>
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Asaan Hai Coding. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
