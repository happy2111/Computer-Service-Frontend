import {
  Award,
  CheckCircle,
  Clock,
  Shield,
  Star,
  PenToolIcon as Tool,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUsSection() {
  return (
    <div id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-20">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 mb-4">
              About ServiceHY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Trusted Partner for{" "}
              <span className="text-blue-600">Quality Repairs</span>
            </h2>
            <p className="text-lg text-gray-600">
              With over 10 years of experience, we've built our reputation on
              expert service, quality parts, and customer satisfaction. Learn
              more about our journey and the team behind ServiceHY.
            </p>
          </div>

          {/* Our Story */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Story
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Founded in 2013, RepairPro began as a small smartphone
                    repair shop with a simple mission: to provide high-quality
                    repairs at fair prices with exceptional customer service.
                  </p>
                  <p>
                    What started as a one-person operation has grown into a team
                    of certified technicians specializing in repairs for all
                    types of digital devices—from smartphones and tablets to
                    laptops and desktop computers.
                  </p>
                  <p>
                    Over the years, we've expanded our services to include
                    software troubleshooting, data recovery, and preventative
                    maintenance, becoming a one-stop solution for all your
                    technology repair needs.
                  </p>
                  <p>
                    Today, RepairPro is proud to serve thousands of satisfied
                    customers, with multiple locations across the region and a
                    reputation for excellence in the repair industry.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src="https://www.pcgeeksusa.com/wp-content/uploads/2024/03/Computer-Repair.jpeg"
                    alt="ServiceHY store interior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-gray-900">10+ Years</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    of trusted service
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Our Mission & Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <ValueCard
                icon={<Star className="h-6 w-6 text-blue-600" />}
                title="Excellence"
                description="We strive for excellence in every repair, using only the highest quality parts and following industry best practices."
              />
              <ValueCard
                icon={<Shield className="h-6 w-6 text-blue-600" />}
                title="Integrity"
                description="We operate with complete transparency, providing honest assessments and fair pricing for all our services."
              />
              <ValueCard
                icon={<Tool className="h-6 w-6 text-blue-600" />}
                title="Expertise"
                description="Our technicians are certified professionals who regularly update their skills to stay current with the latest technologies."
              />
              <ValueCard
                icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
                title="Reliability"
                description="We stand behind our work with industry-leading warranties and guarantee your satisfaction with every repair."
              />
              <ValueCard
                icon={<Users className="h-6 w-6 text-blue-600" />}
                title="Customer Focus"
                description="We put our customers first, providing clear communication, convenient service options, and responsive support."
              />
              <ValueCard
                icon={<Award className="h-6 w-6 text-blue-600" />}
                title="Innovation"
                description="We continuously improve our processes and services to deliver the best possible repair experience."
              />
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Meet Our Expert Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <TeamMember
                image="https://i.natgeofe.com/k/5e4ea67e-2219-4de4-9240-2992faef0cb6/trump-portrait.jpg"
                name="Donald Trump"
                position="Founder & Lead Technician"
                description="With over 15 years of experience in electronics repair, Alex founded RepairPro with a vision to provide expert repair services with a customer-first approach."
              />
              <TeamMember
                image="https://upload.wikimedia.org/wikipedia/commons/5/5e/Shavkat_Mirziyoyev.jpg"
                name="Shavkat Mirziyoyev"
                position="Senior Phone Repair Specialist"
                description="Sarah specializes in smartphone repairs and has fixed over 5,000 devices in her career. She's known for her precision work and attention to detail."
              />
              <TeamMember
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5eV1vHS5fERvuyJt1oIDGZ6Yb-m3oSA3LgEauSMXDIBQcQeP8d_gfEYzyqEL6LjaK958&usqp=CAU"
                name="Kim Jong-un"
                position="Computer Systems Expert"
                description="Michael brings 10 years of IT experience to our team, specializing in laptop and desktop repairs, data recovery, and system optimization."
              />
              <TeamMember
                image="https://hips.hearstapps.com/hmg-prod/images/queen-elizabeth-ii-watches-from-the-balcony-of-buckingham-news-photo-1662662018.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*"
                name="Queen Elizabeth II's"
                position="Customer Service Manager"
                description="Priya ensures every customer receives exceptional service from the moment they contact us until their repaired device is back in their hands."
              />
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Why Choose ServiceHY
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ReasonCard
                number="01"
                title="Certified Technicians"
                description="Our repair specialists are certified professionals with years of experience and ongoing training."
              />
              <ReasonCard
                number="02"
                title="Quality Parts"
                description="We use only high-quality, manufacturer-grade components for all our repairs."
              />
              <ReasonCard
                number="03"
                title="90-Day Warranty"
                description="All repairs come with our industry-leading 90-day warranty on both parts and labor."
              />
              <ReasonCard
                number="04"
                title="Fast Turnaround"
                description="Most repairs are completed the same day, often while you wait."
              />
              <ReasonCard
                number="05"
                title="Transparent Pricing"
                description="No hidden fees or surprises. We provide upfront quotes before beginning any work."
              />
              <ReasonCard
                number="06"
                title="Satisfaction Guarantee"
                description="If you're not completely satisfied with our service, we'll make it right."
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Our Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <AchievementStat number="10+" label="Years in Business" />
              <AchievementStat number="50,000+" label="Devices Repaired" />
              <AchievementStat number="98%" label="Customer Satisfaction" />
              <AchievementStat number="5" label="Service Locations" />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Your Device Fixed?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the RepairPro difference today. Contact us for a free
              diagnostic or bring your device to one of our locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-md border border-blue-600 bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function ValueCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="mb-4">{icon}</div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function TeamMember({ image, name, position, description }) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
      />
      <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
      <p className="text-blue-600 text-sm">{position}</p>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </div>
  );
}

function ReasonCard({ number, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <span className="text-blue-600 font-bold text-xl mb-2 block">
        {number}
      </span>
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function AchievementStat({ number, label }) {
  return (
    <div>
      <div className="text-3xl font-bold text-blue-600">{number}</div>
      <div className="text-sm text-gray-700">{label}</div>
    </div>
  );
}
