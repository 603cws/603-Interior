const jobListings = {
  "Interior Designer": {
    location: "Mumbai",
    experience: "2+ Years",
    type: "Full-Time",
    description:
      "We are looking for a creative and detail-oriented <strong>Interior Designer</strong> to conceptualize and execute office space designs. You will work closely with clients to create aesthetically pleasing, functional, and innovative work environments.",
    responsibilities: [
      "Assist in digital marketing campaigns and social media management.",
      "Conduct market research and competitor analysis.",
      "Work with architects and contractors to ensure seamless execution.",
      "Present design concepts to clients and incorporate feedback.",
      "Stay updated with industry trends and new materials.",
    ],
    requirements: [
      "Bachelor's degree in Interior Design or a related field.",
      "Proficiency in <strong>AutoCAD, SketchUp, V-Ray, and Adobe Suite</strong>.",
      "Strong creative and problem-solving skills.",
      "Excellent communication and project management skills.",
    ],
  },

  "Graphic Designer": {
    location: "Mumbai",
    experience: "1-3 Years",
    type: "Full-Time",
    description:
      "We are looking for a talented <strong>Graphic Designer</strong> to bring creativity to our branding, marketing materials, and digital content.",
    responsibilities: [
      "Design brochures, social media posts, presentations, and branding materials.",
      "Create 3D renders and visual representations of office spaces.",
      "Collaborate with the marketing team to develop engaging graphics.",
      "Maintain brand consistency across all visual content.",
    ],
    requirements: [
      "Proficiency in <strong>Adobe Photoshop, Illustrator, InDesign, and Canva</strong>.",
      "Experience with <strong>3D visualization software</strong> is a plus.",
      "Strong attention to detail and a creative eye.",
      "Ability to work on multiple projects simultaneously.",
    ],
  },

  "Web Developer": {
    location: "Mumbai",
    experience: "2+ Years",
    type: "Full-Time",
    description:
      "We are seeking a skilled <strong>Web Developer</strong> to develop and maintain our interior design platform...",
    responsibilities: [
      "Develop and maintain the company website and design platform.",
      "Optimize the website for speed, SEO, and mobile responsiveness.",
      "Work on UI/UX improvements and interactive features.",
      "Troubleshoot and resolve technical issues.",
    ],
    requirements: [
      "Proficiency in <strong>HTML, CSS, JavaScript, React, and WordPress</strong>.",
      "Knowledge of <strong>UI/UX design principles</strong>.",
      "Experience with <strong>SEO and website performance optimization</strong>.",
      "Ability to work independently and solve complex problems.",
    ],
  },

  "Social Media Manager": {
    location: "Mumbai",
    experience: "1-3 Years",
    type: "Full-Time",
    description:
      "We are looking for a <strong>Social Media Manager</strong> to build and manage our digital presence...",
    responsibilities: [
      "Develop and execute social media strategies for brand awareness.",
      "Create, schedule, and manage posts across Instagram, LinkedIn, Facebook, and Pinterest.",
      "Engage with the audience and respond to queries/comments.",
      "Collaborate with designers to create visually appealing content.",
      "Track analytics and optimize campaigns for better reach.",
    ],
    requirements: [
      "Experience in managing social media platforms for brands.",
      "Knowledge of <strong>Instagram, Facebook, LinkedIn algorithms, and paid ads</strong>.",
      "Creativity in crafting engaging posts and campaigns.",
      "Strong communication and copywriting skills.",
    ],
  },

  "Marketing Intern": {
    location: "Mumbai",
    experience: "Freshers",
    type: "Internship",
    description:
      "This internship offers hands-on experience in marketing, digital strategy, and brand promotion. If you are a creative thinker eager to learn and grow in the marketing space, this role is perfect for you!",
    responsibilities: [
      "Assist in digital marketing campaigns and social media management.",
      "Conduct market research and competitor analysis.",
      "Help in content creation for blogs, emails, and social media.",
      "Support the team in event planning and promotional activities.",
    ],
    requirements: [
      "Currently pursuing or completed a degree in <strong>Marketing, Mass Communication, or Business</strong>.",
      "Basic knowledge of <strong>social media marketing and content creation</strong>.",
      "Excellent communication and research skills.",
      "Eagerness to learn and contribute to marketing strategies.",
    ],
  },

  "Site Supervisor": {
    location: "Mumbai",
    experience: "2+ Years",
    type: "Full-Time",
    description:
      "We are hiring a <strong>Site Supervisor</strong> to oversee office interior projects and ensure seamless execution from start to finish.",
    responsibilities: [
      "Supervise on-site construction, installations, and vendor work.",
      "Coordinate with designers, contractors, and clients for smooth execution.",
      "Ensure projects are completed on time and within budget.",
      "Maintain quality control and adhere to safety regulations.",
    ],
    requirements: [
      "Experience in supervising interior fit-out projects.",
      "Strong knowledge of materials, construction methods, and site management.",
      "Good organizational and problem-solving skills.",
      "Ability to handle multiple projects simultaneously.",
    ],
  },

  "Interior Design Intern": {
    location: "Mumbai",
    experience: "Freshers",
    type: "Internship",
    description:
      "We are offering an <strong>Interior Design Internship</strong> for creative individuals who want hands-on experience in workspace design.",
    responsibilities: [
      "Assist in designing office spaces and developing layouts.",
      "Work on 3D renderings, mood boards, and concept presentations.",
      "Research materials, furniture, and design trends.",
      "Support senior designers in client meetings and project execution.",
    ],
    requirements: [
      "Pursuing or completed a degree in <strong>Interior Design</strong>.",
      "Basic proficiency in <strong>AutoCAD, SketchUp, and Photoshop</strong>.",
      "Strong creativity and willingness to learn.",
      "Passion for workspace design and innovation.",
    ],
  },
};

// Function to fetch job details by title
export const getJobDetails = (title) => jobListings[title] || null;

export default jobListings;
