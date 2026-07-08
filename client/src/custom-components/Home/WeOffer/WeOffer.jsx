"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const offers = [
  {
    title: "Premium Job Listings",
    description: "Access to exclusive high-paying jobs from top companies",
    icon: "💼",
  },
  {
    title: "Career Guidance",
    description: "Personalized career coaching and resume reviews",
    icon: "🧭",
  },
  {
    title: "Skill Assessments",
    description: "Validate your skills with industry-recognized tests",
    icon: "📊",
  },
  {
    title: "Interview Prep",
    description: "Mock interviews with real-time feedback",
    icon: "🎤",
  },
  {
    title: "Salary Insights",
    description: "See how your compensation compares to the market",
    icon: "💰",
  },
  {
    title: "Fast Applications",
    description: "One-click apply to multiple jobs",
    icon: "⚡",
  },
];

export function WhatWeOffer() {
  return (
    <section className="container mx-auto py-20 px-4 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-gray-900 mb-4">
          What We Offer
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Everything you need to land your dream job in one place
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="transform hover:-translate-y-1 hover:scale-102 transition duration-200"
          >
            <Card className="h-full p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-xs hover:shadow-md transition-all">
              <CardHeader className="items-center text-center p-0">
                <div className="text-4xl mb-4">{offer.icon}</div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {offer.title}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  {offer.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
