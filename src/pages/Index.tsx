
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import TodoItem from "@/components/TodoItem";
import AddTodoForm from "@/components/AddTodoForm";
import { supabase } from "@/integrations/supabase/client";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title, description, completed: false }])
        .select()
        .single();

      if (error) throw error;
      setTodos(prev => [data, ...prev]);
      setShowAddForm(false);
      toast.success('Todo added successfully!');
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, ...updates } : todo
      ));
      toast.success('Todo updated successfully!');
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully!');
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  };

  const generateSummary = async () => {
    setSummarizing(true);
    try {
      const pendingTodos = todos.filter(todo => !todo.completed);
      
      if (pendingTodos.length === 0) {
        toast.error('No pending todos to summarize');
        return;
      }

      const { data, error } = await supabase.functions.invoke('summarize-todos', {
        body: { todos: pendingTodos }
      });

      if (error) throw error;
      
      toast.success('Summary generated and sent to Slack!');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setSummarizing(false);
    }
  };

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todo Summary Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Manage your tasks and get AI-powered summaries
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Add Todo Card */}
          <Card className="md:col-span-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Todo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showAddForm ? (
                <AddTodoForm
                  onSubmit={addTodo}
                  onCancel={() => setShowAddForm(false)}
                />
              ) : (
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Todo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Summary Action Card */}
          <Card className="md:col-span-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {pendingTodos.length} pending todos ready for summary
                  </p>
                  <p className="text-xs text-gray-500">
                    Generate an AI-powered summary and send it to Slack
                  </p>
                </div>
                <Button
                  onClick={generateSummary}
                  disabled={pendingTodos.length === 0 || summarizing}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {summarizing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <MessageSquare className="w-4 h-4 mr-2" />
                  )}
                  {summarizing ? 'Generating...' : 'Generate Summary'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Todos */}
        {pendingTodos.length > 0 && (
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                Pending Todos ({pendingTodos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-gray-600">
                Completed Todos ({completedTodos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {todos.length === 0 && (
          <Card className="mt-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No todos yet</h3>
                <p className="text-sm">Add your first todo to get started!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
