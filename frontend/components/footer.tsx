'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Footer() {
  return (
    <footer className="bg-[#3E2723] text-white py-16 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="relative w-32 h-16">
              <Image 
                src="/trung-nguyen-logo.png" 
                alt="Trung Nguyen Legend" 
                fill 
                className="object-contain brightness-0 invert" 
              />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Trung Nguyen Legend - The leading coffee brand in Vietnam. We are on a mission to bring energy coffee to the world, inspiring creativity and awakening the soul.
            </p>
            <div className="flex gap-4">
              <Link href="https://www.facebook.com/trungnguyenlegendcafe" className="p-2 bg-[#3E2723] hover:bg-[#C5A059] transition-colors rounded-none">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-[#3E2723] hover:bg-[#C5A059] transition-colors rounded-none">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-[#3E2723] hover:bg-[#C5A059] transition-colors rounded-none">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-[#C5A059] font-bold uppercase tracking-widest text-sm mb-6">Contact Us</h3>
            <div className="space-y-4 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C5A059] shrink-0" />
                <span>87A Cach Mang Thang 8, Ben Thanh Ward, District 1, Ho Chi Minh City, Vietnam.</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#C5A059]" />
                <span>trungnguyenlegendmaps@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#C5A059]" />
                <span>1900 969668</span>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-[#C5A059] font-bold uppercase tracking-widest text-sm mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Order Tracking</Link></li>
              <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Return & Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-[#C5A059] transition-colors">Franchising Opportunities</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[#C5A059] font-bold uppercase tracking-widest text-sm mb-6">Get Inspiration</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to receive the latest news about coffee culture and special offers.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-zinc-900 border-zinc-800 text-white rounded-none focus:border-[#C5A059]"
              />
              <Button className="w-full rounded-none bg-[#C5A059] hover:bg-[#a6864a] text-black font-bold uppercase tracking-widest text-xs py-6">
                SUBSCRIBE
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">
            Copyright © 2026 Trung Nguyen Legend Café. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-xs text-zinc-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer