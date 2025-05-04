export function JobCard({
  title,
  company,
  location,
  salary_min,
  salary_max,
  type,
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <p className="text-gray-600 mt-1">{company}</p>
      <div className="flex items-center mt-3 text-sm text-gray-500">
        <span>{location}</span>
        <span className="mx-2">•</span>
        <span>{type}</span>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="font-medium text-black">
          {salary_min}
          <span className="text-sm font-extrabold">৳</span> - {salary_max}
          <span className="text-sm font-extrabold">৳</span>
        </span>
        <button className="text-sm font-medium px-4 py-2 pb-3 hover:bg-amber-500 bg-amber-600 text-white rounded-md">
          Apply
        </button>
      </div>
    </div>
  );
}
