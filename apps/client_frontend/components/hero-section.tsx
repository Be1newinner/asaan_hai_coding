import SearchBar from "@/components/search-bar"

const HeroSection = () => {
  return (
    <div className="relative py-20 px-4 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-gray-950 z-0"></div>

      {/* Animated code snippet background (simplified) */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="w-full h-full bg-[url('/placeholder.svg?height=800&width=1600')] bg-center bg-no-repeat bg-cover"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Asaan Hai Coding
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">Learn Dev the Easy Way!</p>
          <SearchBar />
        </div>
      </div>
    </div>
  )
}

export default HeroSection
