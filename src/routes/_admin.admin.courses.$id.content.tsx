import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Pencil, Trash2, ChevronLeft, ChevronRight, GripVertical, HelpCircle,
  Video, FileText, PlayCircle, FolderPlus, Loader2,
} from "lucide-react";
import {
  adminOutlineQuery, createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson, upsertQuiz, fetchAdminQuiz,
  type AdminOutlineLesson, type PlayerLesson,
} from "@/lib/api/player";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/courses/$id/content")({
  loader: ({ params, context }) =>
    (context as any).queryClient?.ensureQueryData(adminOutlineQuery(params.id)),
  component: ContentBuilder,
  errorComponent: ({ error }) => (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">
      {error.message}
    </div>
  ),
});

function iconFor(kind: string) {
  if (kind === "quiz") return HelpCircle;
  if (kind === "pdf" || kind === "text") return FileText;
  if (kind === "video") return Video;
  return PlayCircle;
}

function ContentBuilder() {
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(adminOutlineQuery(id));
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "outline", id] });

  const [moduleDlg, setModuleDlg] = useState<{ open: boolean; edit: any | null }>({ open: false, edit: null });
  const [lessonDlg, setLessonDlg] = useState<{ open: boolean; moduleId: string | null; edit: AdminOutlineLesson | null }>({
    open: false, moduleId: null, edit: null,
  });
  const [quizDlg, setQuizDlg] = useState<{ open: boolean; lesson: AdminOutlineLesson | null }>({ open: false, lesson: null });
  const [confirm, setConfirm] = useState<null | { kind: "module" | "lesson"; id: string; name: string }>(null);

  const delModule = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => { toast.success("Module deleted"); invalidate(); setConfirm(null); },
  });
  const delLesson = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => { toast.success("Lesson deleted"); invalidate(); setConfirm(null); },
  });

  const totalLessons = data.modules.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/admin/courses" className="hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" /> All courses
        </Link>
        <ChevronRight className="h-3 w-3 opacity-50" />
        <span className="text-foreground">{data.course.title}</span>
      </div>

      <AdminPageHeader
        title="Course content"
        description={`${data.modules.length} modules • ${totalLessons} lessons`}
        actions={
          <Button onClick={() => setModuleDlg({ open: true, edit: null })}>
            <FolderPlus className="mr-2 h-4 w-4" /> New module
          </Button>
        }
      />

      <div className="space-y-4">
        {data.modules.map((m, mi) => (
          <Card key={m.id} className="overflow-hidden border-border/60">
            <div className="flex items-start gap-3 border-b border-border/60 bg-muted/30 p-4">
              <GripVertical className="mt-1 h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Module {mi + 1}
                  </span>
                  <h3 className="truncate font-semibold">{m.title}</h3>
                </div>
                {m.description && (
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={() => setLessonDlg({ open: true, moduleId: m.id, edit: null })}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Lesson
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModuleDlg({ open: true, edit: m })}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost" size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setConfirm({ kind: "module", id: m.id, name: m.title })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border/60">
              {m.lessons.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  এই মডিউলে এখনো কোনো পাঠ নেই।
                </div>
              )}
              {m.lessons.map((l, li) => {
                const Icon = iconFor(l.kind);
                return (
                  <div key={l.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20">
                    <span className="w-6 text-center text-xs text-muted-foreground">{li + 1}</span>
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-medium">{l.title}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Badge variant="outline" className="capitalize">{l.kind}</Badge>
                        {l.durationMin && <span>{l.durationMin}m</span>}
                        {l.isFreePreview && <Badge variant="secondary" className="text-[10px]">Preview</Badge>}
                        {l.kind === "quiz" && (
                          <Badge variant={l.quiz ? "default" : "outline"} className="text-[10px]">
                            {l.quiz ? `${l.quiz._count.questions} Q • ${l.quiz.passMarks}%` : "কুইজ কনফিগার করুন"}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {l.kind === "quiz" && (
                        <Button variant="ghost" size="sm" onClick={() => setQuizDlg({ open: true, lesson: l })}>
                          <HelpCircle className="mr-1 h-3.5 w-3.5" /> Questions
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => setLessonDlg({ open: true, moduleId: m.id, edit: l })}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setConfirm({ kind: "lesson", id: l.id, name: l.title })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}

        {data.modules.length === 0 && (
          <Card className="border-dashed p-12 text-center">
            <FolderPlus className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <div className="mt-3 font-semibold">এখনো কোনো মডিউল নেই</div>
            <div className="mt-1 text-sm text-muted-foreground">প্রথম মডিউল তৈরি করে শুরু করুন</div>
            <Button className="mt-4" onClick={() => setModuleDlg({ open: true, edit: null })}>
              <Plus className="mr-2 h-4 w-4" /> New module
            </Button>
          </Card>
        )}
      </div>

      <ModuleDialog
        open={moduleDlg.open}
        edit={moduleDlg.edit}
        courseId={id}
        nextOrder={data.modules.length}
        onOpenChange={(o) => setModuleDlg({ open: o, edit: o ? moduleDlg.edit : null })}
        onSaved={invalidate}
      />
      <LessonDialog
        open={lessonDlg.open}
        moduleId={lessonDlg.moduleId}
        edit={lessonDlg.edit}
        nextOrder={
          lessonDlg.moduleId
            ? data.modules.find((m) => m.id === lessonDlg.moduleId)?.lessons.length ?? 0
            : 0
        }
        onOpenChange={(o) => setLessonDlg((s) => ({ ...s, open: o, edit: o ? s.edit : null }))}
        onSaved={invalidate}
      />
      <QuizDialog
        open={quizDlg.open}
        lesson={quizDlg.lesson}
        onOpenChange={(o) => setQuizDlg((s) => ({ ...s, open: o, lesson: o ? s.lesson : null }))}
        onSaved={invalidate}
      />

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নিশ্চিত করুন</DialogTitle>
            <DialogDescription>
              "{confirm?.name}" ডিলিট করবেন? এটি আর ফিরিয়ে আনা যাবে না।
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!confirm) return;
                if (confirm.kind === "module") delModule.mutate(confirm.id);
                else delLesson.mutate(confirm.id);
              }}
              disabled={delModule.isPending || delLesson.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─────────────── Module dialog ───────────────
function ModuleDialog({
  open, onOpenChange, edit, courseId, nextOrder, onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  edit: any | null;
  courseId: string;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Reset when opened
  const key = edit?.id ?? "new";
  const [k, setK] = useState<string>("");
  if (open && k !== key) {
    setK(key);
    setTitle(edit?.title ?? "");
    setDescription(edit?.description ?? "");
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Title required");
      if (edit) return updateModule(edit.id, { title, description });
      return createModule({ courseId, title, description, order: nextOrder });
    },
    onSuccess: () => {
      toast.success(edit ? "Module updated" : "Module created");
      onSaved();
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit module" : "New module"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="মডিউল-১: ভূমিকা" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────── Lesson dialog ───────────────
function LessonDialog({
  open, onOpenChange, moduleId, edit, nextOrder, onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  moduleId: string | null;
  edit: AdminOutlineLesson | null;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<PlayerLesson["kind"]>("video");
  const [contentUrl, setContentUrl] = useState("");
  const [body, setBody] = useState("");
  const [durationMin, setDurationMin] = useState<string>("");
  const [isFreePreview, setIsFreePreview] = useState(false);

  const key = edit?.id ?? `new-${moduleId}`;
  const [k, setK] = useState<string>("");
  if (open && k !== key) {
    setK(key);
    setTitle(edit?.title ?? "");
    setKind(edit?.kind ?? "video");
    setContentUrl(edit?.contentUrl ?? "");
    setBody(edit?.body ?? "");
    setDurationMin(edit?.durationMin?.toString() ?? "");
    setIsFreePreview(edit?.isFreePreview ?? false);
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Title required");
      const payload = {
        title, kind,
        contentUrl: contentUrl || null,
        body: body || null,
        durationMin: durationMin ? Number(durationMin) : null,
        isFreePreview,
      };
      if (edit) return updateLesson(edit.id, payload);
      if (!moduleId) throw new Error("Module missing");
      return createLesson({ moduleId, order: nextOrder, ...payload });
    },
    onSuccess: () => {
      toast.success(edit ? "Lesson updated" : "Lesson created");
      onSaved();
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{edit ? "Edit lesson" : "New lesson"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={kind} onValueChange={(v: any) => setKind(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="text">Text / Article</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input type="number" value={durationMin} onChange={(e) => setDurationMin(e.target.value)} />
            </div>
          </div>

          {(kind === "video" || kind === "pdf") && (
            <div>
              <Label>{kind === "video" ? "Video URL (mp4 / HLS)" : "PDF URL"}</Label>
              <Input value={contentUrl} onChange={(e) => setContentUrl(e.target.value)} placeholder="https://…" />
            </div>
          )}

          {kind === "text" && (
            <div>
              <Label>Content</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Article body…" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch checked={isFreePreview} onCheckedChange={setIsFreePreview} />
            <Label className="text-sm">Free preview (non-enrolled students can watch)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────── Quiz dialog ───────────────
type QDraft = { prompt: string; options: string[]; correctIndex: number; points: number };

function QuizDialog({
  open, onOpenChange, lesson, onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lesson: AdminOutlineLesson | null;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("Quiz");
  const [passMarks, setPassMarks] = useState<string>("60");
  const [questions, setQuestions] = useState<QDraft[]>([]);
  const [loaded, setLoaded] = useState<string>("");

  if (open && lesson && loaded !== lesson.id) {
    setLoaded(lesson.id);
    setTitle("Quiz");
    setPassMarks("60");
    setQuestions([]);
    fetchAdminQuiz(lesson.id).then((r: any) => {
      if (r.quiz) {
        setTitle(r.quiz.title || "Quiz");
        setPassMarks(String(r.quiz.passMarks ?? 60));
        setQuestions(
          (r.quiz.questions || []).map((q: any) => ({
            prompt: q.prompt,
            options: Array.isArray(q.options) ? q.options : [],
            correctIndex: q.correctIndex,
            points: q.points ?? 1,
          })),
        );
      }
    }).catch(() => null);
  }

  const save = useMutation({
    mutationFn: async () => {
      if (!lesson) throw new Error("No lesson");
      if (questions.length === 0) throw new Error("Add at least one question");
      for (const q of questions) {
        if (!q.prompt.trim()) throw new Error("Every question needs a prompt");
        if (q.options.filter((o) => o.trim()).length < 2) throw new Error("At least 2 options per question");
        if (q.correctIndex < 0 || q.correctIndex >= q.options.length) throw new Error("Pick a correct option");
      }
      return upsertQuiz({
        lessonId: lesson.id,
        title,
        passMarks: Number(passMarks) || 60,
        questions,
      });
    },
    onSuccess: () => { toast.success("Quiz saved"); onSaved(); onOpenChange(false); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  function addQ() {
    setQuestions((qs) => [...qs, { prompt: "", options: ["", ""], correctIndex: 0, points: 1 }]);
  }
  function updQ(i: number, patch: Partial<QDraft>) {
    setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }
  function delQ(i: number) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quiz — {lesson?.title}</DialogTitle>
          <DialogDescription>Configure questions, options, correct answer & marks.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Quiz title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Pass mark %</Label>
              <Input type="number" value={passMarks} onChange={(e) => setPassMarks(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => (
              <Card key={i} className="border-border/60 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Q{i + 1}
                  </span>
                  <Input
                    className="flex-1"
                    placeholder="প্রশ্ন লিখুন…"
                    value={q.prompt}
                    onChange={(e) => updQ(i, { prompt: e.target.value })}
                  />
                  <Input
                    className="w-20"
                    type="number"
                    placeholder="Pts"
                    value={q.points}
                    onChange={(e) => updQ(i, { points: Number(e.target.value) || 1 })}
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => delQ(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={q.correctIndex === oi}
                        onChange={() => updQ(i, { correctIndex: oi })}
                        className="h-4 w-4"
                      />
                      <Input
                        value={opt}
                        placeholder={`Option ${oi + 1}`}
                        onChange={(e) => {
                          const options = [...q.options];
                          options[oi] = e.target.value;
                          updQ(i, { options });
                        }}
                      />
                      {q.options.length > 2 && (
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => {
                            const options = q.options.filter((_, idx) => idx !== oi);
                            updQ(i, {
                              options,
                              correctIndex: Math.min(q.correctIndex, options.length - 1),
                            });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline" size="sm" className="mt-1"
                    onClick={() => updQ(i, { options: [...q.options, ""] })}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Option
                  </Button>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addQ}>
              <Plus className="mr-1 h-4 w-4" /> Add question
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
