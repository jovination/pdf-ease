"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  avatar?: string
  color: string
  lastActive: Date
}

interface Comment {
  id: string
  userId: string
  pageNumber: number
  x: number
  y: number
  text: string
  timestamp: Date
  replies?: Comment[]
}

interface CollaborationContextType {
  activeUsers: User[]
  comments: Comment[]
  currentUser: User | null
  addComment: (comment: Omit<Comment, "id" | "timestamp">) => void
  removeComment: (id: string) => void
  replyToComment: (commentId: string, reply: Omit<Comment, "id" | "timestamp">) => void
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined)

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const [activeUsers, setActiveUsers] = useState<User[]>([
    {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
      color: "#4f46e5",
      lastActive: new Date(),
    },
    {
      id: "user-2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40&text=JS",
      color: "#10b981",
      lastActive: new Date(),
    },
    {
      id: "user-3",
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=BJ",
      color: "#f59e0b",
      lastActive: new Date(),
    },
  ])

  const [comments, setComments] = useState<Comment[]>([])

  const [currentUser] = useState<User>({
    id: "current-user",
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40&text=You",
    color: "#7c3aed",
    lastActive: new Date(),
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) =>
        prev.map((user) => ({
          ...user,
          lastActive: new Date(),
        })),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const addComment = (comment: Omit<Comment, "id" | "timestamp">) => {
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}`,
      timestamp: new Date(),
    }
    setComments((prev) => [...prev, newComment])
  }

  const removeComment = (id: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== id))
  }

  const replyToComment = (commentId: string, reply: Omit<Comment, "id" | "timestamp">) => {
    const newReply: Comment = {
      ...reply,
      id: `reply-${Date.now()}`,
      timestamp: new Date(),
    }

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          }
        }
        return comment
      }),
    )
  }

  return (
    <CollaborationContext.Provider
      value={{
        activeUsers,
        comments,
        currentUser,
        addComment,
        removeComment,
        replyToComment,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  )
}

export function useCollaborationContext() {
  const context = useContext(CollaborationContext)
  if (context === undefined) {
    throw new Error("useCollaborationContext must be used within a CollaborationProvider")
  }
  return context
}
