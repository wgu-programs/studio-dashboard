import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Page {
  page_id: string;
  url: string;
  title: string | null;
  description: string | null;
  status: string | null;
  snapshot_url: string | null;
}

interface PageTableProps {
  pages: Page[];
}

export const PageTable = ({ pages }: PageTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.page_id}>
            <TableCell className="font-medium">{page.title || "Untitled"}</TableCell>
            <TableCell>{page.url}</TableCell>
            <TableCell>{page.status}</TableCell>
            <TableCell className="max-w-md truncate">
              {page.description || "No description"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};