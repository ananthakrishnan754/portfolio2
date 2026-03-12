// ============= DATA =============
const experiences = [
  {
    role: "ATL Tinkering Lab Instructor (Freelance)",
    company: "Jawahar Navodoya Vidyalaya, Chennithala",
    date: "Nov 2025 – Present",
    desc: "Mentoring young innovators in IoT, robotics, and design thinking. Collaborating with fellow instructors to facilitate hands-on sessions at the school-level innovation lab."
  },
  {
    role: "Secretary",
    company: "IEEE Student Branch, Sree Buddha College",
    date: "2024 – Present",
    desc: "Organize technical workshops and events for 80+ student members. Manage official communications, records, and committee collaboration."
  },
  {
    role: "Team Lead",
    company: "Entrepreneurship Cell (E-Cell)",
    date: "2023 – Present",
    desc: "Lead a team to foster innovation by organizing campus startup events, workshops, and guest lectures with industry professionals."
  }
];

const projects = [
  {
    title: "MemoryCare - AI Spectacles",
    desc: "Smart spectacles for Alzheimer’s patients using ESP32-CAM and Flask server for real-time facial recognition and Firebase data storage.",
    tech: "ESP32-CAM, Flask, Firebase, TTS"
  },
  {
    title: "Warehouse Drone (e-Yantra 2024-25)",
    desc: "Developed ROS 2 simulation for drone navigation and 2D mapping in Turtlesim.",
    tech: "ROS 2, OpenCV, Python"
  },
  {
    title: "Extraterrestrial Seismic Data Analysis",
    desc: "Analyzed Apollo & Mars InSight seismic event data using Python and signal processing.",
    tech: "Python, Pandas, Signal Processing"
  },
  {
    title: "ESP32 IoT Suite",
    desc: "Includes smart desk clock, Spotify controller, and sensor-based display systems.",
    tech: "ESP32, PlatformIO, Firebase"
  },
  {
    title: "Vision-Based Hospital Delivery Bot",
    desc: "Built ROS 2 prototype for autonomous package handling with computer vision.",
    tech: "ROS 2, Raspberry Pi, OpenCV"
  },
  {
    title: "ESP32-Based Drone",
    desc: "Constructed quadcopter with PID control for stable autonomous flight.",
    tech: "ESP32, C++, PID Control"
  }
];

// ============= POPULATE CONTENT =============
function populateCards(containerId, items, isProject = false) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card fade-section";
    card.innerHTML = isProject
      ? `<h3>${item.title}</h3><p>${item.desc}</p><p><strong>Tech:</strong> ${item.tech}</p>`
      : `<h3>${item.role}</h3><h4>${item.company}</h4><p><em>${item.date}</em></p><p>${item.desc}</p>`;
    container.appendChild(card);
  });
}

populateCards("experience-cards", experiences);
populateCards("project-cards", projects, true);

// ============= RESUME BUTTON =============
document.getElementById("resume-btn").addEventListener("click", () => {
  window.open("Ananthakrishnan_Resume.pdf", "_blank");
});

/* --------------------
   UI: Scroll reveal & Navbar behavior
   -------------------- */
const sections = document.querySelectorAll('.fade-section, section');
const cards = document.querySelectorAll('.card');
const nav = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('nav-toggle');
const navRight = document.querySelector('.nav-right');

// IntersectionObserver for sections and cards
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // if it's a nav target, highlight the corresponding link
      const id = entry.target.id;
      if (id) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    }
  });
}, observerOptions);

sections.forEach(s => revealObserver.observe(s));
cards.forEach(c => revealObserver.observe(c));

// Navbar background on scroll
const onScroll = () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// Smooth anchor scrolling with offset to account for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
      // close mobile nav if open
      if (navRight.classList.contains('open')) {
        navRight.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Mobile nav toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navRight.classList.toggle('open');
  });
}
