interface PracticeAreaCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function PracticeAreaCard({ title, description, icon }: PracticeAreaCardProps) {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-8 card-hover"
      data-testid={`practice-area-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="text-professional-blue mb-4">
        <i className={`${icon} text-4xl`}></i>
      </div>
      <h3 className="text-xl font-semibold text-navy mb-4">{title}</h3>
      <p className="text-warm-gray mb-6 leading-relaxed">
        {description}
      </p>
      <a 
        href="#contact" 
        className="text-professional-blue font-semibold hover:underline"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        }}
        data-testid={`practice-area-link-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        Saiba mais →
      </a>
    </div>
  );
}
