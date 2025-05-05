export function TeamMemberCard({ member }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-amber-600 mb-3">{member.role}</p>
        <p className="text-gray-600">{member.bio}</p>
      </div>
    </div>
  );
}
