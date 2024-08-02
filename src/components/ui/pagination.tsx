import { Table } from "@tanstack/react-table";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { ReactNode, useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Input } from "./input";

interface PaginationProps<TData> {
  table: Table<TData>;
}

interface PaginationButtonProps {
  display: number | string;
  isDisabled?: boolean;
  onClick?: () => void;
}

const PaginationButton = ({
  display,
  isDisabled = false,
  onClick = () => {},
}: PaginationButtonProps) => {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={isDisabled}>
      {display}
    </Button>
  );
};

export default function Pagination<TData>({ table }: PaginationProps<TData>) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageArray: ReactNode[] = [];
  const maxEntryLength = table.getPageCount();
  const [pageJumpIndex, setPageJumpIndex] = useState(1);

  if (maxEntryLength <= 3) {
    for (let i = 0; i < maxEntryLength; i++) {
      pageArray.push(
        <PaginationButton
          display={i + 1}
          isDisabled={currentPage === i + 1}
          onClick={() => {
            setCurrentPage(i + 1);
            table.setPageIndex(i);
          }}
        />
      );
    }
  } else if (currentPage <= 3) {
    for (let i = 0; i < maxEntryLength; i++) {
      pageArray.push(
        <PaginationButton
          display={i + 1}
          isDisabled={currentPage === i + 1}
          onClick={() => {
            setCurrentPage(i + 1);
            table.setPageIndex(i);
          }}
        />
      );
    }
    pageArray.push(
      <Popover>
        <PopoverTrigger>
          <PaginationButton display={"..."} />
        </PopoverTrigger>
        <PopoverContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              table.setPageIndex(pageJumpIndex - 1);
            }}
          >
            <Input
              type="number"
              value={pageJumpIndex}
              onChange={(e) => setPageJumpIndex(Number(e.target.value))}
            />
          </form>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          table.previousPage();
          setCurrentPage(currentPage - 1);
        }}
        disabled={!table.getCanPreviousPage()}
      >
        <ArrowLeft2 size={24} color="#555555" />
      </Button>
      {pageArray}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          table.nextPage();
          setCurrentPage(currentPage + 1);
        }}
        disabled={!table.getCanNextPage()}
      >
        <ArrowRight2 size={24} color="#555555" />
      </Button>
    </div>
  );
}
