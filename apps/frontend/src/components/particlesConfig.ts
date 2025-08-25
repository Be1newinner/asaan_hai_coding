export const particlesConfig = {
  background: {
    color: {
      value: "#0d1117",
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      repulse: {
        distance: 80,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: false,
      opacity: 0.5,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "out",
      },
      random: true,
      speed: 0.2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 500,
    },
    opacity: {
      value: { min: 0.1, max: 0.7 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 0.5, max: 2.5 },
    },
  },
  detectRetina: true,
};
