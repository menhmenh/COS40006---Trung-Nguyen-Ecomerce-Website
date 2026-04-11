'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const timelineData = [
  {
    year: "2023",
    content: "Opening Representative Office in Korea • Building Buon Ma Thuot into the 'Global Coffee City' • Launching 'La Forêt en ville' hotel complex and 'The World Coffee Center' • Celebrating 20 years of G7 conquering the globe.",
    image: "/images/2023-event.png", 
    align: "left"
  },
  {
    year: "2022",
    content: "Launching Trung Nguyen Legend Coffee World in Vietnam and China • Announcing the 'Awakening Lifestyle' journey • Forbes honors Trung Nguyen Legend as an 'Awakening Brand' • Premiering the world's first coffee dance drama.",
    image: "/images/2022-event.png",
    align: "right"
  },
  {
    year: "2021",
    content: "Celebrating 25th Anniversary (1996 – 2021) • Inaugurating Tesla and Cantata model houses and utility complexes in the Coffee City urban area.",
    image: "/images/2021-event.png",
    align: "left"
  },
  {
    year: "2020",
    content: "Launching the art performance show of 3 Coffee Civilizations: Ottoman – Roman – Zen combined with 3D Mapping technology.",
    image: "/images/2020-event.png",
    align: "right"
  },
  {
    year: "2019",
    content: "Embark on the Journey from the Heart, the Journey of Great Ambition – Entrepreneurship for Nation Building, to the most remote mountainous and island regions of our country.",
    image: "/images/2019-event.png",
    align: "right"
  },
    {
    year: "2018",
    content: "Inauguration of the World Coffee Museum in Buon Ma Thuot • Launch of the Trung Nguyen Legend brand and its new, distinctive, special, and unique product line – the new generation of Trung Nguyen Legend coffee.",
    image: "/images/2018-event.png",
    align: "right"
  },
    {
    year: "2017",
    content: "Trung Nguyên Legend officially opens its representative office in Shanghai (China), one of the world's leading commercial and financial centers. • Launches the E-Coffee Model: Specialized Coffee System – Energy Coffee – Life-Changing Coffee.",
    image: "/images/2017-event.png",
    align: "right"
  },
    {
    year: "2016",
    content: "Celebrating 20 years of the Journey of Service, announcing a new Name, Vision, and Mission • Launching Trung Nguyen Legend Café – The Energy Coffee That Changes Life, becoming the largest coffee chain in Southeast Asia • Donating 2 million life-changing books in the Journey of Great Ambition – Entrepreneurship for National Development to Vietnamese youth",
    image: "/images/2016-event.png",
    align: "right"
  },
    {
    year: "2013",
    content: "G7 celebrates its 10th anniversary, marking 3 years of market share leadership and popularity. The Journey to Great Ambition – Nation-Building Entrepreneurship initiative spreads widely with the Future Innovation Competition and the 2nd Vietnam Aspiration Innovation Day, attracting 100,000 participants.",
    image: "/images/2013-event.png",
    align: "right"
  },
    {
    year: "2012",
    content: "The most beloved coffee brand among Vietnamese consumers. Trung Nguyen Coffee is the number one brand in Vietnam with the largest number of coffee consumers. 11 million out of 17 million Vietnamese households purchase Trung Nguyen coffee products. • Launched the Journey to Great Ambition – Entrepreneurship for National Development campaign with the Creative Festival for Vietnamese Aspirations attracting over 50,000 participants.",
    image: "/images/2012-event.png",
    align: "right"
  },
    {
    year: "2010",
    content: "Trung Nguyen coffee products are exported to more than 60 countries and territories worldwide, including the US, Canada, Russia, the UK, Germany, Japan, China, and ASEAN countries.",
    image: "/images/2010-event.png",
    align: "right"
  },
    {
    year: "2003",
    content: "The G7 instant coffee product was launched at the G7 Instant Coffee Festival held at the Reunification Palace on November 23, 2003, which attracted thousands of participants and made its mark with a blind taste test and direct voting for the most preferred instant coffee product between G7 and a major global coffee brand. The results showed that 89% of respondents chose G7 as their favorite.",
    image: "/images/2003-event.png",
    align: "right"
  },
    {
    year: "2001",
    content: "Successful franchising in Japan and Singapore • Announcing the slogan: Unleashing Creativity, with products crafted from the finest coffee beans, modern technology, unique and unreplicable Eastern secrets, combined with unparalleled passion, Trung Nguyen has conquered consumers nationwide.",
    image: "/images/2001-event.png",
    align: "right"
  },
    {
    year: "1998",
    content: "The establishment of the first Trung Nguyen coffee shop in Ho Chi Minh City marked the beginning of the Trung Nguyen chain of coffee shops across Vietnam and in countries around the world.",
    image: "/images/1998-event.png",
    align: "right"
  },
    {
    year: "1996",
    content: "On June 16, 1996, Chairman Dang Le Nguyen Vu founded Trung Nguyen in Buon Ma Thuot – the coffee capital of Vietnam – with initial capital consisting of a rickety bicycle, fueled by the unwavering belief and determination of youth, and the aspiration to build a renowned coffee brand and spread the flavor of Vietnamese coffee throughout the world.",
    image: "/images/1996-event.png",
    align: "right"
  }
]

