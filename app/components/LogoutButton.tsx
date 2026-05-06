'use client'

import { supabase } from '@/lib/supabase'

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-zinc-500 hover:text-white transition"
    >
      sair
    </button>
  )
}