import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
      <div className="relative w-full h-64">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
          priority={true}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-amber-600 mb-3">{member.role}</p>
        <p className="text-gray-600">{member.bio}</p>
      </div>
    </div>
  );
}
