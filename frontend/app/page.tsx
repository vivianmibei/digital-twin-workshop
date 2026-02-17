"use client"

import { useState } from "react"
import ChatInterface from "@/components/ChatInterface"
import ProfileViewer from "@/components/ProfileViewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Vivian&apos;s Digital Twin</h1>
          <p className="text-slate-400">
            AI-powered assistant that answers questions about professional background and expertise
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="w-full">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="profile" className="w-full">
            <ProfileViewer />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
