import { Link } from 'react-router-dom';
import { GraduationCap, Globe, ExternalLink, Star, BookOpen, Mail } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Browse Courses', to: '/courses' },
    { label: 'Technology', to: '/courses?type=TECHNOLOGY' },
    { label: 'Management', to: '/courses?type=MANAGEMENT' },
    { label: 'My Courses', to: '/my-courses' },
  ],
  Company: [
    { label: 'About Us', to: '#' },
    { label: 'Careers', to: '#' },
    { label: 'Blog', to: '#' },
    { label: 'Contact', to: '#' },
  ],
  Support: [
    { label: 'Help Center', to: '#' },
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Refund Policy', to: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#060B14] border-t border-[#1e293b] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5C6AC4, #00D4AA)' }}>
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight gradient-text">SkillMint</span>
            </Link>
            <p className="text-[#64748b] text-sm leading-relaxed max-w-xs mb-6">
              Empowering learners worldwide with premium courses in Technology and Management. Learn from industry experts. Build real skills.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Globe size={16} />, href: '#' },
                { icon: <ExternalLink size={16} />, href: '#' },
                { icon: <BookOpen size={16} />, href: '#' },
                { icon: <Star size={16} />, href: '#' },
                { icon: <Mail size={16} />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2d3748] text-[#64748b] hover:text-[#5C6AC4] hover:border-[#5C6AC4] transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-[#e2e8f0] mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-[#64748b] hover:text-[#e2e8f0] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#475569]">© 2024 SkillMint. All rights reserved.</p>
          <p className="text-xs text-[#94a3b8] font-medium">Developed by Yuvraj Kumar</p>
          <div className="flex items-center gap-1 text-xs text-[#475569]">
            <span>Powered by</span>
            <span className="text-[#5C6AC4] font-medium">Spring Boot</span>
            <span>+</span>
            <span className="text-[#00D4AA] font-medium">React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
