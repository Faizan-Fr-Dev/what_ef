import { useState, useEffect } from "react";
const slides = [
  {
    id: 1,
    image: "https://public-files.gumroad.com/xgv2vpc3mlnwv3qap93jn7r80zpi",
    title: "STRANGE THINGS INSIDE ONE MIND",
    subtitle: "A fractured universe where fear creates monsters"
  },
  {
    id: 2,
    image: "https://public-files.gumroad.com/gd0jk76wn2dj8bs0dcap67853ohs",
    title: "ONE IDIOT SURVIVED ALL GAMES",
    subtitle: "Logic meets chaos in this darkly humorous survival story"
  },
  {
    id: 3,
    image: "https://public-files.gumroad.com/j0qj6vbo0nn8ih4xsmgclex1ioum",
    title: "THE FIRST DIGITAL HEIST",
    subtitle: "Digital vaults, silent wars, and a mastermind rewriting reality"
  }
];
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5e3);
    return () => clearInterval(timer);
  }, []);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  return <div className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] overflow-hidden mb-12 rounded-b-2xl md:rounded-b-3xl shadow-xl md:shadow-2xl border-b-2 md:border-b-4 border-yellow-500">
            {
    /* Slides */
  }
            {slides.map((slide, index) => <div
    key={slide.id}
    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
  >
                    {
    /* Image Background */
  }
                    <div className="absolute inset-0 bg-slate-900">
                        {
    /* Blurred background to fill space */
  }
                        <img
    src={slide.image}
    alt=""
    className="w-full h-full object-cover opacity-30 blur-xl scale-110"
  />
                        {
    /* Main fitted image */
  }
                        <img
    src={slide.image}
    alt={slide.title}
    className="absolute inset-0 w-full h-full object-contain z-10"
  />
                    </div>

                    {
    /* Content Overlay */
  }
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent">
                        {
    /* Added sm: and md: text sizes for better responsiveness */
  }
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-yellow-400 font-bangers tracking-wider drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] animate-pulse px-2">
                            {slide.title}
                        </h1>
                        <p className="mt-2 sm:mt-4 text-sm sm:text-xl md:text-3xl text-white font-medium drop-shadow-lg tracking-wide bg-black/40 px-4 sm:px-6 py-1 sm:py-2 rounded-full backdrop-blur-sm border border-yellow-500/30">
                            {slide.subtitle}
                        </p>
                    </div>
                </div>)}

            {
    /* Navigation Buttons */
  }
            <button
    onClick={prevSlide}
    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-30 p-1 md:p-2 bg-black/50 hover:bg-yellow-500/80 rounded-full text-white hover:text-black transition-all duration-300 border border-yellow-400/50 group"
  >
                <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-5 h-5 md:w-8 md:h-8 group-hover:scale-110 transition-transform"
  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            <button
    onClick={nextSlide}
    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-30 p-1 md:p-2 bg-black/50 hover:bg-yellow-500/80 rounded-full text-white hover:text-black transition-all duration-300 border border-yellow-400/50 group"
  >
                <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-5 h-5 md:w-8 md:h-8 group-hover:scale-110 transition-transform"
  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            {
    /* Dots Indicator */
  }
            <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2 md:space-x-3">
                {slides.map((_, index) => <button
    key={index}
    onClick={() => setCurrentSlide(index)}
    className={`w-2 h-2 md:w-4 md:h-4 rounded-full transition-all duration-300 border border-yellow-400 ${index === currentSlide ? "bg-yellow-400 scale-125 shadow-[0_0_10px_rgba(250,204,21,0.8)]" : "bg-transparent hover:bg-yellow-400/50"}`}
  />)}
            </div>
        </div>;
};
export default HeroSection;
