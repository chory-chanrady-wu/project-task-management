import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import Link from "next/link"
import { useDeleteTask } from "@/hooks/use-queries"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface childProps {
  id: string
}

export function ActionBtnRedirect(
  { id }: childProps
) {
  const deleteTaskMutation = useDeleteTask()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      setIsDeleting(true)
      try {
        await deleteTaskMutation.mutateAsync(id)
        alert("Task deleted successfully!")
        router.push("/tasks")
      } catch (error) {
        console.error("Failed to delete task:", error)
        alert("Failed to delete task. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer shadow-none outline-0 ring-0" aria-label="Open menu">
          <MoreHorizontalIcon size={18} />
        </button>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>About task</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href={`/tasks/${id}`}>
            <DropdownMenuItem>
              View
              <DropdownMenuShortcut>⇧⌘V</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 focus:text-red-600"
        >
          {isDeleting ? "Deleting..." : "Delete"}
          <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
