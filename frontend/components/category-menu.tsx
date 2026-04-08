'use client'

import * as React from "react"
import {
  Menu,
  Gift,
  Package,
  Wine,
  Settings,
  BookOpen,
  UtensilsCrossed,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

export function CategoryMenu() {
  return (
    // 🔥 Quan trọng: modal={false} để submenu hoạt động
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-black text-white hover:bg-zinc-800 rounded-full border-none flex items-center gap-3 px-3 py-3 h-auto transition-smooth hover:shadow-lg"
        >
          <Menu className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span className=" uppercase tracking-wider text-sm">
            Product Categories
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-72 rounded-none p-0 border-zinc-200 z-50 animate-fade-in-up"
      >
        <DropdownMenuItem className="py-3 px-4 border-b cursor-pointer transition-smooth hover:bg-zinc-50">
          <Gift className="mr-3 h-4 w-4 text-zinc-500" />
          <span>Premium Gifts</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="py-3 px-4 border-b cursor-pointer transition-smooth hover:bg-zinc-50">
          <Wine className="mr-3 h-4 w-4 text-zinc-500" />
          <span>Success Bottled Coffee</span>
        </DropdownMenuItem>

        {/* Sub menu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="py-3 px-4 border-b cursor-pointer text-[#c5a059] font-medium transition-smooth hover:bg-zinc-50">
            <Package className="mr-3 h-4 w-4" />
            <span>Packaged Coffee</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="rounded-none w-56 bg-white z-50 animate-fade-in-left">
            <DropdownMenuItem className="cursor-pointer hover:text-[#c5a059] transition-smooth">
              Instant Coffee
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:text-[#c5a059] transition-smooth">
              Ground Coffee
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:text-[#c5a059] transition-smooth">
              Roasted Beans
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem className="py-3 px-4 border-b cursor-pointer transition-smooth hover:bg-zinc-50">
          <Settings className="mr-3 h-4 w-4 text-zinc-500" />
          <span>Coffee Tools</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="py-3 px-4 border-b cursor-pointer">
          <UtensilsCrossed className="mr-3 h-4 w-4 text-zinc-500" />
          <span>Accessories</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="py-3 px-4 cursor-pointer">
          <BookOpen className="mr-3 h-4 w-4 text-zinc-500" />
          <span>Life-changing Books</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
