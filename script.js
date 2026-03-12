// ============= DATA =============
// ============= DATA =============
const experiences = [
  {
    role: "ATL Tinkering Lab Instructor (Freelance)",
    company: "Jawahar Navodaya Vidyalaya, Chennithala",
    date: "Nov 2025 – Present",
    desc: "Mentor students in robotics, IoT, and design thinking through hands-on learning sessions at the Atal Tinkering Lab. Guide young innovators in building practical prototypes and developing problem-solving skills."
  },
  {
    role: "Secretary",
    company: "IEEE Student Branch, Sree Buddha College",
    date: "2024 – Present",
    desc: "Coordinate technical workshops, seminars, and events for a community of 80+ members. Oversee official communications, maintain organizational records, and support collaboration across student committees."
  },
  {
    role: "Team Lead",
    company: "Entrepreneurship Cell (E-Cell)",
    date: "2023 – Present",
    desc: "Lead a student team to promote innovation and entrepreneurship on campus by organizing startup-focused events, workshops, and industry guest sessions."
  }
];

const projects = [
  {
    title: "MemoryCare – AI Smart Spectacles",
    desc: "Assistive system for Alzheimer’s patients that recognizes people using an ESP32-CAM and OpenCV-based face recognition pipeline. Images are processed via a Flask server and stored in Firebase, with recognized identities delivered through audio feedback.",
    tech: "ESP32-CAM, OpenCV, Flask, Firebase, Python"
  },
  {
    title: "Vision-Based Autonomous Robot (Monocular Navigation)",
    desc: "Developed an autonomous robot capable of navigating environments using a single monocular camera and computer vision algorithms for perception and obstacle understanding.",
    tech: "ROS 2, OpenCV, Python, Raspberry Pi"
  },
  {
    title: "AI-Based Waste Sorting Machine",
    desc: "Computer vision system that automatically classifies and sorts waste materials using machine learning models, enabling smarter recycling and waste management.",
    tech: "Python, OpenCV, Machine Learning"
  },
  {
    title: "AI Solar Panel Maintenance System",
    desc: "Designed an intelligent system for solar panel maintenance featuring automated dust cleaning and AI-based crack detection to improve efficiency and predictive maintenance.",
    tech: "Computer Vision, Python, Embedded Systems"
  },
  {
    title: "AI Face Aging Generator",
    desc: "Developed an AI application capable of generating realistic facial transformations to visualize how a person may look at different ages using generative deep learning models.",
    tech: "Python, Deep Learning, Computer Vision"
  },
  {
    title: "Warehouse Drone Simulation (e-Yantra 2024–25)",
    desc: "Built a ROS 2 simulation for warehouse drone navigation and mapping tasks as part of the e-Yantra Robotics Competition.",
    tech: "ROS 2, Gazebo, Python, OpenCV"
  },
  {
    title: "Vision-Based Hospital Delivery Robot",
    desc: "Prototype autonomous delivery robot designed for hospital environments, using computer vision and ROS 2 for navigation and package handling.",
    tech: "ROS 2, Raspberry Pi, OpenCV"
  },
  {
    title: "RK Tech Labs – Client Websites & Web Apps",
    desc: "Designed and developed multiple professional websites and web applications for clients, focusing on responsive design, performance, and scalable deployment.",
    tech: "HTML, CSS, JavaScript, Full-Stack Development"
  },
  {
    title: "ESP32 IoT Systems Suite",
    desc: "Collection of IoT devices including smart desk clocks, Spotify controllers, and sensor-based information displays built using ESP32 microcontrollers.",
    tech: "ESP32, C++, Firebase, IoT"
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
  anchor.addEventListener('click', function (e) {
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
