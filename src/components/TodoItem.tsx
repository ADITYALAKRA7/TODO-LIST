
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2, Check, X } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");

  const handleSave = () => {
    onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setIsEditing(false);
  };

  const toggleCompleted = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${
      todo.completed 
        ? 'bg-gray-50 border-gray-200' 
        : 'bg-white border-indigo-200 hover:shadow-md'
    }`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={toggleCompleted}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Todo title"
                className="font-medium"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                className="resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!editTitle.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="w-3 h-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className={`${todo.completed ? 'opacity-60' : ''}`}>
              <h3 className={`font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`text-sm mt-1 ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Created {new Date(todo.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 hover:bg-indigo-100"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TodoItem;
