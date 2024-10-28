import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  inputType?: "input" | "textarea";
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export const EditableField = ({ 
  value, 
  onSave, 
  inputType = "input",
  className,
  inputClassName,
  placeholder = "No content"
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onSave(editedValue);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const InputComponent = inputType === "textarea" ? Textarea : Input;

  return (
    <div className={className}>
      {isEditing ? (
        <div className="space-y-2">
          <InputComponent
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className={inputClassName}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setEditedValue(value);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div 
          className="group cursor-pointer hover:bg-accent/50 p-2 rounded-md transition-colors"
          onClick={() => setIsEditing(true)}
        >
          <div className="flex items-center gap-2">
            <div className={cn("flex-grow", !value && "text-muted-foreground")}>
              {value || placeholder}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};