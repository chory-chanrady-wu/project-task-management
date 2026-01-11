"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DueDate } from "./DueDate";
import React, { useState } from "react";
import { Selector } from "./Selector";
import { ToggleSwitch } from "./ToggleSwitch";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Paperclip } from "lucide-react";
import Link from "next/link";
import { useProjects, useCreateTask } from "@/hooks/use-queries";
import { useRouter } from "next/navigation";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  projectId: z.string().min(1, "Please select a project"),
  tags: z.array(z.string()).optional(),
  assignee: z.string().min(1, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

const presetOptions = {
  status: [
    { value: "done", label: "Done", color: "bg-green-600" },
    { value: "todo", label: "Todo", color: "bg-blue-600" },
    { value: "in-progress", label: "In Progress", color: "bg-yellow-600" },
  ],
  priority: [
    { value: "high", label: "High", color: "bg-green-600" },
    { value: "medium", label: "Medium", color: "bg-yellow-600" },
    { value: "low", label: "Low", color: "bg-red-600" },
  ],
  subtask: [
    { value: "done", label: "Complete", color: "bg-sky-500" },
    { value: "incomplete", label: "Inomplete", color: "bg-red-500" },
  ],
  "income-expense": [
    { value: "income", label: "Income", color: "bg-green-600" },
    { value: "expense", label: "Expense", color: "bg-red-600" },
  ],
} as const; // Add `as const` for literal types

const data = [
  {
    title: "Design",
    value: "design",
  },
  {
    title: "Accessibility",
    value: "accessibility",
  },
  {
    title: "Documentation",
    value: "documentation",
  },
  {
    title: "Research",
    value: "research",
  },
  {
    title: "UX",
    value: "ux",
  },
  { title: "Other", value: "other" },
];
const assigneesData = [
  {
    title: "Phorn Rothana",
    value: "phorn-rothana",
  },
  {
    title: "So Bunleng",
    value: "so-bunleng",
  },
  {
    title: "Chory Chanrady",
    value: "chory-chanrady",
  },
  {
    title: "Yoeurn Kimsan",
    value: "yoeurn-kimsan",
  },
];
export function CreateNewTask() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const createTaskMutation = useCreateTask();
  const router = useRouter();
  const projectsData =
    projects?.map((project) => ({
      title: project.name,
      value: project.id,
    })) || [];
  const [toggleActive, setToggleActive] = useState<
    "done" | "todo" | "in-progress"
  >("in-progress");
  const [togglePriority, setTogglePriority] = useState<
    "high" | "medium" | "low"
  >("medium");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    tags: [] as string[],
    assignee: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TaskFormData, string>>
  >({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted with data:", formData);
    console.log("Toggle states:", { toggleActive, togglePriority });

    // Validate form data with Zod
    const result = taskSchema.safeParse(formData);

    if (!result.success) {
      // Set validation errors
      const fieldErrors: Partial<Record<keyof TaskFormData, string>> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof TaskFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});

    const taskData = {
      title: result.data.title,
      description: result.data.description,
      projectId: result.data.projectId,
      status: toggleActive,
      priority: togglePriority,
      dueDate: result.data.dueDate || "",
      tags: result.data.tags || [],
      assignee: result.data.assignee || "",
    };

    console.log("Sending task data:", taskData);

    createTaskMutation.mutate(taskData);
  };

  // Handle mutation success/error
  React.useEffect(() => {
    console.log("Mutation state:", {
      isSuccess: createTaskMutation.isSuccess,
      isError: createTaskMutation.isError,
      error: createTaskMutation.error,
      data: createTaskMutation.data,
    });

    if (createTaskMutation.isSuccess) {
      alert("Task created successfully!");
      router.push("/tasks");
    }
    if (createTaskMutation.isError) {
      console.error("Failed to create task:", createTaskMutation.error);
      alert("Failed to create task. Please try again.");
    }
  }, [
    createTaskMutation.isSuccess,
    createTaskMutation.isError,
    createTaskMutation.error,
    createTaskMutation.data,
    router,
  ]);

  return (
    <Card className="w-full border-none  h-full bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-xl">New Task</CardTitle>
        <CardDescription>Add New daily Task.</CardDescription>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        <div className="px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                    if (errors.description) {
                      setErrors((prev) => ({
                        ...prev,
                        description: undefined,
                      }));
                    }
                  }}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              <div className="col-span-1">
                <Label htmlFor="description">Status</Label>
                <div className="w-full rounded-sm mt-2">
                  <ToggleSwitch<"done" | "todo" | "in-progress">
                    options={presetOptions.status}
                    value={toggleActive}
                    setToggle={setToggleActive}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <Label htmlFor="description" className="">
                  Priority
                </Label>
                <div className="w-full rounded-sm mt-2">
                  <ToggleSwitch<"high" | "medium" | "low">
                    options={presetOptions.priority}
                    value={togglePriority}
                    setToggle={setTogglePriority}
                  />
                </div>
              </div>
              <div className="col-span-1">
                {/* Due Date */}
                <DueDate
                  value={formData.dueDate}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, dueDate: value }))
                  }
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>
              <div className="flex flex-col col-span-1 gap-2">
                <Label className="">Project</Label>
                {/* Select Tags */}
                {/* <DropdownSelectTags/> */}
                <Selector
                  items={projectsLoading ? [] : projectsData}
                  placeholder={
                    projectsLoading ? "Loading projects..." : "Select project"
                  }
                  selectLabel="Project"
                  value={formData.projectId}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, projectId: value }));
                    if (errors.projectId) {
                      setErrors((prev) => ({ ...prev, projectId: undefined }));
                    }
                  }}
                  disabled={projectsLoading}
                />
                {errors.projectId && (
                  <p className="text-sm text-red-600">{errors.projectId}</p>
                )}
              </div>
              <div className="flex flex-col col-span-1 gap-2">
                <Label className="">Tags</Label>
                {/* Select Tags */}
                {/* <DropdownSelectTags/> */}
                <Selector
                  items={data}
                  placeholder="Select tags"
                  selectLabel="Tags"
                  value={formData.tags[0] || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: value ? [value] : [],
                    }))
                  }
                />
              </div>
              <div className="flex col-span-1 flex-col gap-2">
                <Label className="">Assignee</Label>
                {/* Select Tags */}
                {/* <DropdownSelectTags/> */}
                <Selector
                  items={assigneesData}
                  placeholder="Select assignees"
                  selectLabel="Assignee"
                  value={formData.assignee}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, assignee: value }))
                  }
                />
                {errors.assignee && (
                  <p className="text-sm text-red-600">{errors.assignee}</p>
                )}
              </div>

              <div className="grid gap-2 w-full col-span-2">
                <Label htmlFor="content">Attachments</Label>
                <InputGroup className="w-full rounded focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0">
                  <InputGroupInput
                    className="focus:outline-none focus:ring-0 focus:ring-offset-0"
                    placeholder="Search title..."
                    id="picture"
                    type="file"
                    // onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon className="">
                    <Paperclip size={18} />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {/* <div className="col-span-2">
                <Label htmlFor="content">Subtask</Label>
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2 p-3 border-x">
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="content">Content</Label>
                  <Input
                    id="content"
                    type="text"
                    placeholder="Content"
                    required
                  />
                </div>
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="content">Complete / Incomplete</Label>
                  <div className="w-full rounded-sm ">
                    <ToggleSwitch<"done" | "incomplete">
                      options={presetOptions.subtask}
                      value={toggleSubtask}
                      setToggle={setToggleSubtask}
                    />
                  </div>
                </div>
              </div> */}
            </div>
            <CardFooter className="flex items-baseline justify-around mt-4 mx-120">
              <Link
                href={"/tasks"}
                className="w-50 border p-1 rounded-lg text-center text-white max-w-xl bg-red-700 hover:bg-red-800"
              >
                Back
              </Link>
              <div className="w-50 rounded text-center max-w-xl">
                <Button
                  type="submit"
                  className="w-full bg-green-700  border p-1 rounded-lg text-center text-white"
                  disabled={createTaskMutation.isPending}
                >
                  {createTaskMutation.isPending ? "Creating..." : "Submit"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </div>
      </CardContent>
      <Separator className="mb-4" />
    </Card>
  );
}
