"use client";

import { Button } from "./button";

export default function DeleteModal({
  title,
  confirmationMessage,
  onCancel,
  onDelete,
}: {
  title: string;
  confirmationMessage: string;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <form>
      <div className="z-10 fixed inset-0 bg-black/30 overflow-y-auto h-screen w-screen flex items-center justify-center">
        <div className="m-1 border bg-white border-warning w-full shadow-lg rounded-md bg-white max-w-[600px]">
          <div className="text-center">
            <h1 className="text-3xl w-full border-b-2 border-black text-warning">
              {title}
            </h1>
            <div className="m-0 p-0">{confirmationMessage}</div>
            <div className="flex justify-center my-2">
              <Button
                onClick={onCancel}
                className="hover:bg-accent2/60 hover:text-black mx-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onDelete}
                className="hover:bg-warning mx-1"
              >
                Do it!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
