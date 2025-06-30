import {
  MapPinIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  SparklesIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Smart roster management.",
    description:
      "This will help you roster faster by using drag & drop calendar.",
    icon: CalendarDaysIcon,
  },
  {
    name: "Daily QR code.",
    description:
      "Employee can clock in and clock off simply by scanning the daily generated QR code.",
    icon: QrCodeIcon,
  },
  {
    name: "Geographical base.",
    description: "Verify requests' location for clock in and clock off.",
    icon: MapPinIcon,
  },
  {
    name: "AI-powered roster.",
    description:
      "Learn from the previous rosters and suggest future efficient rosters using AI (coming soon).",
    icon: SparklesIcon,
  },
  {
    name: "Email notification.",
    description:
      "Send email to employees with all new released and updated rosters (coming soon).",
    icon: EnvelopeIcon,
  },
  {
    name: "Anti-cheating.",
    description:
      "Enhanced anti-cheating feature to avoid mis-uses (coming soon).",
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  return (
    <div id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Switch to Schedoule now
          </h2>
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-balance sm:text-5xl">
            All features that you need here.
          </p>
          {/* <p className="mt-6 text-lg/8 text-gray-600">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
              impedit perferendis suscipit eaque, iste dolor cupiditate
              blanditiis.
            </p> */}
        </div>
      </div>
      {/* <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <img
              alt="App screenshot"
              src="https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png"
              width={2432}
              height={1442}
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
            </div>
          </div>
        </div> */}
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon
                  aria-hidden="true"
                  className="absolute left-1 top-1 size-5 text-indigo-600"
                />
                {feature.name}
              </dt>{" "}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
