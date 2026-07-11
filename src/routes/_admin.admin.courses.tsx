import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  listAdminCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublished,
  type AdminCourseDto,
} from "@/lib/admin.functions";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, BookOpen, Radio, Video } from "lucide-react";
import { toast } from "sonner";

const coursesQuery = queryOptions({
  queryKey: ["admin", "courses"],
  queryFn: () => listAdminCourses(),
});

export const Route = createFileRoute("/_admin/admin/courses")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(coursesQuery);
  },
  component: CoursesPage,
  errorComponent: ({ error }) => (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">
      {error.message}
    </div>
  ),
});

const CATEGORY_LABEL: Record<string, string> = {
  diploma: "Diploma",
  talimul_quran: "Talimul Quran",
  free: "Free",
  teacher_training: "Teacher Training",
};

type FormState = {
  id?: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  description: string;
  coverUrl: string;
  category: "diploma" | "talimul_quran" | "free" | "teacher_training";
  type: "live" | "recorded";
  durationMinutes: number;
  isPublished: boolean;
  instructor: string;
  categoryLabel: string;
  level: "beginner" | "intermediate" | "advanced";
  durationText: string;
  lessonsCount: number;
  price: number;
  originalPrice: number | "";
  rating: number;
  students: number;
  longDescription: string;
  learnPoints: string;
  requirements: string;
  modules: string;
};

const EMPTY_FORM: FormState = {
  slug: "",
  titleBn: "",
  titleEn: "",
  description: "",
  coverUrl: "",
  category: "diploma",
  type: "recorded",
  durationMinutes: 0,
  isPublished: false,
  instructor: "",
  categoryLabel: "",
  level: "beginner",
  durationText: "",
  lessonsCount: 0,
  price: 0,
  originalPrice: "",
  rating: 0,
  students: 0,
  longDescription: "",
  learnPoints: "",
  requirements: "",
  modules: "",
};

const toLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const fromLines = (arr: string[] | null | undefined) => (arr ?? []).join("\n");

function CoursesPage() {
  const { data: courses } = useSuspenseQuery(coursesQuery);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const createMut = useMutation({
    mutationFn: (d: FormState) =>
      createCourse({
        data: {
          slug: d.slug,
          titleBn: d.titleBn,
          titleEn: d.titleEn || null,
          description: d.description || null,
          coverUrl: d.coverUrl || null,
          category: d.category,
          type: d.type,
          durationMinutes: d.durationMinutes,
          isPublished: d.isPublished,
        },
      }),
    onSuccess: () => {
      toast.success("Course created");
      setOpen(false);
      invalidate();
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const updateMut = useMutation({
    mutationFn: (d: FormState & { id: string }) =>
      updateCourse({
        data: {
          id: d.id,
          slug: d.slug,
          titleBn: d.titleBn,
          titleEn: d.titleEn || null,
          description: d.description || null,
          coverUrl: d.coverUrl || null,
          category: d.category,
          type: d.type,
          durationMinutes: d.durationMinutes,
          isPublished: d.isPublished,
        },
      }),
    onSuccess: () => {
      toast.success("Course updated");
      setOpen(false);
      invalidate();
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const toggleMut = useMutation({
    mutationFn: (v: { id: string; isPublished: boolean }) =>
      toggleCoursePublished({ data: v }),
    onSuccess: () => invalidate(),
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteCourse({ data: { id } }),
    onSuccess: () => {
      toast.success("Course deleted");
      setDeleteId(null);
      invalidate();
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  function openCreate() {
    setForm(EMPTY_FORM);
    setOpen(true);
  }
  function openEdit(c: AdminCourseDto) {
    setForm({
      id: c.id,
      slug: c.slug,
      titleBn: c.titleBn,
      titleEn: c.titleEn ?? "",
      description: c.description ?? "",
      coverUrl: c.coverUrl ?? "",
      category: c.category,
      type: c.type,
      durationMinutes: c.durationMinutes,
      isPublished: c.isPublished,
    });
    setOpen(true);
  }

  function submit() {
    if (!form.slug || !form.titleBn) {
      toast.error("Slug and Bangla title are required");
      return;
    }
    if (form.id) {
      updateMut.mutate({ ...form, id: form.id });
    } else {
      createMut.mutate(form);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <AdminPageHeader
        title="Course Catalog"
        description={`${courses.length} courses • ${courses.filter(c => c.isPublished).length} published`}
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> New course
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map(c => (
          <Card
            key={c.id}
            className="group flex flex-col overflow-hidden border-border/60 bg-card transition-all hover:border-primary/40 hover:shadow-xl"
          >
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10">
              {c.coverUrl ? (
                <img src={c.coverUrl} alt={c.titleBn} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-primary/40">
                  <BookOpen className="h-12 w-12" />
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-1">
                <Badge variant="outline" className="bg-background/90 backdrop-blur border-border/60 capitalize">
                  {c.type === "live" ? <Radio className="mr-1 h-3 w-3" /> : <Video className="mr-1 h-3 w-3" />}
                  {c.type}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge
                  variant="outline"
                  className={
                    c.isPublished
                      ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40 backdrop-blur"
                      : "bg-muted/80 text-muted-foreground border-border backdrop-blur"
                  }
                >
                  {c.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="text-xs font-medium uppercase tracking-wider text-primary/80">
                {CATEGORY_LABEL[c.category]}
              </div>
              <h3 className="mt-1 font-semibold leading-snug line-clamp-2">{c.titleBn}</h3>
              {c.titleEn && (
                <div className="text-xs text-muted-foreground line-clamp-1">{c.titleEn}</div>
              )}
              <div className="mt-2 text-xs text-muted-foreground line-clamp-2 flex-1">
                {c.description ?? "No description"}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{c.durationMinutes} min</span>
                <span>{c.teacherNames.length} teacher{c.teacherNames.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={c.isPublished}
                    onCheckedChange={v => toggleMut.mutate({ id: c.id, isPublished: v })}
                  />
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
                <div className="ml-auto flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(c.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {courses.length === 0 && (
          <Card className="col-span-full border-dashed border-border/60 p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <div className="mt-3 font-semibold">No courses yet</div>
            <div className="text-sm text-muted-foreground">Create your first course to get started</div>
            <Button className="mt-4" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" /> New course
            </Button>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit course" : "New course"}</DialogTitle>
            <DialogDescription>
              Course details are visible to students once published.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="titleBn">Title (Bangla) *</Label>
              <Input id="titleBn" value={form.titleBn} onChange={e => setForm({ ...form, titleBn: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input id="titleEn" value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={form.slug}
                placeholder="quran-tajwid-basic"
                onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recorded">Recorded</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min={0}
                value={form.durationMinutes}
                onChange={e => setForm({ ...form, durationMinutes: parseInt(e.target.value || "0", 10) })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="cover">Cover image URL</Label>
              <Input
                id="cover"
                value={form.coverUrl}
                placeholder="https://…"
                onChange={e => setForm({ ...form, coverUrl: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
              <Switch checked={form.isPublished} onCheckedChange={v => setForm({ ...form, isPublished: v })} />
              <div>
                <div className="text-sm font-medium">Published</div>
                <div className="text-xs text-muted-foreground">Visible to students in the catalog</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={createMut.isPending || updateMut.isPending}>
              {form.id ? "Save changes" : "Create course"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
