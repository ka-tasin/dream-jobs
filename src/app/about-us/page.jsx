"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaBullseye, FaHandshake, FaRocket, FaUsers } from "react-icons/fa";
import { TeamMemberCard } from "../components/About-us/TeamMembers/TeamMembers";

export default function AboutUsPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const teamMembers = [
    {
      name: "Kausar Ahmad Tasin",
      role: "Founder & CEO",
      bio: "Tech entrepreneur with 10+ years in HR technology",
      image: "/images/kat.jpg",
    },
    {
      name: "Sarah Johnson",
      role: "Head of Product",
      bio: "Product specialist focused on user experience",
      image: "/team/sarah.jpg",
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      bio: "Full-stack developer building the platform",
      image: "/team/michael.jpg",
    },
    {
      name: "Aisha Rahman",
      role: "Community Manager",
      bio: "Connects job seekers with opportunities",
      image: "/team/aisha.jpg",
    },
  ];

  const stats = [
    { value: "50,000+", label: "Jobs Posted" },
    { value: "1M+", label: "Candidates Hired" },
    { value: "10,000+", label: "Companies Trust Us" },
    { value: "95%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="bg-white mt-28">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-gray-600 to-gray-700 text-white py-20"
      >
        <div className="absolute inset-0 bg-black/50">
          {" "}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10"></div>{" "}
          {/* Optional subtle texture */}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About DreamJobs
          </motion.h1>
          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Connecting talent with opportunity through innovative technology and
            human-centered design.
          </motion.p>
        </div>
      </motion.section>

      {/* Our Story */}
      <motion.section
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.8 } },
        }}
        className="py-16 px-4"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <motion.h2
              variants={{
                hidden: { y: -20, opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Our Story
            </motion.h2>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { delay: 0.3 } },
              }}
              className="w-20 h-1 bg-amber-500 mx-auto mb-8"
            ></motion.div>
            <motion.p
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { delay: 0.4 } },
              }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Founded in 2020 by Kausar Ahmad Tasin, DreamJobs began as a
              mission to simplify job searching in Bangladesh. What started as a
              small platform has grown into the country's most trusted career
              destination, serving both job seekers and employers with
              cutting-edge matching technology.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={{
                hidden: { x: -50, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { delay: 0.5 } },
              }}
            >
              <img
                src="/images/team.png"
                alt="DreamJobs team working"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { x: 50, opacity: 0 },
                visible: { x: 0, opacity: 1, transition: { delay: 0.6 } },
              }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Our Growth Journey
              </h3>
              <p className="text-gray-600 mb-6">
                From our first 100 users to serving millions nationwide, we've
                remained committed to our core values: transparency, efficiency,
                and putting people first in the hiring process.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaRocket className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-medium">2020:</span> Launched with 10
                    partner companies
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaUsers className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-medium">2022:</span> Reached 100,000
                    active users
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaBullseye className="h-5 w-5 text-amber-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-medium">2023:</span> Expanded to
                    international markets
                  </p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Values */}
      <motion.section
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission & Values
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Human Connection</h3>
              <p className="text-gray-600">
                We believe technology should enhance, not replace, human
                relationships in the hiring process.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBullseye className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-gray-600">
                Clear expectations and open communication between employers and
                candidates.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-lg shadow-md text-center"
            >
              <div className="bg-black/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="h-8 w-8 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform to deliver the best matching
                technology.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to transforming the job search
              experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-red-800 to-red-800 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join the DreamJobs Community
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're looking for your dream job or seeking top talent,
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg">
              Post a Job
            </button>
            <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg">
              Browse Jobs
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
