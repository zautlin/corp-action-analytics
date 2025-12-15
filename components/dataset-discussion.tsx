"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Trash2, Flag, ThumbsUp } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getCurrentUser } from "@/lib/auth"

interface Comment {
  id: string
  author: string
  role: string
  content: string
  timestamp: string
  likes: number
  isAdmin?: boolean
}

export function DatasetDiscussion() {
  const currentUser = getCurrentUser()

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Michael Rodriguez",
      role: "Quantitative Analyst",
      content:
        "This dataset has been incredibly valuable for our high-frequency trading strategies. The latency is consistently under 50ms which is critical for our use case. Has anyone experienced any data gaps during market open?",
      timestamp: "2 hours ago",
      likes: 5,
    },
    {
      id: "2",
      author: "Emily Watson",
      role: "Data Engineer",
      content:
        "We've integrated this into our ClickHouse cluster and the performance is excellent. One tip: make sure to partition by date and ticker for optimal query performance. Our queries went from 2s to 200ms after proper partitioning.",
      timestamp: "5 hours ago",
      likes: 12,
      isAdmin: true,
    },
    {
      id: "3",
      author: "James Liu",
      role: "Risk Manager",
      content:
        "Quick question - does this dataset include pre-market and after-hours trading data? Our risk models need extended hours coverage for accurate VaR calculations.",
      timestamp: "1 day ago",
      likes: 3,
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

  const handlePostComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: currentUser.name,
        role: currentUser.role,
        content: newComment,
        timestamp: "Just now",
        likes: 0,
        isAdmin: currentUser.isAdmin,
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  const handleDeleteComment = (id: string) => {
    setCommentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (commentToDelete) {
      setComments(comments.filter((c) => c.id !== commentToDelete))
      setCommentToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleLike = (id: string) => {
    setComments(comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussion
          </CardTitle>
          <CardDescription>
            Share insights, ask questions, and collaborate with other users about this dataset
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts, questions, or insights about this dataset..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={handlePostComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">{comments.length} Comments</h3>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {comment.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{comment.author}</p>
                          {comment.isAdmin && (
                            <Badge variant="secondary" className="text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{comment.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                      {currentUser.isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>

                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleLike(comment.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-xs">{comment.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                      <Flag className="h-4 w-4" />
                      <span className="text-xs">Report</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
