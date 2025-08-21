interface PracticeAreaCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function PracticeAreaCard({ title, description, icon }: PracticeAreaCardProps) {
  return (
    <div 
      className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-fas-border p-8 card-hover"
      data-testid={`practice-area-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="text-fas-accent mb-6">
        <i className={`${icon} text-3xl`}></i>
      </div>
      <h3 className="text-xl font-semibold text-fas-navy mb-4">{title}</h3>
      <p className="text-fas-text mb-6 leading-relaxed text-sm">
        {description}
      </p>
      <a 
        href="#contact" 
        className="text-fas-accent font-medium hover:text-fas-navy transition-colors text-sm uppercase tracking-wide"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }}
        data-testid={`practice-area-link-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        Saiba mais
      </a>
    </div>
  );
}
