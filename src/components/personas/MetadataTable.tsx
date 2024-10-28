import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save } from "lucide-react";
import { Json } from "@/integrations/supabase/types/json";

interface MetadataTableProps {
  metadata: Json | null;
  onUpdate: (metadata: Record<string, Json>) => Promise<void>;
}

type MetadataEntry = [string, Json];

export const MetadataTable = ({ metadata, onUpdate }: MetadataTableProps) => {
  const [entries, setEntries] = useState<MetadataEntry[]>(() => {
    if (!metadata || typeof metadata !== "object") return [];
    return Object.entries(metadata);
  });
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAddEntry = () => {
    if (!newKey.trim()) return;
    setEntries([...entries, [newKey, newValue]]);
    setNewKey("");
    setNewValue("");
    setIsEditing(true);
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
    setIsEditing(true);
  };

  const handleUpdateEntry = (index: number, key: string, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = [key, value];
    setEntries(newEntries);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const newMetadata = Object.fromEntries(entries);
    await onUpdate(newMetadata);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(([key, value], index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={key}
                    onChange={(e) => handleUpdateEntry(index, e.target.value, String(value))}
                    className="min-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={String(value)}
                    onChange={(e) => handleUpdateEntry(index, key, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEntry(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Input
                  placeholder="New key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  placeholder="New value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddEntry}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};