export default function AboutPage() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('[data-animate]');
            children.forEach((child) => {
              child.classList.add('opacity-100', 'translate-y-0');
              child.classList.remove('opacity-0', 'translate-y-20');
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main className="bg-[#ffffff] min-h-screen">
        {/* Header Section */}
        <section className="py-20 bg-[#3E2723] text-center">
        <h1 className="text-[#C5A059] text-5xl md:text-6xl font-bold uppercase tracking-widest mb-4">
          Development History
        </h1>
        <div className="w-24 h-1 bg-[#C5A059] mx-auto mb-8"></div>
        
        <div className="flex justify-center uppercase text-xs font-bold tracking-widest">
          <span className="text-[#C5A059] border-b border-[#C5A059] pb-1">Development History</span>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 relative">
        
        <div className="space-y-0 relative z-10">
          {timelineData.map((item, index) => (
            <div 
              key={index} 
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`relative flex flex-col md:flex-row items-center ${
                index % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              
              {/* ĐƯỜNG TIMELINE TỪNG ĐOẠN */}
              <div 
                data-animate
                className={`absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block w-40 pointer-events-none overflow-hidden transition-all duration-700 ease-out opacity-0 translate-y-20 ${index % 2 !== 0 ? 'scale-x-[-1]' : ''}`}
                style={{ transitionDelay: `${0}ms` }}
              >
                <div className="w-full h-full relative">
                  <Image 
                    src="/images/timeline.png" 
                    alt="Timeline Segment"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Nội dung chữ */}
              <div 
                data-animate
                className={`w-full md:w-5/12 space-y-2 px-4 md:px-12 py-4 transition-all duration-700 ease-out opacity-0 translate-y-20 ${index % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}
                style={{ transitionDelay: `${100}ms` }}
              >
                <h2 className="text-5xl md:text-8xl font-light italic text-[#3E2723]/10 font-serif">
                  {item.year}
                </h2>
                <p className="text-[#5D4037] leading-relaxed text-lg font-medium">
                  {item.content}
                </p>
              </div>

              {/* Khoảng trống ở giữa */}
              <div className="hidden md:block md:w-2/12"></div>

              {/* Hình ảnh */}
              <div 
                data-animate
                className="w-full md:w-5/12 px-4 md:px-12 py-4 transition-all duration-700 ease-out opacity-0 translate-y-20"
                style={{ transitionDelay: `${500}ms` }}
              >
                <div className="relative h-75 md:h-87.5 w-full grayscale hover:grayscale-0 transition-all duration-700">
                  <Image 
                    src={item.image} 
                    alt={item.year}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

        <Footer />
      </main>
    </>
  )
}