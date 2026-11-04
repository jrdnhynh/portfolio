/* ==========================================================
   SITE CONTENT
   Everything you'd want to edit lives in this one file.
   ========================================================== */

window.SITE = {
  profile: {
    name: "Jordan Huynh",
    kana: "ジョーダン・フイン",
    handle: "jrdnhynh",
    role: "Web developer",
    title: "Digital Marketing Developer at Textron Aviation",
    location: "Wichita, KS",
    relocate: true,
    email: "hello@jordanhuynh.me",
    linkedin: "https://www.linkedin.com/in/sjordanhuynh",
    github: "https://github.com/jrdnhynh",
    resume: "resume/Jordan-Huynh-Resume.pdf",
    photo: "images/headshot.png",
    tagline: "I turn high-fidelity Figma designs into fast, accessible pages that ship.",
    summary:
      "Web developer at Textron Aviation, where I build and maintain five enterprise aviation sites, launch product pages for new aircraft, and wire up the analytics that tell us what's working. On the side I build client sites and CRM automations for local businesses at PurelyScale."
  },

  /* Set to false to hide the Japanese katakana captions everywhere. */
  katakana: false,

  /* The easter egg. Desktop: type the code. Phones: tap the logo 5 times.
     Volume starts at 50% and visitors can change it with the slider on the radio.
     song.src: an MP3 in /audio plays through the radio (most reliable).
     Leave src "" to use the SoundCloud player instead. */
  easterEgg: {
    code: ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"],
    photo: "images/secret.jpg",
    song: {
      title: "maplestory",
      src: "audio/maplestory.mp3",
      soundcloud: "https://soundcloud.com/toilajor/maplestory",
      /* If the player doesn't load, open the track on SoundCloud, go to Share > Embed,
         copy the URL inside src="..." and paste it here. */
      soundcloudPlayer: ""
    }
  },

  /* The little radio in the top bar.
     Leave `tracks` empty to play the built-in synth loop.
     To play your own music, drop MP3s in /audio and list them:
     tracks: [{ title: "My song", src: "audio/my-song.mp3" }] */
  radio: {
    station: "JH-FM",
    tracks: []
  },

  about: [
    "I've always gone with the flow and followed wherever my interests take me. Web development was the moment it clicked: it's where my love for design meets my interest in tech.",
    "Most days I take polished Figma files from designers and agencies and turn them into production pages that hold up on every screen, load fast, and are easy for marketing teams to keep updated."
  ],

  now: [
    { label: "Building", text: "Five enterprise aviation sites at Textron Aviation" },
    { label: "Freelancing", text: "Client sites and CRM workflows at PurelyScale" },
    { label: "Looking for", text: "Roles in e-commerce, martech and web production at companies doing cool work. New York is the top pick, but I'm open to anywhere: Seattle, Chicago, Austin, Atlanta and beyond." },
    { label: "Tinkering", text: "Modding a PS Vita to play the games I missed as a kid" }
  ],

  interests: [
    { name: "Apparel production", note: "Screenprinting and embroidery" },
    { name: "Fashion", note: "Style is design you wear" },
    { name: "Music festivals", note: "Four years running: Shaky Knees this year, Lollapalooza the three before. I love traveling with friends to hear live music." },
    { name: "DJing", note: "Learning just for fun" },
    { name: "Skateboarding", note: "Started during COVID and still love the mix of style and technique" },
    { name: "Games", note: "Halo 3, MapleStory, Borderlands, League of Legends, Guitar Hero" }
  ],

  journey: [
    { when: "Start", text: "Started at Knox College for business after high school. It wasn't the right fit, so I withdrew." },
    { when: "2022", text: "Butler Community College: A.A.S. in Digital Media." },
    { when: "2024", text: "A.A.S. in Web Development, and my first internship at Textron Aviation." },
    { when: "2025", text: "A.A.S. in Software Development and a summer at Shure." },
    { when: "2026", text: "B.S. from Fort Hays State and full-time at Textron Aviation. I was accepted into Georgia Tech's M.S. in Computer Science, but chose to put that time into real client work at PurelyScale instead." },
    { when: "Next", text: "Looking for my next challenge, in a role or a grad program, that pushes me creatively and keeps me learning. E-commerce, martech and web production all excite me, and I'd love to land in a city with more opportunity. New York is the dream since I have friends there, but I'm open to anywhere with great companies, like Seattle, Chicago, Austin or Atlanta." }
  ],

  /* logo: optional logo on the card's sticker. logoBg sets the sticker color.
     brand: text shown on the sticker when there's no logo file yet.
     color: butter | mustard | cyan | cobalt | lavender | salmon | mint
     motif: cross | gear | clover | atom  (the shapes drawn on the card)
     image: optional screenshot, e.g. "images/owner-support.jpg" (replaces the motif) */
  projects: [
    {
      id: "owner-support", logo: "images/logos/textron-aviation.png", logoDark: true,
      title: "Owner Support",
      kind: "Landing page",
      client: "Textron Aviation",
      year: "2026",
      url: "https://txtav.com/lp/owner-support",
      stack: ["HTML", "CSS", "JavaScript", "Splide", "GSAP", "Lenis"],
      color: "cyan", motif: "cross",
      footnote: "built from an agency Figma file",
      summary:
        "An agency handed over a high-fidelity Figma design and I built it into a production landing page for Textron Aviation's owner support programs.",
      points: [
        "Matched the agency design closely across desktop, tablet and mobile",
        "Scroll-driven motion with GSAP and smooth scrolling with Lenis",
        "Touch-friendly carousels with Splide",
        "Kept the page light enough to load fast on txtav.com"
      ]
    },
    {
      id: "gen3", logo: "images/logos/cessna.png", logoBg: "#0075cc",
      title: "Citation Gen3",
      kind: "Product pages",
      client: "Cessna",
      year: "2024",
      url: "https://cessna.com",
      stack: ["Sitecore", "HTML", "CSS", "JavaScript"],
      color: "salmon", motif: "gear",
      footnote: "M2, CJ3 and CJ4, live on announcement day",
      summary:
        "Product pages for the Citation M2 Gen3, CJ3 Gen3 and CJ4 Gen3, built and published to go live with the NBAA-BACE announcement.",
      points: [
        "Three aircraft pages launched on a fixed announcement date",
        "Responsive, accessible layouts built in Sitecore",
        "Schema markup so the pages could show rich results in Google"
      ]
    },
    {
      id: "voyager", logo: "images/logos/pipistrel.svg",
      title: "Pipistrel Voyager",
      kind: "Product page",
      client: "Pipistrel",
      year: "2026",
      url: "https://www.pipistrel-aircraft.com/products/voyager/",
      stack: ["HTML", "CSS", "JavaScript"],
      color: "mint", motif: "clover",
      footnote: "ready for the EAA AirVenture debut",
      summary:
        "I led the Voyager product page launch so it was live ahead of the aircraft's debut at EAA AirVenture.",
      points: [
        "Owned the page from build through launch",
        "Coordinated content with the product and marketing teams",
        "Launched on schedule for the AirVenture debut"
      ]
    },
    {
      id: "upgrades", logo: "images/logos/textron-aviation.png", logoDark: true,
      title: "Upgrades Catalog",
      kind: "Product catalog",
      client: "Textron Aviation",
      year: "2026",
      url: "https://upgrades.txtav.com",
      stack: ["CMS", "Content"],
      color: "mustard", motif: "cross",
      footnote: "new listings go live as certification lands",
      summary:
        "I publish and manage 15+ aircraft upgrade listings on upgrades.txtav.com as each product completes STC certification.",
      points: [
        "15+ product listings and counting",
        "Work with engineering and business teams to keep specs accurate",
        "New listings go live as soon as certification lands"
      ]
    },
    {
      id: "txtav-sites", logo: "images/logos/textron-aviation.png", logoDark: true,
      title: "Textron Aviation Web",
      kind: "Enterprise websites",
      client: "Textron Aviation",
      year: "2026",
      url: "https://txtav.com",
      stack: ["Sitecore", "WordPress", "Adobe Marketo", "HTML", "CSS", "JavaScript"],
      color: "lavender", motif: "gear",
      footnote: "five sites, seven business units",
      summary:
        "I build and maintain the web properties for Textron Aviation's business units: txtav.com, cessna.com, beechcraft.com, trusimulation.com and pipistrel-aircraft.com. That includes landing pages, journey articles and Marketo forms for Textron Aviation, Cessna, Beechcraft, Aftermarket, ProAdvantage, McCauley and Special Missions.",
      stats: [
        { value: "70+", label: "form fills per week across the business units" },
        { value: "800+", label: "weekly readers per journey article" },
        { value: "100K+", label: "monthly users across the sites" }
      ],
      points: [
        "Day-to-day builds and updates across five enterprise sites",
        "Journey articles that bring readers into the main web properties",
        "Marketo forms connected across every business unit"
      ]
    },
    {
      id: "event-pages", logo: "images/logos/textron-aviation.png", logoDark: true,
      title: "Event Pages",
      kind: "Event & RSVP pages",
      client: "Textron Aviation",
      year: "2026",
      url: "",
      stack: ["Sitecore", "Adobe Marketo", "HTML", "CSS"],
      color: "salmon", motif: "clover",
      footnote: "built for the events team to send out",
      summary:
        "I build event pages for Textron Aviation's global events and brand teams. They send the pages to customers, who use them to RSVP and get the event details.",
      points: [
        "Pages the events and brand teams can send straight to customers",
        "RSVP forms connected to Adobe Marketo",
        "Event details in one place for attendees"
      ]
    },
    {
      id: "dashboards", logo: "images/logos/textron-aviation.png", logoDark: true,
      title: "Traffic Dashboards",
      kind: "Analytics",
      client: "Textron Aviation",
      year: "2026",
      url: "",
      stack: ["GA4", "Data Studio", "Tag Manager"],
      color: "cobalt", motif: "atom",
      footnote: "used by 7 business units",
      summary:
        "GA4 and Data Studio dashboards that 7 business units use to track traffic and conversion and decide what to change on their pages and campaigns.",
      points: [
        "One view of traffic and conversion per business unit",
        "Findings feed back into page and campaign decisions"
      ]
    },
    {
      id: "purelyscale", logo: "images/logos/purelyscale.png",
      title: "PurelyScale",
      kind: "Client sites & CRM",
      client: "Local businesses",
      year: "2026",
      url: "https://purelyscale.com",
      stack: ["React", "TypeScript", "GoHighLevel"],
      color: "butter", motif: "clover",
      footnote: "sites, SEO and CRM for local shops",
      summary:
        "At PurelyScale I build client websites, landing pages, e-commerce integrations and CRM workflows for local businesses.",
      points: [
        "Lead client calls and turn business needs into a site, SEO and CRM plan",
        "Automate follow-ups and lead capture in GoHighLevel",
        "Connect new tools to the systems clients already use"
      ]
    },
    {
      id: "this-site",
      title: "This Site",
      kind: "Personal site",
      client: "Me",
      year: "2026",
      url: "https://github.com/jrdnhynh",
      stack: ["HTML", "CSS", "JavaScript", "GSAP", "Web Audio"],
      color: "cyan", motif: "atom",
      footnote: "best viewed with headphones on",
      summary:
        "A portfolio that borrows from the Flash-era sites and broadcast graphics I love. No framework, no build step, and the radio up top is synthesized live in your browser.",
      points: [
        "Keyboard, mouse and touch navigation",
        "Sound effects and a tiny radio built with the Web Audio API",
        "Recruiter mode for a quick one-page read",
        "All content lives in one data file"
      ]
    }
  ],

  /* logo: path to an official logo file (SVG or PNG) for the card sticker.
     Leave it "" to show the short name instead. logoDark: true puts it on a dark sticker. */
  experience: [
    {
      role: "Digital Marketing Developer",
      company: "Textron Aviation", short: "Textron", logo: "images/logos/textron-aviation.png", logoDark: true,
      dates: "Jun 2026 – Present",
      stack: ["HTML", "CSS", "JavaScript", "Sitecore", "WordPress"],
      points: [
        "Build event pages for the global events and brand teams and Marketo-connected landing pages across 7 business units, which together average 70+ form fills per week",
        "Create journey articles averaging 800+ weekly users, part of 100K+ monthly active users across the web properties",
        "Build and maintain txtav.com, cessna.com, beechcraft.com, trusimulation.com and pipistrel-aircraft.com, including leading the Pipistrel Voyager launch",
        "Publish 15+ upgrade listings on upgrades.txtav.com as products complete STC certification",
        "Build GA4 and Data Studio dashboards used by 7 business units"
      ]
    },
    {
      role: "Web Developer",
      company: "PurelyScale", short: "PurelyScale", logo: "images/logos/purelyscale.png",
      dates: "Jun 2026 – Present",
      stack: ["GoHighLevel", "React", "TypeScript"],
      points: [
        "Build and launch client websites, landing pages, e-commerce integrations and CRM workflows",
        "Lead client conversations and translate business needs into web, SEO and CRM solutions"
      ]
    },
    {
      role: "Digital Marketing Software Intern",
      company: "Shure", short: "Shure", logo: "images/logos/shure.png", logoDark: true,
      dates: "May 2025 – Aug 2025",
      stack: ["Sitecore", "Salesforce Email Studio"],
      points: [
        "Launched 5 targeted campaigns for the MOTIV Mix desktop app, reaching tens of thousands of users",
        "Built a re-engagement email workflow in Salesforce to win back lapsed users",
        "Wrote 2 product blog posts and presented 3 monetization strategies from a competitive analysis"
      ]
    },
    {
      role: "Digital Marketing Developer Intern",
      company: "Textron Aviation", short: "Textron", logo: "images/logos/textron-aviation.png", logoDark: true,
      dates: "Jun 2024 – May 2025",
      stack: ["HTML", "CSS", "JavaScript", "Semrush", "Sitecore"],
      points: [
        "Shipped 100+ web updates and 10+ responsive, accessible pages",
        "Built the M2, CJ3 and CJ4 Gen3 product pages ahead of NBAA-BACE",
        "Added schema markup across key pages for rich results in Google"
      ]
    },
    {
      role: "Marketing Automation Intern",
      company: "Meritrust Credit Union", short: "Meritrust", logo: "images/logos/meritrust.png",
      dates: "May 2023 – Aug 2023",
      stack: ["Adobe Marketo", "Google Tag Manager", "WordPress"],
      points: [
        "Ran 30+ targeted email campaigns in Marketo across member segments",
        "Improved analytics accuracy by 25% by fixing tracking gaps in Tag Manager",
        "Published SEO-focused blog content in WordPress"
      ]
    }
  ],

  skills: [
    { group: "Front end", note: "What I build with every day", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "GSAP", "Lenis", "Splide", "Sass", "Bootstrap", "jQuery"] },
    { group: "CMS & platforms", note: "Where the pages live", items: ["Sitecore", "WordPress", "GoHighLevel", "Wix"] },
    { group: "Marketing & analytics", note: "How we know it worked", items: ["GA4", "Google Tag Manager", "Data Studio", "Semrush", "Adobe Marketo", "Salesforce"] },
    { group: "Design & media", note: "Reading designs and making assets", items: ["Figma handoff", "Photoshop", "Illustrator", "Premiere Pro", "After Effects", "InDesign", "Lightroom"] },
    { group: "From coursework", note: "Languages and tools from my degrees", items: ["Java", "Python", "C#", "C++", "PHP", "SQL", "Node.js", "MERN", "Firebase", "PWAs", "AWS"] }
  ],

  education: [
    {
      degree: "B.S. Information Networking & Telecommunications",
      focus: "Web & Mobile App Development",
      school: "Fort Hays State University", short: "FHSU", logo: "images/logos/fhsu.png",
      date: "May 2026",
      gpa: "3.93",
      courses: [
        ["Front-End Web Development II", "HTML, CSS & React"],
        ["Back-End Web Development I", "PHP, SQL & MERN"],
        ["Mobile Web Development", "PWA, Firebase, IndexedDB"],
        ["Front-End Web Development I", "HTML, CSS & JS"],
        ["Introduction to Human-Computer Interaction", ""],
        ["Capstone Seminar in Informatics", "HTML, CSS & JS"]
      ]
    },
    {
      degree: "A.A.S. Software Development",
      school: "Butler Community College", short: "Butler", logo: "images/logos/butler.png",
      date: "Jul 2025",
      gpa: "3.72",
      courses: [
        ["Python Programming with Data Science", "Python"],
        ["Advanced Python with Machine Learning Games", "Python"],
        ["Beginning C++ with Game Programming", "C++"],
        ["Java Programming", "Java"],
        ["C#", "C#"],
        ["Database Design and Management", "SQL"],
        ["AWS Academy Cloud Foundations & Architecting", "AWS"]
      ]
    },
    {
      degree: "A.A.S. Web Development",
      school: "Butler Community College", short: "Butler", logo: "images/logos/butler.png",
      date: "May 2024",
      gpa: "3.70",
      courses: [
        ["Advanced Web Scripting", "jQuery & Node.js"],
        ["Advanced HTML & CSS", "Sass & Bootstrap"],
        ["PHP & Databases", "PHP & MySQL"],
        ["CMS for Web Development", "WordPress"],
        ["Web Scripting", "JavaScript"],
        ["UX/UI Fundamentals", "XD"]
      ]
    },
    {
      degree: "A.A.S. Digital Media",
      school: "Butler Community College", short: "Butler", logo: "images/logos/butler.png",
      date: "Dec 2022",
      gpa: "3.70",
      courses: [
        ["Game, Storyline, and Character Development", ""],
        ["Photoshop & Illustrator Fundamentals", "Adobe CC"],
        ["Interactive Digital Signage", "After Effects"],
        ["Digital Photography 1 & 2", "Photoshop & Lightroom"],
        ["Stop Motion Animation", "Premiere Pro"],
        ["Digital Media Capstone", "Adobe CC"]
      ]
    }
  ]
};
