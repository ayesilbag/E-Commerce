import TeamMember from "./TeamMember";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Chief Executive Officer",
      image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=2070&auto=format"
    },
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1596075780750-81249df16d19?q=80&w=1974&auto=format"
    },
    {
      name: "Michael Patel",
      role: "Chief Operations Officer",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format"
    },
    {
      name: "Jennifer Lopez",
      role: "Chief Marketing Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-base font-semibold uppercase tracking-wide mb-6">Liderliğimizi Tanıyın</h2>
          <p className="text-gray-600 text-sm">
            Vizyonumuzu ileriye taşıyan ve ekibimizi mükemmelliğe ilham veren yetenekli bireyler.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;