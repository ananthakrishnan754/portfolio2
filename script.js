// ============= DATA =============
// ============= DATA =============
const experiences = [
  {
    role: "Embedded Systems Engineer",
    company: "Nuke Labs",
    date: "Jan 2024 – Present · Part-time",
    desc: "Own hardware architecture → firmware → bring-up for robotics, IoT and UAV systems. Full-time previously, part-time now while pursuing an M.Tech in VLSI Design."
  },
  {
    role: "SSCS Mentor",
    company: "IEEE SSCS Student Branch",
    date: "Apr 2026 – Present",
    desc: "Mentor hands-on RTL, firmware, and electronics-simulation workshops for the IEEE Solid-State Circuits Society student branch."
  },
  {
    role: "Secretary",
    company: "IEEE Student Branch, Sree Buddha College",
    date: "Jan 2025 – Apr 2026",
    desc: "Coordinate technical workshops, seminars, and events for a community of 80+ members. Oversee official communications, maintain organizational records, and support collaboration across student committees."
  },
  {
    role: "ATL Tinkering Lab Instructor (Freelance)",
    company: "Jawahar Navodaya Vidyalaya, Chennithala",
    date: "Oct 2025 – Apr 2026",
    desc: "Mentor students in robotics, IoT, and design thinking through hands-on learning sessions at the Atal Tinkering Lab."
  },
  {
    role: "Team Lead",
    company: "Entrepreneurship Cell (E-Cell)",
    date: "2023 – 2025",
    desc: "Lead a student team to promote innovation and entrepreneurship on campus by organizing startup-focused events, workshops, and industry guest sessions."
  }
];

const projects = [
  {
    title: "RTL Design Suite — Flip-Flops & ALU",
    desc: "Digital design suite covering D, JK, SR and T flip-flop families plus a parameterized ALU, every module with a self-checking testbench and waveform verification in ModelSim/QuestaSim.",
    tech: "Verilog, SystemVerilog, ModelSim"
  },
  {
    title: "UVM Verification Environment",
    desc: "Universal Verification Methodology environment around an ALU with constrained-random stimulus, driver/monitor/scoreboard, and functional coverage.",
    tech: "UVM, SystemVerilog, QuestaSim"
  },
  {
    title: "Material-Engineered PN Diode (Sentaurus)",
    desc: "PN junction diode simulated in Sentaurus TCAD across Si, Ge, GaAs and 4H-SiC with doping profiles, I-V extraction and recombination analysis.",
    tech: "Sentaurus TCAD, SDE, SDevice"
  },
  {
    title: "3-Stack Nanosheet GAA-NMOSFET",
    desc: "Gate-All-Around 3-stack nanosheet NMOS transistor built and analyzed with Sentaurus Structure Editor and device simulation.",
    tech: "Sentaurus SDE/SDevice"
  },
  {
    title: "Photodiode Engineering",
    desc: "Photodiode I-V under dark and illumination plus recombination summaries across Si, Ge, GaAs and 4H-SiC.",
    tech: "Sentaurus, DEVSIM"
  },
  {
    title: "ESP32 IoT Systems Suite",
    desc: "Collection of embedded devices including Ethernet (W5500) networking, desk clocks with CPU/RAM monitoring, and sensor-based displays.",
    tech: "ESP32, C/C++, IoT"
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
