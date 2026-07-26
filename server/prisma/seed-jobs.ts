import prisma from './index.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { JobType, ExperienceLevel, WorkMode, Role } from './generated/prisma/client.js';

dotenv.config();

const companies = [
  { companyName: 'TechCorp Innovations', industry: 'Software & Technology', location: 'Dhaka, Bangladesh', size: '50-200', website: 'https://techcorp.example.com', companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150' },
  { companyName: 'CyberPulse Systems', industry: 'Cybersecurity', location: 'Remote / Austin, TX', size: '20-50', website: 'https://cyberpulse.example.com', companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150' },
  { companyName: 'DataMind Solutions', industry: 'Data Science & AI', location: 'San Francisco, CA', size: '100-500', website: 'https://datamind.example.com', companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150' },
  { companyName: 'CloudScale Labs', industry: 'Cloud Computing', location: 'Seattle, WA', size: '500-1000', website: 'https://cloudscale.example.com', companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150' },
  { companyName: 'Finovate Capital', industry: 'Fintech & Banking', location: 'London, UK', size: '200-500', website: 'https://finovate.example.com', companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150' },
  { companyName: 'GreenGrid Energy', industry: 'CleanTech', location: 'Berlin, Germany', size: '50-100', website: 'https://greengrid.example.com', companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150' },
  { companyName: 'PixelCraft Studios', industry: 'Design & Creative Media', location: 'New York, NY', size: '10-50', website: 'https://pixelcraft.example.com', companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150' },
  { companyName: 'Apex Healthtech', industry: 'Healthcare & Biotech', location: 'Boston, MA', size: '100-250', website: 'https://apexhealth.example.com', companyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150' },
  { companyName: 'NextGen Mobility', industry: 'Automotive & IoT', location: 'Tokyo, Japan', size: '1000+', website: 'https://nextgenmob.example.com', companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150' },
  { companyName: 'ShopSphere Ecommerce', industry: 'E-commerce & Retail', location: 'Toronto, Canada', size: '250-500', website: 'https://shopsphere.example.com', companyLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150' }
];

const jobTitles = [
  // Engineering
  { title: 'Senior Full Stack Developer', position: 'Senior Software Engineer', category: 'Software Engineering', skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'], exp: ExperienceLevel.SENIOR },
  { title: 'Frontend Developer (React / Next.js)', position: 'Frontend Developer', category: 'Frontend Development', skills: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'JavaScript'], exp: ExperienceLevel.MID },
  { title: 'Junior Backend Engineer (Node.js)', position: 'Backend Engineer', category: 'Backend Development', skills: ['Node.js', 'Express', 'MongoDB', 'REST API'], exp: ExperienceLevel.JUNIOR },
  { title: 'Lead DevOps & Infrastructure Engineer', position: 'Lead DevOps Engineer', category: 'DevOps & Cloud', skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'], exp: ExperienceLevel.LEAD },
  { title: 'Python Backend Engineer (FastAPI)', position: 'Software Engineer', category: 'Backend Development', skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'], exp: ExperienceLevel.MID },
  { title: 'iOS Application Developer (Swift)', position: 'Mobile Developer', category: 'Mobile Development', skills: ['Swift', 'SwiftUI', 'iOS SDK', 'RESTful APIs'], exp: ExperienceLevel.MID },
  { title: 'Android Engineer (Kotlin)', position: 'Mobile Developer', category: 'Mobile Development', skills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'MVVM'], exp: ExperienceLevel.JUNIOR },
  { title: 'Embedded Systems Engineer', position: 'Hardware Engineer', category: 'Hardware & IoT', skills: ['C++', 'C', 'RTOS', 'Microcontrollers', 'IoT'], exp: ExperienceLevel.SENIOR },
  { title: 'Go (Golang) Microservices Developer', position: 'Backend Software Engineer', category: 'Backend Development', skills: ['Golang', 'gRPC', 'Microservices', 'PostgreSQL', 'Docker'], exp: ExperienceLevel.SENIOR },
  { title: 'Staff Software Architect', position: 'Principal Architect', category: 'Software Engineering', skills: ['System Design', 'Microservices', 'Distributed Systems', 'Cloud Architecture'], exp: ExperienceLevel.LEAD },

  // Data & AI
  { title: 'Senior Data Engineer', position: 'Data Engineer', category: 'Data Engineering', skills: ['Python', 'PySpark', 'Snowflake', 'Airflow', 'SQL'], exp: ExperienceLevel.SENIOR },
  { title: 'Machine Learning Engineer (NLP / LLMs)', position: 'AI Engineer', category: 'Artificial Intelligence', skills: ['Python', 'PyTorch', 'LangChain', 'Transformers', 'MLOps'], exp: ExperienceLevel.SENIOR },
  { title: 'Data Analyst', position: 'Data Analyst', category: 'Data Analytics', skills: ['SQL', 'Tableau', 'PowerBI', 'Python', 'Excel'], exp: ExperienceLevel.ENTRY },
  { title: 'AI Research Scientist', position: 'Research Scientist', category: 'Artificial Intelligence', skills: ['TensorFlow', 'PyTorch', 'Computer Vision', 'Deep Learning'], exp: ExperienceLevel.LEAD },
  { title: 'Database Administrator (PostgreSQL)', position: 'Database Admin', category: 'Database Administration', skills: ['PostgreSQL', 'Database Tuning', 'Replication', 'Backup & Recovery'], exp: ExperienceLevel.MID },

  // Product & Design
  { title: 'Lead UI/UX Designer', position: 'Product Designer', category: 'Design', skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'], exp: ExperienceLevel.LEAD },
  { title: 'Product Manager (B2B SaaS)', position: 'Product Manager', category: 'Product Management', skills: ['Agile', 'Product Strategy', 'Roadmapping', 'Jira', 'User Analytics'], exp: ExperienceLevel.SENIOR },
  { title: 'Associate Product Manager', position: 'Associate PM', category: 'Product Management', skills: ['User Stories', 'Market Research', 'Agile/Scrum', 'Data Analysis'], exp: ExperienceLevel.ENTRY },
  { title: 'UX Writer & Content Strategist', position: 'UX Copywriter', category: 'Design', skills: ['UX Copywriting', 'Content Strategy', 'Microcopy', 'Figma'], exp: ExperienceLevel.MID },
  { title: 'Senior Graphic & Brand Designer', position: 'Brand Designer', category: 'Design', skills: ['Adobe Illustrator', 'Photoshop', 'Branding', 'Typography'], exp: ExperienceLevel.MID },

  // QA & Security
  { title: 'Senior QA Automation Engineer', position: 'QA Engineer', category: 'Quality Assurance', skills: ['Cypress', 'Playwright', 'Selenium', 'JavaScript', 'Jest'], exp: ExperienceLevel.SENIOR },
  { title: 'Cybersecurity Threat Analyst', position: 'Security Specialist', category: 'Cybersecurity', skills: ['SIEM', 'Penetration Testing', 'Network Security', 'Incident Response'], exp: ExperienceLevel.MID },
  { title: 'Information Security Officer', position: 'Security Engineer', category: 'Cybersecurity', skills: ['SOC 2', 'ISO 27001', 'Cloud Security', 'Compliance'], exp: ExperienceLevel.SENIOR },

  // Business, Marketing & Operations
  { title: 'Digital Marketing Specialist', position: 'Marketing Manager', category: 'Marketing', skills: ['SEO', 'Google Ads', 'Content Marketing', 'Social Media', 'Analytics'], exp: ExperienceLevel.MID },
  { title: 'Technical Recruiter', position: 'Talent Acquisition', category: 'Human Resources', skills: ['Tech Sourcing', 'Interviewing', 'Applicant Tracking Systems', 'LinkedIn Recruiter'], exp: ExperienceLevel.JUNIOR },
  { title: 'Customer Success Manager', position: 'Customer Success Specialist', category: 'Customer Operations', skills: ['Client Relations', 'Account Management', 'SaaS Onboarding', 'Zendesk'], exp: ExperienceLevel.MID },
  { title: 'Enterprise Account Executive', position: 'Sales Executive', category: 'Sales', skills: ['B2B Sales', 'CRM', 'Lead Generation', 'Contract Negotiation'], exp: ExperienceLevel.SENIOR },
  { title: 'Operations & Project Coordinator', position: 'Project Manager', category: 'Operations', skills: ['Project Planning', 'Asana', 'Risk Management', 'Agile'], exp: ExperienceLevel.JUNIOR }
];

const locations = [
  'Dhaka, Bangladesh',
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Singapore',
  'Remote (Worldwide)',
  'Remote (US Only)',
  'Seattle, WA',
  'Tokyo, Japan'
];

const workModes = [WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ONSITE];
const jobTypes = [JobType.FULL_TIME, JobType.PART_TIME, JobType.CONTRACT, JobType.INTERNSHIP, JobType.FREELANCE];

async function main() {
  console.log('🌱 Starting database seeding for 60+ jobs...');

  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create or fetch Employers
  const employerRecords = [];

  for (let i = 0; i < companies.length; i++) {
    const comp = companies[i];
    const email = `employer${i + 1}@${comp.companyName.toLowerCase().replace(/[^a-z]/g, '')}.com`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        firstName: comp.companyName.split(' ')[0],
        lastName: 'HR',
        email,
        password: defaultPassword,
        role: Role.EMPLOYER,
        isEmailVerified: true,
        isActive: true,
      },
    });

    const employer = await prisma.employer.upsert({
      where: { userId: user.id },
      update: {
        companyName: comp.companyName,
        companyLogo: comp.companyLogo,
        website: comp.website,
        industry: comp.industry,
        size: comp.size,
        description: `${comp.companyName} is a leading organization in the ${comp.industry} sector dedicated to building innovative products and scaling high-impact technology solutions.`,
        location: comp.location,
        isVerified: true,
      },
      create: {
        userId: user.id,
        companyName: comp.companyName,
        companyLogo: comp.companyLogo,
        website: comp.website,
        industry: comp.industry,
        size: comp.size,
        description: `${comp.companyName} is a leading organization in the ${comp.industry} sector dedicated to building innovative products and scaling high-impact technology solutions.`,
        location: comp.location,
        isVerified: true,
      },
    });

    employerRecords.push(employer);
  }

  console.log(`✅ Created/verified ${employerRecords.length} employer profiles.`);

  // 2. Generate 60+ Jobs
  const jobsToCreate = [];
  let jobCounter = 0;

  // We loop to generate multiple variations of the job titles across different employers
  for (let round = 0; round < 3; round++) {
    for (let j = 0; j < jobTitles.length; j++) {
      const template = jobTitles[j];
      const employer = employerRecords[(j + round) % employerRecords.length];
      const location = locations[(j + round) % locations.length];
      const workMode = workModes[(j + round) % workModes.length];
      const type = jobTypes[(j + round) % jobTypes.length];

      let baseSalary = 50000;
      if (template.exp === ExperienceLevel.ENTRY) baseSalary = 35000 + Math.floor(Math.random() * 15000);
      else if (template.exp === ExperienceLevel.JUNIOR) baseSalary = 55000 + Math.floor(Math.random() * 20000);
      else if (template.exp === ExperienceLevel.MID) baseSalary = 80000 + Math.floor(Math.random() * 30000);
      else if (template.exp === ExperienceLevel.SENIOR) baseSalary = 120000 + Math.floor(Math.random() * 40000);
      else if (template.exp === ExperienceLevel.LEAD) baseSalary = 160000 + Math.floor(Math.random() * 60000);

      const salaryMax = baseSalary + 20000 + Math.floor(Math.random() * 30000);
      const postedDaysAgo = Math.floor(Math.random() * 25);
      const postedAt = new Date(Date.now() - postedDaysAgo * 24 * 60 * 60 * 1000);
      const deadlineDays = 30 + Math.floor(Math.random() * 60);
      const deadline = new Date(postedAt.getTime() + deadlineDays * 24 * 60 * 60 * 1000);

      const titleVariation = round === 0 ? template.title : `${template.title} (${workMode === WorkMode.REMOTE ? 'Remote' : location.split(',')[0]})`;

      jobsToCreate.push({
        title: titleVariation,
        description: `### About ${employer.companyName}\n${employer.description}\n\n### Role Overview\nWe are looking for an exceptional **${template.position}** to join our fast-growing team. You will play a key role in building scalable systems, collaborating with cross-functional teams, and driving core product features.\n\n### Responsibilities\n- Design, develop, and deliver high-quality software solutions.\n- Collaborate with product managers, designers, and engineers.\n- Participate in code reviews, technical architecture discussions, and continuous improvement.\n- Optimize performance and ensure security standards.\n\n### Required Skills & Qualifications\n- Hands-on experience with ${template.skills.join(', ')}.\n- Proven track record of delivering impactful features.\n- Strong problem-solving and communication skills.`,
        position: template.position,
        employerId: employer.id,
        location,
        type,
        experience: template.exp,
        workMode,
        officeTime: '9:00 AM - 5:00 PM',
        salary: baseSalary,
        salaryMax,
        currency: location.includes('Bangladesh') ? 'BDT' : location.includes('UK') ? 'GBP' : location.includes('Germany') ? 'EUR' : 'USD',
        postedAt,
        deadline,
        isActive: true,
        views: Math.floor(Math.random() * 150),
        skills: template.skills,
      });

      jobCounter++;
      if (jobCounter >= 65) break;
    }
    if (jobCounter >= 65) break;
  }

  // Clear existing jobs to ensure fresh dataset or just append
  console.log(`📦 Creating ${jobsToCreate.length} job postings in the database...`);
  
  for (const jobData of jobsToCreate) {
    await prisma.job.create({
      data: jobData,
    });
  }

  console.log(`🎉 Successfully seeded ${jobsToCreate.length} jobs into PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
