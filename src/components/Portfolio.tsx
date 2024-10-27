{/* Previous imports remain the same */}
import React from 'react';
import { ParsedResume } from '../services/types';
import { Briefcase, GraduationCap, Code, Mail, Phone, MapPin, Github, Linkedin, Globe, Calendar, Building, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioProps {
  data: ParsedResume;
}

function Portfolio({ data }: PortfolioProps) {
  // Previous scroll logic remains the same
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Generate avatar URL based on name
  const getAvatarUrl = (name: string) => {
    const seed = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=6d28d9,818cf8,ec4899&radius=50`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left space-y-4 flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{data.basics.name}</h1>
            <h2 className="text-xl md:text-2xl text-purple-400">{data.basics.title}</h2>
            <p className="text-slate-300 text-lg leading-relaxed">{data.basics.summary}</p>
            
            <div className="flex flex-wrap gap-6 pt-4">
              {data.basics.email && (
                <a 
                  href={`mailto:${data.basics.email}`} 
                  className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>{data.basics.email}</span>
                </a>
              )}
              {data.basics.phone && (
                <a 
                  href={`tel:${data.basics.phone}`} 
                  className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>{data.basics.phone}</span>
                </a>
              )}
              {data.basics.location && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-5 h-5" />
                  <span>{data.basics.location}</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <SocialLink href={data.basics.github} icon={<Github className="w-5 h-5" />} />
              <SocialLink href={data.basics.linkedin} icon={<Linkedin className="w-5 h-5" />} />
              <SocialLink href={data.basics.website} icon={<Globe className="w-5 h-5" />} />
            </div>
          </div>

          <div className="w-48 h-48 rounded-full shadow-lg overflow-hidden ring-4 ring-purple-500/20 bg-gradient-to-br from-purple-500 to-pink-500">
            <img 
              src={getAvatarUrl(data.basics.name)}
              alt={`${data.basics.name}'s avatar`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Rest of the component remains the same */}
      {/* Skills Section */}
      <section className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-purple-400" />
          Skills & Technologies
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-slate-900/50 text-purple-300 rounded-lg border border-slate-700 hover:border-purple-500/50 transition-all duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" />
            Featured Projects
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-lg bg-slate-900/50 text-slate-300 hover:text-purple-400 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-lg bg-slate-900/50 text-slate-300 hover:text-purple-400 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600"
          style={{ 
            scrollbarWidth: 'thin',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {data.experience.map((exp, index) => (
            <div 
              key={index} 
              className="group bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all duration-300 flex-none w-[400px] snap-start"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {exp.position}
                  </h3>
                  <div className="flex items-center gap-2 text-purple-400 mt-1">
                    <Building className="w-4 h-4" />
                    <span>{exp.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                </div>
              </div>

              <ul className="space-y-3 mt-4">
                {exp.highlights.map((highlight, i) => (
                  <li key={i} className="text-slate-300 flex items-start gap-3 group-hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4 mt-1 flex-shrink-0 text-purple-400" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-4">
                {exp.highlights.flatMap((highlight, i) => 
                  getProjectTechnologies(highlight)
                ).filter((tech, i, arr) => arr.indexOf(tech) === i)
                .map((tech, i) => (
                  <span 
                    key={i}
                    className="px-2 py-1 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-purple-400" />
          Education
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.education.map((edu, index) => (
            <div key={index} className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-2">{edu.institution}</h3>
              <p className="text-purple-400 mb-1">{edu.degree} in {edu.field}</p>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Graduated {formatDate(edu.graduationDate)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Helper components and functions remain the same
function SocialLink({ href, icon }: { href?: string; icon: React.ReactNode }) {
  if (!href) return null;
  
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-300 hover:text-purple-400 transition-colors"
    >
      {icon}
    </a>
  );
}

function formatDate(date: string): string {
  if (date.toLowerCase() === 'present') return 'Present';
  const [year, month] = date.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

function getProjectTechnologies(text: string): string[] {
  const commonTech = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Docker', 
    'AWS', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API',
    'CI/CD', 'Kubernetes', 'Microservices', 'Vue', 'Angular', 'Next.js',
    'Express', 'Django', 'Flask', 'Spring Boot', 'Java', 'C#', '.NET',
    'SQL', 'NoSQL', 'Git', 'GitHub', 'GitLab', 'Jenkins', 'Azure',
    'GCP', 'Firebase', 'Serverless', 'Linux', 'DevOps'
  ];
  
  return commonTech.filter(tech => 
    text.toLowerCase().includes(tech.toLowerCase())
  );
}

export default Portfolio;