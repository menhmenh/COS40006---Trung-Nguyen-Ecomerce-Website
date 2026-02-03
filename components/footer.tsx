import Link from 'next/link'
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function Footer() {
  return (
    <footer className="bg-muted py-16 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-3xl font-bold mb-4">Alowishus</div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We made it our mission to create community everyday and grow meaningful, lasting relationships with our staff, our suppliers and of course you, our customers.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Alowishus!</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>alowishus@gmai.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+110 214 214 2451</span>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Store Locations */}
          <div>
            <h3 className="text-xl font-bold mb-4">Store Locations</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Find your nearest Alowishus store with opening hours, location and contact details.
            </p>
            <Button variant="link" className="p-0 h-auto font-medium">
              FIND MY ALOWISHUS
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">{"First One's On Us!"}</h3>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="E-mail"
                className="bg-background"
              />
              <Button className="w-full rounded-full">SUBSCRIBE</Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Copyright © 2022 Alowishus Delicious
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Use
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer
