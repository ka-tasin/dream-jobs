"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EmailSubscription = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mb-20 mt-10">
      <div className="bg-slate-800 max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12 rounded-lg shadow-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Get the <span className="text-amber-400">Best Jobs</span> Delivered to Your Inbox
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-8">
            Subscribe to receive curated job listings, career tips, and hiring trends.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="py-6 px-4 rounded-md border-0 focus:ring-2 focus:ring-amber-450 bg-white text-slate-800"
            />
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-6 px-6 rounded-md transition-colors"
            >
              Subscribe
            </Button>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EmailSubscription;
