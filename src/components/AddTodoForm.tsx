
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface AddTodoFormProps {
  onSubmit: (title: string, description?: string) => void;
  onCancel: () => void;
}

const AddTodoForm = ({ onSubmit, onCancel }: AddTodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        autoFocus
        required
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className="resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Todo
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-3"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default AddTodoForm;
