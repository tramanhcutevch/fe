"use client"
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

// Create a custom hook that uses the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
}
