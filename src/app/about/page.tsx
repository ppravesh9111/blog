import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About the Author',
  description: 'Learn more about Purnendu Sharma - the person behind the blog.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        About the Author
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Photo in phone frame */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="relative w-48 md:w-52">
            {/* Phone shell */}
            <div className="rounded-[2rem] border-[6px] border-gray-900 dark:border-gray-200 bg-gray-900 dark:bg-gray-200 shadow-xl p-1">
              {/* Notch */}
              <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 dark:bg-gray-200 rounded-b-xl z-10" />
              {/* Screen */}
              <div className="rounded-[1.4rem] overflow-hidden bg-black aspect-[9/16]">
                <Image
                  src="/author.jpg"
                  alt="Purnendu Sharma"
                  width={208}
                  height={370}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1">
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            <p>
              Hi Everyone! I am Pravesh/Purnendu (both are one). I have done my
              Bachelors from IIT Roorkee back in 2020 and have worked with multiple
              SaaS companies before. My main interest includes reading books, playing
              sports, working out and discuss startup ideas. I live in Bangalore
              currently. In these blogs and tweets you will see some random stuff
              from my end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
