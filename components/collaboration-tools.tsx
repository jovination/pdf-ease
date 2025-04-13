"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCollaborationContext } from "@/context/collaboration-context"
import { usePdfContext } from "@/context/pdf-context"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Send, User, Users } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CollaborationTools() {
  const { currentPage } = usePdfContext()
  const { activeUsers, comments, currentUser, addComment, replyToComment } = useCollaborationContext()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("comments")
  const [commentText, setCommentText] = useState("")
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [showReplyFor, setShowReplyFor] = useState<string | null>(null)

  const currentPageComments = comments.filter((comment) => comment.pageNumber === currentPage)

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter some text for your comment",
        variant: "destructive",
      })
      return
    }

    if (!currentUser) {
      toast({
        title: "Not Signed In",
        description: "You need to be signed in to add comments",
        variant: "destructive",
      })
      return
    }

    addComment({
      userId: currentUser.id,
      pageNumber: currentPage,
      x: 200,
      y: 200,
      text: commentText,
    })

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the document",
    })
    setCommentText("")
  }

  const handleReply = (commentId: string) => {
    const reply = replyText[commentId]
    if (!reply?.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please enter some text for your reply",
        variant: "destructive",
      })
      return
    }

    if (!currentUser) {
      toast({
        title: "Not Signed In",
        description: "You need to be signed in to reply to comments",
        variant: "destructive",
      })
      return
    }

    replyToComment(commentId, {
      userId: currentUser.id,
      pageNumber: currentPage,
      x: 0,
      y: 0,
      text: reply,
    })

    toast({
      title: "Reply Added",
      description: "Your reply has been added to the comment",
    })

    // Clear the reply text and hide the reply form
    setReplyText((prev) => ({ ...prev, [commentId]: "" }))
    setShowReplyFor(null)
  }

  const toggleReplyForm = (commentId: string) => {
    setShowReplyFor(showReplyFor === commentId ? null : commentId)
  }

  const handleReplyTextChange = (commentId: string, text: string) => {
    setReplyText((prev) => ({ ...prev, [commentId]: text }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Collaboration Tools</CardTitle>
        <CardDescription>Collaborate with others using Firebase Realtime Database</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="users">Active Users</TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Comments on Page {currentPage}</h3>
                <Badge variant="outline" className="text-xs">
                  {currentPageComments.length}
                </Badge>
              </div>

              <ScrollArea className="h-[200px] rounded-md border">
                {currentPageComments.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-4">
                    <p className="text-center text-sm text-muted-foreground">
                      No comments on this page. Add a comment below.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 space-y-3">
                    {currentPageComments.map((comment) => {
                      const author = activeUsers.find((user) => user.id === comment.userId) || {
                        name: "Unknown User",
                        color: "#888888",
                      }

                      return (
                        <div key={comment.id} className="rounded-md border p-3">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                              <AvatarFallback style={{ backgroundColor: author.color }}>
                                {author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{author.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                              <p className="text-sm">{comment.text}</p>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => toggleReplyForm(comment.id)}
                              >
                                Reply
                              </Button>

                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-4 mt-2 space-y-2 border-l-2 pl-3">
                                  {comment.replies.map((reply) => {
                                    const replyAuthor = activeUsers.find((user) => user.id === reply.userId) || {
                                      name: "Unknown User",
                                      color: "#888888",
                                    }

                                    return (
                                      <div key={reply.id} className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="h-6 w-6">
                                            <AvatarImage
                                              src={replyAuthor.avatar || "/placeholder.svg"}
                                              alt={replyAuthor.name}
                                            />
                                            <AvatarFallback style={{ backgroundColor: replyAuthor.color }}>
                                              {replyAuthor.name.charAt(0)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <p className="text-xs font-medium">{replyAuthor.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {new Date(reply.timestamp).toLocaleTimeString()}
                                          </p>
                                        </div>
                                        <p className="text-xs">{reply.text}</p>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}

                              {/* Reply form */}
                              {showReplyFor === comment.id && (
                                <div className="mt-2 flex items-center gap-2">
                                  <Input
                                    placeholder="Write a reply..."
                                    className="h-8 text-xs"
                                    value={replyText[comment.id] || ""}
                                    onChange={(e) => handleReplyTextChange(comment.id, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        handleReply(comment.id)
                                      }
                                    }}
                                  />
                                  <Button size="sm" className="h-8 px-2" onClick={() => handleReply(comment.id)}>
                                    <Send className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment-text">Add Comment</Label>
              <Textarea
                id="comment-text"
                placeholder="Type your comment here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[80px]"
              />
              <Button onClick={handleAddComment} className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Active Users</h3>
                <Badge variant="outline" className="text-xs">
                  {activeUsers.length}
                </Badge>
              </div>

              <div className="rounded-md border">
                {activeUsers.length === 0 ? (
                  <div className="flex h-[100px] items-center justify-center p-4">
                    <p className="text-center text-sm text-muted-foreground">No active users at the moment.</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {activeUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback style={{ backgroundColor: user.color }}>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">Active {formatTimeSince(user.lastActive)}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        >
                          Online
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-md border bg-muted/20 p-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Real-time Collaboration</p>
                  <p className="text-xs text-muted-foreground">Powered by Firebase Realtime Database free tier</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Invite Collaborators
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Using Firebase Realtime Database free tier (100 simultaneous connections)
      </CardFooter>
    </Card>
  )
}

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}

function formatTimeSince(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) {
    return "just now"
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  }

  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  }

  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? "s" : ""} ago`
}
